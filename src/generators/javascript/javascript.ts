import { Type, Schema } from '../ast'
import { camelCase, upperFirst } from 'lodash'
import * as prettier from 'prettier'
import { transpileModule } from 'typescript'
import { Language, SDK } from '../options'
import { Generator } from '../gen'
import { toTarget, toModule } from './targets'
import { registerPartial } from '../../templates'

// These contexts are what will be passed to Handlebars to perform rendering.
// Everything in these contexts should be properly sanitized.

type JavaScriptRootContext = {
	isBrowser: boolean
	useProxy: boolean
}

// Represents a single exposed track() call.
type JavaScriptTrackCallContext = {
	// The formatted function name, ex: "orderCompleted".
	functionName: string
	// The type of the analytics properties object.
	propertiesType: string
	// The properties field is only optional in analytics.js environments where
	// no properties are required.
	isPropertiesOptional: boolean
}

type JavaScriptObjectContext = {
	// The formatted name for this object, ex: "Planet"
	name: string
}

type JavaScriptPropertyContext = {
	// The formatted name for this property, ex: "numAvocados".
	name: string
	// The type of this property. ex: "number".
	type: string
}

export const javascript: Generator<
	JavaScriptRootContext,
	JavaScriptTrackCallContext,
	JavaScriptObjectContext,
	JavaScriptPropertyContext
> = {
	generatePropertiesObject: true,
	namer: {
		// See: https://mathiasbynens.be/notes/reserved-keywords#ecmascript-6
		// prettier-ignore
		reservedWords: [
			'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'enum', 'eval', 'null', 'this',
			'true', 'void', 'with', 'await', 'break', 'catch', 'class', 'const', 'false', 'super', 'throw',
			'while', 'yield', 'delete', 'export', 'import', 'public', 'return', 'static', 'switch', 'typeof',
			'default', 'extends', 'finally', 'package', 'private', 'continue', 'debugger', 'function', 'arguments',
			'interface', 'protected', 'implements', 'instanceof',
		],
		quoteChar: "'",
		// Note: we don't support the full range of allowed JS chars, instead focusing on a subset.
		// The full regex 11k+ chars: https://mathiasbynens.be/demo/javascript-identifier-regex
		// See: https://mathiasbynens.be/notes/javascript-identifiers-es6
		allowedIdentifierStartingChars: 'A-Za-z_$',
		allowedIdentifierChars: 'A-Za-z0-9_$',
	},
	setup: async options => {
		await registerPartial(
			'generators/javascript/templates/setTypewriterOptionsDocumentation.hbs',
			'setTypewriterOptionsDocumentation'
		)
		await registerPartial(
			'generators/javascript/templates/functionDocumentation.hbs',
			'functionDocumentation'
		)

		return {
			isBrowser: options.client.sdk === SDK.WEB,
			useProxy: true,
		}
	},
	generatePrimitive: async (client, schema) => {
		let type = 'any'
		if (schema.type === Type.STRING) {
			type = 'string'
		} else if (schema.type === Type.BOOLEAN) {
			type = 'boolean'
		} else if (schema.type === Type.INTEGER || schema.type === Type.NUMBER) {
			type = 'number'
		}

		return conditionallyNullable(schema, {
			name: client.namer.escapeString(schema.name),
			type,
		})
	},
	generateArray: async (client, schema, items) =>
		conditionallyNullable(schema, {
			name: client.namer.escapeString(schema.name),
			type: `${items.type}[]`,
		}),
	generateObject: async (client, schema, properties) => {
		if (properties.length === 0) {
			// If no properties are set, replace this object with a untyped map to allow any properties.
			return {
				property: conditionallyNullable(schema, {
					name: client.namer.escapeString(schema.name),
					type: 'Record<string, any>',
				}),
			}
		} else {
			// Otherwise generate an interface to represent this object.
			const interfaceName = client.namer.register(schema.name, 'interface', {
				transform: (name: string) => upperFirst(camelCase(name)),
			})
			return {
				property: conditionallyNullable(schema, {
					name: client.namer.escapeString(schema.name),
					type: interfaceName,
				}),
				object: {
					name: interfaceName,
				},
			}
		}
	},
	generateUnion: async (client, schema, types) =>
		conditionallyNullable(schema, {
			name: client.namer.escapeString(schema.name),
			type: types.map(t => t.type).join(' | '),
		}),
	generateTrackCall: async (client, schema, propertiesObject) => ({
		functionName: client.namer.register(schema.name, 'function->track', { transform: camelCase }),
		propertiesType: propertiesObject.type,
		// The properties object in a.js can be omitted if no properties are required.
		isPropertiesOptional: client.options.client.sdk === SDK.WEB && !propertiesObject.isRequired,
	}),
	generateRoot: async (client, context) => {
		// index.hbs contains all JavaScript client logic.
		await client.generateFile<JavaScriptRootContext>(
			client.options.client.language === Language.TYPESCRIPT ? 'index.ts' : 'index.js',
			'generators/javascript/templates/index.hbs',
			context
		)

		// segment.hbs contains the TypeScript definitions for the Segment API.
		// It becomes an empty file for JavaScript after being transpiled.
		if (client.options.client.language === Language.TYPESCRIPT) {
			await client.generateFile<JavaScriptRootContext>(
				'segment.ts',
				'generators/javascript/templates/segment.hbs',
				context
			)
		}
	},
	formatFile: (client, file) => {
		let { contents } = file
		// If we are generating a JavaScript client, transpile the client
		// from TypeScript into JavaScript.
		if (client.options.client.language === Language.JAVASCRIPT) {
			// If we're generating a JavaScript client, compile from TypeScript to JavaScript.
			const { outputText } = transpileModule(contents, {
				compilerOptions: {
					target: toTarget(client.options.client.scriptTarget),
					module: toModule(client.options.client.moduleTarget),
					esModuleInterop: true,
				},
			})

			contents = outputText
		}

		// Apply stylistic formatting, via Prettier.
		const formattedContents = prettier.format(contents, {
			parser: client.options.client.language === Language.TYPESCRIPT ? 'typescript' : 'babel',
			// Overwrite a few of the standard prettier settings to match with our Typewriter configuration:
			useTabs: true,
			singleQuote: true,
			semi: false,
			trailingComma:
				client.options.client.language === Language.JAVASCRIPT &&
				client.options.client.scriptTarget === 'ES3'
					? 'none'
					: 'es5',
		})

		return {
			...file,
			contents: formattedContents,
		}
	},
}

function conditionallyNullable(
	schema: Schema,
	property: JavaScriptPropertyContext
): JavaScriptPropertyContext {
	return {
		...property,
		type: !!schema.isNullable ? `${property.type} | null` : property.type,
	}
}
