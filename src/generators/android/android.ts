import { camelCase, upperFirst } from 'lodash'
import { Type, Schema } from '../ast'
import * as Handlebars from 'handlebars'
import { Generator, BasePropertyContext, GeneratorClient } from '../gen'

// These contexts are what will be passed to Handlebars to perform rendering.
// Everything in these contexts should be properly sanitized.

interface AndroidObjectContext {
	// The formatted name for this object, ex: "numAvocados
	name: string
	// Set of files that need to be imported in this file.
}

interface AndroidPropertyContext {
	// The formatted name for this property, ex: "numAvocados".
	name: string
	// The type of this property. ex: "String".
	type: string
	// Stringified property modifiers. ex: "final, @Nonnull".
	modifiers: string
	// Whether the property is nullable (@Nonnull vs @Nullable modifier).
	isVariableNullable: boolean
	// Whether null is a valid value for this property when sent to Segment.
	isPayloadFieldNullable: boolean
	// Note: only set if this is a class.
	// The header file containing the interface for this class.
	importName?: string
}

interface AndroidTrackCallContext {
	// The formatted function name, ex: "orderCompleted".
	functionName: string
}

export const android: Generator<
	{},
	AndroidTrackCallContext,
	AndroidObjectContext,
	AndroidPropertyContext
> = {
	generatePropertiesObject: false,
	namer: {
		// See: https://github.com/AnanthaRajuCprojects/Reserved-Key-Words-list-of-various-programming-languages/blob/master/Objective-C%20Reserved%20Words.md
		// prettier-ignore
		reservedWords: [],
		quoteChar: '"',
		allowedIdentifierStartingChars: 'A-Za-z_$',
		allowedIdentifierChars: 'A-Za-z0-9_$',
	},
	setup: () => {
		return Promise.resolve({})
	},
	generatePrimitive: async (client, schema, parentPath) => {
		let type = 'id'

		if (schema.type === Type.STRING) {
			type = 'String'
		} else if (schema.type === Type.BOOLEAN) {
			type = 'boolean'
		} else if (schema.type === Type.INTEGER) {
			type = 'int'
		} else if (schema.type === Type.NUMBER) {
			type = 'double'
		}

		return defaultPropertyContext(client, schema, type, parentPath)
	},
	generateArray: async (client, schema, items, parentPath) => {
		return {
			...defaultPropertyContext(client, schema, `List<${items.type}>`, parentPath),
		}
	},
	generateObject: async (client, schema, properties, parentPath) => {
		const property = defaultPropertyContext(client, schema, 'Object', parentPath)
		let object: AndroidObjectContext | undefined = undefined

		if (properties.length > 0) {
			// If at least one property is set, generate a class that only allows the explicitely
			// allowed properties.
			const className = client.namer.register(schema.name, 'class', {
				transform: (name: string) => {
					return `SEG${upperFirst(camelCase(name))}`
				},
			})
			property.type = className
			object = {
				name: className,
			}
		}

		return { property, object }
	},
	generateUnion: async (client, schema, _, parentPath) => {
		// TODO: support unions in iOS
		return defaultPropertyContext(client, schema, 'id', parentPath)
	},
	generateTrackCall: async (client, schema) => ({
		functionName: client.namer.register(schema.name, 'function->track', {
			transform: camelCase,
		}),
	}),
	generateRoot: async (client, context) => {
		await Promise.all([
			...context.objects.map(o =>
				client.generateFile(`${o.name}.java`, 'generators/android/templates/class.java.hbs', o)
			),
		])
	},
}

function defaultPropertyContext(
	client: GeneratorClient,
	schema: Schema,
	type: string,
	namespace: string
): AndroidPropertyContext {
	return {
		name: client.namer.register(schema.name, namespace, {
			transform: camelCase,
		}),
		type,
		modifiers: schema.isRequired ? 'final, @Nonnull' : 'final, @Nullable',
		isVariableNullable: !schema.isRequired || !!schema.isNullable,
		isPayloadFieldNullable: !!schema.isNullable,
	}
}

// Handlebars partials

// 	const withNullability = (property: {
// 		type: string
// 		isPointerType: boolean
// 		isVariableNullable: boolean
// 	}) => {
// 		const { isPointerType, type, isVariableNullable } = property
// 		return isPointerType
// 			? `${isVariableNullable ? 'nullable' : 'nonnull'} ${type}`
// 			: type
// 	}

// 	// Mutate the function name to match standard Objective-C naming standards (FooBar vs. FooBarWithSparkles:sparkles).
// 	if (parameters.length > 0) {
// 		const first = parameters[0]
// 		signature += `With${upperFirst(first.name)}:(${withNullability(first)})${
// 			first.name
// 		}\n`
// 	}
// 	for (var parameter of parameters.slice(1)) {
// 		signature += `${parameter.name}:(${withNullability(parameter)})${
// 			parameter.name
// 		}\n`
// 	}

// 	return signature.trim()
// }

// function generateFunctionCall(
// 	caller: string,
// 	functionName: string,
// 	properties: (BasePropertyContext & IOSPropertyContext)[],
// 	extraParameterName?: string,
// 	extraParameterValue?: string,
// ): string {
// 	let functionCall = functionName
// 	const parameters: { name: string; value: string }[] = properties.map(p => ({
// 		name: p.name,
// 		value: p.name,
// 	}))
// 	if (extraParameterName && extraParameterValue) {
// 		parameters.push({
// 			name: extraParameterName,
// 			value: extraParameterValue,
// 		})
// 	}

// 	if (parameters.length > 0) {
// 		const { name, value } = parameters[0]
// 		functionCall += `With${upperFirst(name)}:${value}`
// 	}
// 	for (var { name, value } of parameters.slice(1)) {
// 		functionCall += ` ${name}:${value}`
// 	}

// 	return `[${caller} ${functionCall.trim()}];`
// }

// // Render `NSString *foo` not `NSString * foo` and `BOOL foo` not `BOOLfoo` or `BOOL  foo` by doing:
// // `{{type}}{{variableSeparator type}}{{name}}`
// function variableSeparator(type: string): string {
// 	return type.endsWith('*') ? '' : ' '
// }
