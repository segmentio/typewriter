import { JSONSchema7 } from 'json-schema'
import {
	parse,
	Schema,
	getPropertiesSchema,
	Type,
	isPrimitiveType,
	isArrayTypeSchema,
	isObjectTypeSchema,
	isUnionTypeSchema,
	PrimitiveTypeSchema,
	ArrayTypeSchema,
	ObjectTypeSchema,
	UnionTypeSchema,
	Enumable,
} from './ast'
import { javascript } from './javascript'
import { ios } from './ios'
import { Options, SDK } from './options'
import { registerStandardHelpers, generateFromTemplate } from '../templates'
import { Namer, Options as NamerOptions } from './namer'
import stringify from 'json-stable-stringify'
import hash from 'object-hash'

export interface File {
	path: string
	contents: string
}

export interface RawTrackingPlan {
	name: string
	url: string
	path: string
	trackCalls: JSONSchema7[]
}

export interface TrackingPlan {
	url: string
	trackCalls: {
		raw: JSONSchema7
		schema: Schema
	}[]
}

export interface BaseRootContext<
	T extends object,
	O extends object,
	P extends object,
	E extends object
> {
	isDevelopment: boolean
	language: string
	typewriterVersion: string
	trackingPlanURL: string
	tracks: (T & BaseTrackCallContext<P>)[]
	objects: (O & BaseObjectContext<P>)[]
	enums: (E & BaseEnumContext)[]
}

export interface ExpectedTrackCallContext {
	// The formatted function name, ex: "orderCompleted".
	functionName: string
}
export interface BaseTrackCallContext<P extends object> extends ExpectedTrackCallContext {
	// The optional function description.
	functionDescription?: string
	// The raw JSON Schema for this event.
	rawJSONSchema: string
	// The raw version of the name of this track call (the name sent to Segment).
	rawEventName: string
	// The property parameters on this track call. Included if generatePropertiesObject=false.
	properties?: (P & BasePropertyContext)[]
}

export interface ExpectedObjectContext {
	// The formatted name for this object, ex: "Planet"
	name: string
}
export interface BaseObjectContext<P extends object> extends ExpectedObjectContext {
	description?: string
	properties: (P & BasePropertyContext)[]
}

export interface ExpectedPropertyContext {
	// The formatted name for this property, ex: "numAvocados".
	name: string
	// The type of this property. ex: "number".
	type: string
}
export interface BasePropertyContext extends ExpectedPropertyContext {
	// The raw name of this property. ex: "user id"
	rawName: string
	// The AST type of this property. ex: Type.INTEGER
	schemaType: Type
	// The optional description of this property.
	description?: string
	isRequired: boolean
}

export interface ExpectedEnumContext {
	// The name of this enum. ex: "AvocadoType".
	name: string
	values: { name: string; value: string }[]
}
export interface BaseEnumContext extends ExpectedEnumContext {}

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
	R extends object = {},
	T extends object = {},
	O extends object = {},
	P extends object = {},
	E extends object = {}
