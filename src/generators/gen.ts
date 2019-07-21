import { JSONSchema7 } from 'json-schema'
import { parse, Schema, getPropertiesSchema, Type } from './ast'
import { javascript } from './javascript'
import ios from './ios'
import { Options, SDK } from './options'
import { registerStandardHelpers, generateFromTemplate } from '../templates'
import { Namer, Options as NamerOptions } from './namer'
import { camelCase } from 'lodash'

export interface File {
	path: string
	contents: string
}

export interface RawTrackingPlan {
	trackCalls: JSONSchema7[]
}

export interface TrackingPlan {
	trackCalls: {
		raw: JSONSchema7
		schema: Schema
	}[]
}

interface BaseRootContext<T extends object, O extends object, P extends ExpectedPropertyContext> {
	isDevelopment: boolean
	language: string
	typewriterVersion: string
	tracks: (T & BaseTrackCallContext)[]
	objects: (O & BaseObjectContext<P>)[]
}

interface BaseTrackCallContext {
	// The formatted function name.
	functionName: string
	// The optional function description.
	functionDescription?: string
	// The raw JSON Schema for this event.
	rawJSONSchema: string
	// The raw version of the name of this track call (the name sent to Segment).
	rawEventName: string
}

interface BaseObjectContext<P extends ExpectedPropertyContext> {
	name: string
	description?: string
	properties: (P & BasePropertyContext)[]
}

interface BasePropertyContext {
	name: string
	description?: string
	isRequired: boolean
}

interface ExpectedPropertyContext {
	type: string
}

export interface GeneratorClient {
	options: GenOptions
	namer: Namer
	generateFile: <T extends object>(
		outputPath: string,
		templatePath: string,
		context: T
	) => Promise<void>
}

export declare type Generator<
	R extends object,
	T extends object,
	O extends object,
	P extends ExpectedPropertyContext
> = {
	namer: NamerOptions
	setup: (options: GenOptions) => Promise<R>
	generatePrimitive: (client: GeneratorClient, schema: Schema) => Promise<P>
	generateArray: (
		client: GeneratorClient,
		schema: Schema,
		items: P & BasePropertyContext
	) => Promise<P>
	generateObject: (
		client: GeneratorClient,
		schema: Schema,
		properties: (P & BasePropertyContext)[]
	) => Promise<[P, O | undefined]>
	generateUnion: (
		client: GeneratorClient,
		schema: Schema,
		types: (P & BasePropertyContext)[]
	) => Promise<P>
	generateRoot: (client: GeneratorClient, context: R & BaseRootContext<T, O, P>) => Promise<void>
	formatFile?: (client: GeneratorClient, file: File) => File
} & (
	| {
			generatePropertiesObject: true
			generateTrackCall: (
				client: GeneratorClient,
				schema: Schema,
				propertiesObject: P & BasePropertyContext
			) => Promise<T>
	  }
	| {
			generatePropertiesObject: false
			generateTrackCall: (
				client: GeneratorClient,
				schema: Schema,
				properties: (P & BasePropertyContext)[]
			) => Promise<T>
	  })

export interface GenOptions {
	// Configuration options configured by the typewriter.yml config.
	client: Options
	// The version of the Typewriter CLI that is being used to generate clients.
	// Used for analytics purposes by the Typewriter team.
	typewriterVersion: string
	// Whether or not to generate a development bundle. If so, analytics payloads will
	// be validated against the full JSON Schema before being sent to the underlying
	// analytics instance.
	isDevelopment: boolean
}

export async function gen(trackingPlan: RawTrackingPlan, options: GenOptions): Promise<File[]> {
	const parsedTrackingPlan = {
		trackCalls: trackingPlan.trackCalls.map(s => {
			const sanitizedSchema = {
				$schema: 'http://json-schema.org/draft-07/schema#',
				...s,
			}

			return {
				raw: sanitizedSchema,
				schema: parse(sanitizedSchema),
			}
		}),
	}

	if (options.client.sdk === SDK.WEB || options.client.sdk === SDK.NODE) {
		return await runGenerator(javascript, parsedTrackingPlan, options)
	} else if (options.client.sdk === SDK.IOS) {
		return await ios(parsedTrackingPlan, options)
	} else {
		throw new Error(`Invalid SDK: ${options.client.sdk}`)
	}
}

