import { Type, Schema } from '../ast'
import { camelCase, upperFirst } from 'lodash'
import * as prettier from 'prettier'
import { transpileModule } from 'typescript'
import { Language, SDK } from '../options'
import { Generator } from '../gen'
import { toTarget, toModule } from './targets'

// These contexts are what will be passed to Handlebars to perform rendering.
// Everything in these contexts should be properly sanitized.

interface JavaScriptRootContext {
	isBrowser: boolean
}

// Represents a single exposed track() call.
interface JavaScriptTrackCallContext {
	// The type of the analytics properties object.
	propertiesType: string
	// The properties field is only optional in analytics.js environments where
	// no properties are required.
	isPropertiesOptional: boolean
	// Whether or not this track call has either a) a description or b) JSDoc.
	hasDocumentation: boolean
}

interface JavaScriptPropertyContext {
	type: string
}

export const javascript: Generator<
	JavaScriptRootContext,
	JavaScriptTrackCallContext,
	{},
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
	setup: async options => ({
		isBrowser: options.client.sdk === SDK.WEB,
	}),
	generatePrimitive: async (_, schema) => {
		let type = 'any'
		if (schema.type === Type.STRING) {
			type = 'string'
		} else if (schema.type === Type.BOOLEAN) {
			type = 'boolean'
		} else if (schema.type === Type.INTEGER || schema.type === Type.NUMBER) {
			type = 'number'
		}

		return conditionallyNullable(schema, {
			type,
		})
	},
	generateArray: async (_, schema, items) =>
		conditionallyNullable(schema, {
			type: `${items.type}[]`,
		}),
	generateObject: async (client, schema, properties) => {
		if (properties.length === 0) {
			// If no properties are set, replace this object with a untyped map to allow any properties.
			return [
				conditionallyNullable(schema, {
					type: 'Record<string, any>',
				}),
				undefined,
			]
		} else {
			// Otherwise generate an interface to represent this object.
			// TODO: this return is confusing
			return [
				conditionallyNullable(schema, {
					type: client.namer.register(schema.name, 'interface', {
						transform: (name: string) => upperFirst(camelCase(name)),
					}),
				}),
				{},
			]
		}
	},
	generateUnion: async (_, schema, types) =>
		conditionallyNullable(schema, {
			type: types.map(t => t.type).join(' | '),
		}),
	generateTrackCall: async (client, schema, propertiesObject) => ({
		propertiesType: propertiesObject.type,
		// The properties object in a.js can be omitted if no properties are required.
		isPropertiesOptional: client.options.client.sdk === SDK.WEB && !schema.isRequired,
		// We only generate JSDoc for JavaScript clients, however we always include a description if set.
		hasDocumentation:
			!!schema.description || client.options.client.language === Language.JAVASCRIPT,
	}),
	generateRoot: async (client, context) => {
		// index.hbs contains all JavaScript client logic.
		await client.generateFile<JavaScriptRootContext>(
			client.options.client.language === Language.TYPESCRIPT ? 'index.ts' : 'index.js',
			'generators/javascript/index.hbs',
			context
		)

		// segment.hbs contains the TypeScript definitions for the Segment API.
		// It becomes an empty file for JavaScript after being transpiled.
		if (client.options.client.language === Language.TYPESCRIPT) {
			await client.generateFile<JavaScriptRootContext>(
				'segment.ts',
				'generators/javascript/segment.hbs',
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
