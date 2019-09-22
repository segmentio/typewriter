import { JSONSchema7 } from 'json-schema'
import { parse, Schema, getPropertiesSchema, Type } from './ast'
import { javascript } from './javascript'
import { ios } from './ios'
import { Options, SDK } from './options'
import { registerStandardHelpers, generateFromTemplate } from '../templates'
import { Namer, Options as NamerOptions } from './namer'
import stringify from 'json-stable-stringify'

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

export interface BaseRootContext<T extends object, O extends object, P extends object> {
	isDevelopment: boolean
	language: string
	typewriterVersion: string
	tracks: (T & BaseTrackCallContext<P>)[]
	objects: (O & BaseObjectContext<P>)[]
}

export interface BaseTrackCallContext<P extends object> {
	// The optional function description.
	functionDescription?: string
	// The raw JSON Schema for this event.
	rawJSONSchema: string
	// The raw version of the name of this track call (the name sent to Segment).
	rawEventName: string
	// The property parameters on this track call. Included if generatePropertiesObject=false.
	properties?: (P & BasePropertyContext)[]
}

export interface BaseObjectContext<P extends object> {
	description?: string
	properties: (P & BasePropertyContext)[]
}

export interface BasePropertyContext {
	// The raw name of this property. ex: "user id"
	rawName: string
	// The AST type of this property. ex: Type.INTEGER
	schemaType: Type
	// The optional description of this property.
	description?: string
	isRequired: boolean
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
/*
 * Adding a new language to Typewriter involves implementing the interface below. The logic to traverse a
 * JSON Schema and apply this generator is in `runGenerator` below.
 *
 * Depending on what is idiomatic for each language, you may prefer for function calls to receive a single
 * object containing all analytics properties, or you may prefer to enumerate all top-level properties
 * as parameters to each function. You can toggle this behavior with `generatePropertiesObject`.
 */
export declare type Generator<
	R extends object,
	T extends object,
	O extends object,
	P extends object
> = {
	namer: NamerOptions
	setup: (options: GenOptions) => Promise<R>
	generatePrimitive: (client: GeneratorClient, schema: Schema, parentPath: string) => Promise<P>
	generateArray: (
		client: GeneratorClient,
		schema: Schema,
		items: P & BasePropertyContext,
		parentPath: string
	) => Promise<P>
	generateObject: (
		client: GeneratorClient,
		schema: Schema,
		properties: (P & BasePropertyContext)[],
		parentPath: string
	) => Promise<[P, O | undefined]>
	generateUnion: (
		client: GeneratorClient,
		schema: Schema,
		types: (P & BasePropertyContext)[],
		parentPath: string
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
		return await runGenerator(ios, parsedTrackingPlan, options)
	} else {
		throw new Error(`Invalid SDK: ${options.client.sdk}`)
	}
}

async function runGenerator<R extends object, T extends object, O extends object, P extends object>(
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

	// Core generator logic. This logic involves traversing over the underlying JSON Schema
	// and calling out to the supplied generator with each "node" in the JSON Schema that,
	// based on its AST type. Each iteration of this loop generates a "property" which
	// represents the type for a given schema. This property contains metadata such as the
	// type name (string, FooBarInterface, etc.), descriptions, etc. that are used in
	// templates.
	const traverseSchema = async (
		schema: Schema,
		parentPath: string
	): Promise<P & BasePropertyContext> => {
		const path = `${parentPath}->${schema.name}`
		const base = {
			rawName: client.namer.escapeString(schema.name),
			schemaType: schema.type,
			description: schema.description,
			isRequired: !!schema.isRequired,
		}

		let p: P
		if ([Type.ANY, Type.STRING, Type.BOOLEAN, Type.INTEGER, Type.NUMBER].includes(schema.type)) {
			// Primitives are any type that doesn't require generating a "subtype".
			p = await generator.generatePrimitive(client, schema, parentPath)
		} else if (schema.type === Type.OBJECT) {
			// For objects, we need to recursively generate each property first.
			const properties: (P & BasePropertyContext)[] = []
			for (const property of schema.properties) {
				properties.push(await traverseSchema(property, path))
			}

			// TODO: determine if there's a simpler way to generate objects that doesn't require
			// returning two fields. We do this now because objects have extra metadata. Possibly
			// we could consider including an optional `properties` field in the property type?
			// Maybe instead of a ObjectContext, an ObjectPropertyContext? Required on the return.
			// Hmm, need some way to convey if it should generate an object or not (undefined object).
			let o: O | undefined
			;[p, o] = await generator.generateObject(client, schema, properties, parentPath)
			if (o) {
				context.objects.push({
					properties,
					...o,
				})
			}
		} else if (schema.type === Type.ARRAY) {
			// Arrays are another special case, because we need to generate a type to represent
			// the items allowed in this array.
			const itemsSchema: Schema = {
				name: schema.name + ' Item',
				description: schema.description,
				...schema.items,
			}
			const items = await traverseSchema(itemsSchema, path)
			p = await generator.generateArray(client, schema, items, parentPath)
		} else if (schema.type === Type.UNION) {
			// For unions, we generate a property type to represent each of the possible types
			// then use that list of possible property types to generate a union.
			const types = await Promise.all(
				schema.types.map(async t => {
					const subSchema = {
						name: schema.name,
						description: schema.description,
						...t,
					}

					return await traverseSchema(subSchema, path)
				})
			)
			p = await generator.generateUnion(client, schema, types, parentPath)
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
		let t: T
		if (generator.generatePropertiesObject) {
			const p = await traverseSchema(getPropertiesSchema(schema), '')
			t = await generator.generateTrackCall(client, schema, p)
		} else {
			const properties: (P & BasePropertyContext)[] = []
			for (const property of getPropertiesSchema(schema).properties) {
				properties.push(await traverseSchema(property, schema.name))
			}
			t = {
				...(await generator.generateTrackCall(client, schema, properties)),
				properties,
			}
		}

		context.tracks.push({
			functionDescription: schema.description,
			rawJSONSchema: stringify(raw, {
				space: '\t',
			}),
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
