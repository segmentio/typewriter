import { File, TrackingPlan, GenOptions, TemplateBaseContext, baseContext } from '../gen'
import { Schema, Type, getPropertiesSchema } from '../ast'
import { camelCase, upperFirst } from 'lodash'
import * as prettier from 'prettier'
import { generateFromTemplate, registerStandardHelpers } from '../../templates'
import { transpileModule, ModuleKind, ScriptTarget } from 'typescript'
import Namer from '../namer'
import { Language, SDK } from '../options'

// See: https://mathiasbynens.be/notes/reserved-keywords#ecmascript-6
// prettier-ignore
const reservedWords = [
	'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'enum', 'eval', 'null', 'this',
	'true', 'void', 'with', 'await', 'break', 'catch', 'class', 'const', 'false', 'super', 'throw',
	'while', 'yield', 'delete', 'export', 'import', 'public', 'return', 'static', 'switch', 'typeof',
	'default', 'extends', 'finally', 'package', 'private', 'continue', 'debugger', 'function', 'arguments',
	'interface', 'protected', 'implements', 'instanceof',
]

// The context that will be passed to Handlebars to perform rendering.
// Everything in this context should be properly sanitized.
interface TemplateContext extends TemplateBaseContext {
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
	// The interface representing the properties parameter. Used only for JSDoc generation
	// and therefore only set in JavaScript environments.
	interface?: TSInterface
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

export default async function(trackingPlan: TrackingPlan, options: GenOptions): Promise<File[]> {
	registerStandardHelpers()

	const ctx = getContext(trackingPlan, options)
	const files = [
		{
			path: options.client.language === Language.TYPESCRIPT ? 'index.ts' : 'index.js',
			contents: await generateFromTemplate<TemplateContext>('generators/javascript/index.hbs', ctx),
		},
	]

	// semgent.hbs contains the TypeScript definitions for the Segment API.
	// It becomes an empty file for JavaScript after being transpiled.
	if (options.client.language === Language.TYPESCRIPT) {
		files.push({
			path: 'segment.ts',
			contents: await generateFromTemplate<TemplateContext>(
				'generators/javascript/segment.hbs',
				ctx
			),
		})
	}

	return files.map(f => formatFile(f, options))
}

function formatFile(f: File, options: GenOptions): File {
	let contents = f.contents

	// If we are generating a JavaScript client, transpile the client
	// from TypeScript into JavaScript.
	if (options.client.language === Language.JAVASCRIPT) {
		// If we're generating a JavaScript client, compile from TypeScript to JavaScript.
		// But first, map the module/script targets to TypeScript's compiler enums.
		let target = ScriptTarget.ESNext
		let moduleTarget = ModuleKind.ESNext
		if (options.client.scriptTarget) {
			switch (options.client.scriptTarget) {
				case 'ES3':
					target = ScriptTarget.ES3
					break
				case 'ES5':
					target = ScriptTarget.ES5
					break
				case 'ES2015':
					target = ScriptTarget.ES2015
					break
				case 'ES2016':
					target = ScriptTarget.ES2016
					break
				case 'ES2017':
					target = ScriptTarget.ES2017
					break
				case 'ES2018':
					target = ScriptTarget.ES2018
					break
				case 'ES2019':
					target = ScriptTarget.ES2019
					break
				case 'ESNext':
					target = ScriptTarget.ESNext
					break
				case 'Latest':
					target = ScriptTarget.Latest
					break
				default:
					throw new Error(`Invalid scriptTarget: '${options.client.scriptTarget}'`)
			}
		}
		if (options.client.moduleTarget) {
			switch (options.client.moduleTarget) {
				case 'CommonJS':
					moduleTarget = ModuleKind.CommonJS
					break
				case 'AMD':
					moduleTarget = ModuleKind.AMD
					break
				case 'UMD':
					moduleTarget = ModuleKind.UMD
					break
				case 'System':
					moduleTarget = ModuleKind.System
					break
				case 'ES2015':
					moduleTarget = ModuleKind.ES2015
					break
				case 'ESNext':
					moduleTarget = ModuleKind.ESNext
					break
				default:
					throw new Error(`Invalid moduleTarget: '${options.client.moduleTarget}'`)
			}
		}

		const { outputText } = transpileModule(f.contents, {
			compilerOptions: {
				target,
				module: moduleTarget,
				esModuleInterop: true,
			},
		})

		contents = outputText
	}

	// Apply stylistic formatting, via Prettier.
	const formattedContents = prettier.format(contents, {
		parser: options.client.language === Language.TYPESCRIPT ? 'typescript' : 'babel',
		// Overwrite a few of the standard prettier settings to match with our Typewriter configuration:
		useTabs: true,
		singleQuote: true,
		semi: false,
		trailingComma:
			options.client.language === Language.JAVASCRIPT && options.client.scriptTarget === 'ES3'
				? 'none'
				: 'es5',
	})

	return {
		...f,
		contents: formattedContents,
	}
}

function getContext(trackingPlan: TrackingPlan, options: GenOptions): TemplateContext {
	// Render a TemplateContext based on the set of event schemas.
	const context: TemplateContext = {
		...baseContext(options),
		isBrowser: options.client.sdk === SDK.WEB,

		tracks: [],
		interfaces: [],
	}

	const namer = new Namer({
		reservedWords,
		quoteChar: "'",
		// Note: we don't support the full range of allowed JS chars, instead focusing on a subset.
		// The full regex 11k+ chars: https://mathiasbynens.be/demo/javascript-identifier-regex
		// See: https://mathiasbynens.be/notes/javascript-identifiers-es6
		allowedIdentifierStartingChars: 'A-Za-z_$',
		allowedIdentifierChars: 'A-Za-z0-9_$',
	})

	for (var { raw, schema } of trackingPlan.trackCalls) {
		// Recursively generate all types, into the context, for the schema.
		const rootType = getTypeForSchema(getPropertiesSchema(schema), context, namer)

		context.tracks.push({
			functionName: namer.register(schema.name, 'function', { transform: camelCase }),
			eventName: namer.escapeString(schema.name),
			description: schema.description,
			type: rootType.type,
			rawJSONSchema: JSON.stringify(raw, undefined, '\t'),
			interface:
				rootType.interface && options.client.language === Language.JAVASCRIPT
					? {
							...rootType.interface,
							properties: rootType.interface.properties.map(p => ({
								...p,
								// TODO: move this into Handlebars with a helper.
								type: `{${p.type}}`,
							})),
					  }
					: undefined,
		})
	}

	return context
}

interface GetTypeForSchemaReturn {
	type: string
	// Only set if the type is an object type.
	interface?: TSInterface
}

function getTypeForSchema(
	schema: Schema,
	context: TemplateContext,
	namer: Namer
): GetTypeForSchemaReturn {
	let type: string
	let tsInterface: TSInterface | undefined = undefined
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
					type: getTypeForSchema(property, context, namer).type,
				})
			}

			const interfaceNamer = (name: string) => upperFirst(camelCase(name))
			type = namer.register(schema.name, 'interface', { transform: interfaceNamer })
			tsInterface = {
				name: type,
				description: schema.description,
				properties,
			}
			context.interfaces.push(tsInterface)
		}
	} else if (schema.type === Type.ARRAY) {
		const itemsSchema = {
			name: schema.name,
			description: schema.description,
			...schema.items,
		}

		type = `${getTypeForSchema(itemsSchema, context, namer).type}[]`
	} else if (schema.type === Type.UNION) {
		const types = schema.types.map(t => {
			const subSchema = {
				name: schema.name,
				description: schema.description,
				...t,
			}

			return getTypeForSchema(subSchema, context, namer).type
		})

		type = types.join(' | ')
	} else {
		throw new Error(`Invalid Schema Type: ${schema.type}`)
	}

	return {
		type: schema.isNullable && schema.type !== Type.ANY ? `${type} | null` : type,
		interface: tsInterface,
	}
}