> = {
	namer: NamerOptions
	setup: (options: GenOptions) => Promise<R>
	generatePrimitive: (
		client: GeneratorClient,
		schema: PrimitiveTypeSchema,
		parentPath: string
	) => Promise<P & ExpectedPropertyContext>
	generateEnum?: (
		client: GeneratorClient,
		schema: Schema & Enumable,
		parentPath: string
	) => Promise<E & ExpectedEnumContext>
	generateArray: (
		client: GeneratorClient,
		schema: ArrayTypeSchema,
		items: P & BasePropertyContext,
		parentPath: string
	) => Promise<P & ExpectedPropertyContext>
	generateObject: (
		client: GeneratorClient,
		schema: ObjectTypeSchema,
		properties: (P & BasePropertyContext)[],
		parentPath: string
	) => Promise<{ property: P & ExpectedPropertyContext; object?: O & ExpectedObjectContext }>
	generateUnion: (
		client: GeneratorClient,
		schema: UnionTypeSchema,
		types: (P & BasePropertyContext)[],
		parentPath: string
	) => Promise<P & ExpectedPropertyContext>
	generateRoot: (client: GeneratorClient, context: R & BaseRootContext<T, O, P, E>) => Promise<void>
	formatFile?: (client: GeneratorClient, file: File) => File
} & (
	| {
			generatePropertiesObject: true
			generateTrackCall: (
				client: GeneratorClient,
				schema: Schema,
				propertiesObject: P & BasePropertyContext
			) => Promise<T & ExpectedTrackCallContext>
	  }
	| {
			generatePropertiesObject: false
			generateTrackCall: (
				client: GeneratorClient,
				schema: Schema,
				properties: (P & BasePropertyContext)[]
			) => Promise<T & ExpectedTrackCallContext>
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
		url: trackingPlan.url,
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

async function runGenerator<
	R extends object,
	T extends object,
	O extends object,
	P extends object,
	E extends object
>(
	generator: Generator<R, T, O, P, E>,
	trackingPlan: TrackingPlan,
	options: GenOptions
): Promise<File[]> {
	// One-time setup.
	registerStandardHelpers()
	const rootContext = await generator.setup(options)
	const context: R & BaseRootContext<T, O, P, E> = {
		...rootContext,
		isDevelopment: options.isDevelopment,
		language: options.client.language,
		typewriterVersion: options.typewriterVersion,
		trackingPlanURL: trackingPlan.url,
		tracks: [],
		objects: [],
		enums: [],
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
			contents: await generateFromTemplate<C & BaseRootContext<T, O, P, E>>(templatePath, {
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

	// We "cache" generated enums, so that if we see the same enum in multiple
	// locations, we'll just re-use that enum. This prevents generating multiple
	// copies of the same enum (FooBar, FooBar1, FooBar2, ...).
	const enumCache: Record<string, E & ExpectedEnumContext> = {}

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

		let p: P & ExpectedPropertyContext
		if (isPrimitiveType(schema)) {
			// Primitives are any type that doesn't require generating a "subtype".
			p = await generator.generatePrimitive(client, schema, parentPath)

			// If this property is limited to a set of enum values, then generate an enum
			// to represent that and override the primitives type.
			// Note: some generators may not support enums, and if so, we skip this.
			if (schema.enum && generator.generateEnum) {
				const id = hash(schema.enum, {
					// Two enums with a different ordering of enum values should
					// still map to the same generated enum:
					unorderedArrays: true,
				})
				let e = enumCache[id]
				if (!e) {
					e = await generator.generateEnum(client, schema, parentPath)
					enumCache[id] = e
					context.enums.push(e)
				}

				p.type = e.name
			}
		} else if (isObjectTypeSchema(schema)) {
			// For objects, we need to recursively generate each property first.
			const properties: (P & BasePropertyContext)[] = []
			for (const property of schema.properties) {
				properties.push(await traverseSchema(property, path))
			}

			const { property, object } = await generator.generateObject(
				client,
				schema,
				properties,
				parentPath
			)
			if (object) {
				context.objects.push({
					properties,
					...object,
				})
			}
			p = property
		} else if (isArrayTypeSchema(schema)) {
			// Arrays are another special case, because we need to generate a type to represent
			// the items allowed in this array.
			const itemsSchema: Schema = {
				name: schema.name + ' Item',
				description: schema.description,
				...schema.items,
			}
			const items = await traverseSchema(itemsSchema, path)
			p = await generator.generateArray(client, schema, items, parentPath)
		} else if (isUnionTypeSchema(schema)) {
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
			throw new Error(`Invalid Schema Type: ${schema}`)
		}

		return {
			...base,
			...p,
		}
	}

	// Generate Track Calls.
	for (const { raw, schema } of trackingPlan.trackCalls) {
		let t: T & ExpectedTrackCallContext
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
