import { File, DefaultOptions, Language, GenerationConfig } from '../gen'
import { Schema, Type, getPropertiesSchema } from '../ast'
import { camelCase, upperFirst } from 'lodash'
import namer from './namer'
import * as prettier from 'prettier'
import { generateFromTemplate } from '../../templates'
import { transpileModule, ModuleKind, ScriptTarget } from 'typescript'

// The context that will be passed to Handlebars to perform rendering.
// Everything in this context should be properly sanitized.
interface TemplateContext {
	isDevelopment: boolean
	isBrowser: boolean

	tracks: TrackCall[]
	interfaces: TSInterface[]
}

// Represents a single exposed track() call.
interface TrackCall {
	// The formatted function name.
	functionName: string
	// The raw name of the event being tracked.
	eventName: string
	// The optional function description.
	description?: string
	// The type of the analytics properties object.
	type: string
	// The raw JSON Schema for the event.
	rawJSONSchema: string
}

// Represents a generated interface.
interface TSInterface {
	// The name of the interface itself.
	name: string
	// The optional interface description.
	description?: string
	// The properties expected within this interface.
	properties: TSInterfaceProperty[]
}

// Represents a single property within a generated Interface.
interface TSInterfaceProperty {
	name: string
	description?: string
	isRequired: boolean
	type: string
}

// Which JavaScript environment to generate for.
// The browser environments will use analytics-js, window.analytics, and
// generate analytics calls as functions.
// The Node environment will use analytics-node, and generate class which
// accepts an analytics object. Analytics calls will be class methods.
export enum Environment {
	BROWSER = 'browser',
	NODE = 'node',
}

export interface JavaScriptOptions {
	name: Language.JAVASCRIPT
	env: Environment
	// JavaScript transpilation settings:
	scriptTarget?: ScriptTarget
	moduleTarget?: ModuleKind
}

export interface TypeScriptOptions {
	name: Language.TYPESCRIPT
	env: Environment
}

export type Options = DefaultOptions & (JavaScriptOptions | TypeScriptOptions)

export default async function(config: GenerationConfig): Promise<File[]> {
	const ctx = getContext(config)
	const files = [
		{
			path: config.options.name === Language.TYPESCRIPT ? 'index.ts' : 'index.js',
			contents: await generateFromTemplate<TemplateContext>(
				`generators/javascript/${config.options.env}.hbs`,
				ctx
			),
		},
	]

	// semgent.hbs contains the TypeScript definitions for the Segment API.
	// It becomes an empty file for JavaScript after being transpiled.
	if (config.options.name === Language.TYPESCRIPT) {
		files.push({
			path: 'segment.ts',
			contents: await generateFromTemplate<TemplateContext>(
				'generators/javascript/segment.hbs',
				ctx
			),
		})
	}

	return files.map(f => formatFile(f, config.options))
}

function formatFile(f: File, opts: Options): File {
	let contents = f.contents

	// If we are generating a JavaScript client, transpile the client
	// from TypeScript into JavaScript.
	if (opts.name === Language.JAVASCRIPT) {
		// If we're generating a JavaScript client, compile
		// from TypeScript to JavaScript.
		const { outputText } = transpileModule(f.contents, {
			compilerOptions: {
				target: opts.scriptTarget || ScriptTarget.ESNext,
				module: opts.moduleTarget || ModuleKind.ESNext,
			},
		})

		contents = outputText
	}

	// Apply stylistic formatting, via Prettier.
	const formattedContents = prettier.format(contents, {
		parser: opts.name === Language.TYPESCRIPT ? 'typescript' : 'babel',
		// Overwrite a few of the standard prettier settings to match with our Typewriter configuration:
		useTabs: true,
		singleQuote: true,
		semi: false,
		trailingComma:
			opts.name === Language.JAVASCRIPT && opts.scriptTarget === ScriptTarget.ES3 ? 'none' : 'es5',
	})

	return {
		...f,
		contents: formattedContents,
	}
}

function getContext(config: GenerationConfig): TemplateContext {
	// Render a TemplateContext based on the set of event schemas.
	const context: TemplateContext = {
		isDevelopment: config.options.isDevelopment,
		isBrowser: config.options.env === Environment.BROWSER,

		tracks: [],
		interfaces: [],
	}

	for (var track of config.tracks) {
		const { schema } = track
		// Recursively generate all types, into the context, for the schema.
		const rootType = getTypeForSchema(getPropertiesSchema(schema), context)

		context.tracks.push({
			functionName: namer.escapeIdentifier(camelCase(schema.name)),
			eventName: namer.escapeString(schema.name),
			description: schema.description,
			type: rootType,
			rawJSONSchema: JSON.stringify(track.raw, undefined, '\t'),
		})
	}

	return context
}

function getTypeForSchema(schema: Schema, context: TemplateContext): string {
	let type: string
	if (schema.type === Type.ANY) {
		type = 'any'
	} else if (schema.type === Type.STRING) {
		type = 'string'
	} else if (schema.type === Type.BOOLEAN) {
		type = 'boolean'
	} else if (schema.type === Type.INTEGER || schema.type === Type.NUMBER) {
		type = 'number'
	} else if (schema.type === Type.OBJECT) {
		// If no properties are set, allow this track call to take any properties.
		if (schema.properties.length === 0) {
			type = 'Record<string, any>'
		} else {
			// Otherwise generate an interface to represent the object.
			const properties: TSInterfaceProperty[] = []
			for (var property of schema.properties) {
				properties.push({
					// We want property names to be grep-able, so we use JS's ability to escape
					// identifiers using quotes.
					name: namer.escapeString(property.name),
					description: property.description,
					isRequired: !!property.isRequired,
					type: getTypeForSchema(property, context),
				})
			}

			type = namer.escapeIdentifier(upperFirst(camelCase(schema.name)))
			context.interfaces.push({
				name: type,
				description: schema.description,
				properties,
			})
		}
	} else if (schema.type === Type.ARRAY) {
		const itemsSchema = {
			name: schema.name,
			description: schema.description,
			...schema.items,
		}

		type = `${getTypeForSchema(itemsSchema, context)}[]`
	} else if (schema.type === Type.UNION) {
		const types = schema.types.map(t => {
			const subSchema = {
				name: schema.name,
				description: schema.description,
				...t,
			}

			return getTypeForSchema(subSchema, context)
		})

		type = types.join(' | ')
	} else {
		throw new Error(`Invalid Schema Type: ${schema.type}`)
	}

	return schema.isNullable && schema.type !== Type.ANY ? `${type} | null` : type
}