async function runGenerator<
	R extends object,
	T extends object,
	O extends object,
	P extends ExpectedPropertyContext
>(
	generator: Generator<R, T, O, P>,
	trackingPlan: TrackingPlan,
	options: GenOptions
): Promise<File[]> {
	// One-time setup.
	registerStandardHelpers()
	const rootContext = await generator.setup(options)
	const context: R & BaseRootContext<T, O, P> = {
		...rootContext,
		isDevelopment: options.isDevelopment,
		language: options.client.language,
		typewriterVersion: options.typewriterVersion,
		tracks: [],
		objects: [],
	}

	// File output.
	const files: File[] = []
	const generateFile = async <C extends object>(
		outputPath: string,
		templatePath: string,
		fileContext: C
	) => {
		files.push({
			path: outputPath,
			contents: await generateFromTemplate<C & BaseRootContext<T, O, P>>(templatePath, {
				...context,
				...fileContext,
			}),
		})
	}

	const client: GeneratorClient = {
		options,
		namer: new Namer(generator.namer),
		generateFile,
	}

	// Generator logic.
	const traverseSchema = async (schema: Schema): Promise<P & BasePropertyContext> => {
		const base = {
			name: client.namer.escapeString(schema.name),
			description: schema.description,
			isRequired: !!schema.isRequired,
		}

		let p: P
		if ([Type.ANY, Type.STRING, Type.BOOLEAN, Type.INTEGER, Type.NUMBER].includes(schema.type)) {
			p = await generator.generatePrimitive(client, schema)
		} else if (schema.type === Type.OBJECT) {
			const properties: (P & BasePropertyContext)[] = []
			for (const property of schema.properties) {
				properties.push(await traverseSchema(property))
			}

			let o: O | undefined
			;[p, o] = await generator.generateObject(client, schema, properties)
			if (o) {
				context.objects.push({
					name: p.type,
					properties,
					...o,
				})
			}
		} else if (schema.type === Type.ARRAY) {
			const itemsSchema: Schema = {
				name: schema.name,
				description: schema.description,
				...schema.items,
			}
			const items = await traverseSchema(itemsSchema)
			p = await generator.generateArray(client, schema, items)
		} else if (schema.type === Type.UNION) {
			const types = await Promise.all(
				schema.types.map(async t => {
					const subSchema = {
						name: schema.name,
						description: schema.description,
						...t,
					}

					return await traverseSchema(subSchema)
				})
			)
			p = await generator.generateUnion(client, schema, types)
		} else {
			throw new Error(`Invalid Schema Type: ${schema.type}`)
		}

		return {
			...base,
			...p,
		}
	}

	// Generate Track Calls.
	for (const { raw, schema } of trackingPlan.trackCalls) {
		// TODO: allow generating multiple track calls at a time (for overloading)
		let t: T
		if (generator.generatePropertiesObject) {
			const p = await traverseSchema(getPropertiesSchema(schema))
			t = await generator.generateTrackCall(client, schema, p)
		} else {
			const properties: (P & BasePropertyContext)[] = []
			for (const property of getPropertiesSchema(schema).properties) {
				properties.push(await traverseSchema(property))
			}
			t = await generator.generateTrackCall(client, schema, properties)
		}

		context.tracks.push({
			functionName: client.namer.register(schema.name, 'function', { transform: camelCase }),
			functionDescription: schema.description,
			rawJSONSchema: JSON.stringify(raw, undefined, '\t'),
			rawEventName: client.namer.escapeString(schema.name),
			...t,
		})
	}

	// Perform any root-level generation.
	await generator.generateRoot(client, context)

	// Format and output all generated files.
	return files.map(f => (generator.formatFile ? generator.formatFile(client, f) : f))
}

// Legacy Code:
export interface TemplateBaseContext {
	isDevelopment: boolean
	language: string
	typewriterVersion: string
}

export function baseContext(options: GenOptions): TemplateBaseContext {
	return {
		isDevelopment: options.isDevelopment,
		language: options.client.language,
		typewriterVersion: options.typewriterVersion,
	}
}
