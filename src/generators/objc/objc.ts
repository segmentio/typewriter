import { camelCase, upperFirst } from 'lodash'
import { Type, Schema } from '../ast'
import * as Handlebars from 'handlebars'
import { Generator, BasePropertyContext, GeneratorClient } from '../gen'

// These contexts are what will be passed to Handlebars to perform rendering.
// Everything in these contexts should be properly sanitized.

type ObjCObjectContext = {
	// The formatted name for this object, ex: "numAvocados".
	name: string
	// Set of files that need to be imported in this file.
	imports: string[]
}

type ObjCPropertyContext = {
	// The formatted name for this property, ex: "numAvocados".
	name: string
	// The type of this property. ex: "NSNumber".
	type: string
	// Stringified property modifiers. ex: "nonatomic, copy".
	modifiers: string
	// Whether the property is nullable (nonnull vs nullable modifier).
	isVariableNullable: boolean
	// Whether null is a valid value for this property when sent to Segment.
	isPayloadFieldNullable: boolean
	// Whether the Objective-C type is a pointer (id, SERIALIZABLE_DICT, NSNumber *, ...).
	isPointerType: boolean
	// Note: only set if this is a class.
	// The header file containing the interface for this class.
	importName?: string
}

type ObjCTrackCallContext = {
	// The formatted function name, ex: "orderCompleted".
	functionName: string
}

export const objc: Generator<
	Record<string, unknown>,
	ObjCTrackCallContext,
	ObjCObjectContext,
	ObjCPropertyContext
> = {
	generatePropertiesObject: false,
	namer: {
		// See: https://github.com/AnanthaRajuCprojects/Reserved-Key-Words-list-of-various-programming-languages/blob/master/Objective-C%20Reserved%20Words.md
		// prettier-ignore
		reservedWords: [
			'asm', 'atomic', 'auto', 'bool', 'break', 'bycopy', 'byref', 'case', 'catch', 'char',
			'class', 'const', 'continue', 'copy', 'debugDescription', 'default', 'description',
			'do', 'double', 'dynamic', 'else', 'end', 'enum', 'extern', 'false', 'finally', 'float',
			'for', 'goto', 'hash', 'id', 'if', 'imp', 'implementation', 'in', 'init', 'inline',
			'inout', 'int', 'interface', 'long', 'mutableCopy', 'new', 'nil', 'no', 'nonatomic',
			'null', 'nullable', 'nonnull', 'oneway', 'options', 'out', 'private', 'property', 'protected',
			'protocol', 'public', 'register', 'restrict', 'retain', 'return', 'sel', 'selector', 'self',
			'short', 'signed', 'sizeof', 'static', 'struct', 'super', 'superclass', 'switch', 'synthesize',
			'throw', 'true', 'try', 'typedef', 'typeof', 'union', 'unsigned', 'void', 'volatile', 'while',
			'yes'
		],
		quoteChar: '"',
		allowedIdentifierStartingChars: 'A-Za-z_$',
		allowedIdentifierChars: 'A-Za-z0-9_$',
	},
	setup: async () => {
		Handlebars.registerHelper('propertiesDictionary', generatePropertiesDictionary)
		Handlebars.registerHelper('functionCall', generateFunctionCall)
		Handlebars.registerHelper('functionSignature', generateFunctionSignature)
		Handlebars.registerHelper('variableSeparator', variableSeparator)
		return {}
	},
	generatePrimitive: async (client, schema, parentPath) => {
		let type = 'id'
		let isPointerType = !schema.isRequired || !!schema.isNullable

		if (schema.type === Type.STRING) {
			type = 'NSString *'
			isPointerType = true
		} else if (schema.type === Type.BOOLEAN) {
			// BOOLs cannot nullable in Objective-C. Instead, use an NSNumber which can be
			// initialized like a boolean like so: [NSNumber numberWithBool:YES]
			// This is what is done behind the scenes by typewriter if this boolean is nonnull.
			type = isPointerType ? 'NSNumber *' : 'BOOL'
		} else if (schema.type === Type.INTEGER) {
			type = isPointerType ? 'NSNumber *' : 'NSInteger'
		} else if (schema.type === Type.NUMBER) {
			type = 'NSNumber *'
			isPointerType = true
		}

		return defaultPropertyContext(client, schema, type, parentPath, isPointerType)
	},
	generateArray: async (client, schema, items, parentPath) => {
		// Objective-C doesn't support NSArray's of primitives. Therefore, we
		// map booleans and integers to NSNumbers.
		const itemsType = [Type.BOOLEAN, Type.INTEGER].includes(items.schemaType)
			? 'NSNumber *'
			: items.type

		return {
			...defaultPropertyContext(client, schema, `NSArray<${itemsType}> *`, parentPath, true),
			importName: items.importName,
		}
	},
	generateObject: async (client, schema, properties, parentPath) => {
		const property = defaultPropertyContext(client, schema, 'SERIALIZABLE_DICT', parentPath, true)
		let object: ObjCObjectContext | undefined = undefined

		if (properties.length > 0) {
			// If at least one property is set, generate a class that only allows the explicitly
			// allowed properties.
			const className = client.namer.register(schema.name, 'class', {
				transform: (name: string) => {
					return `SEG${upperFirst(camelCase(name))}`
				},
			})
			property.type = `${className} *`
			property.importName = `"${className}.h"`
			object = {
				name: className,
				imports: properties.filter(p => !!p.importName).map(p => p.importName!),
			}
		}

		return { property, object }
	},
	generateUnion: async (client, schema, _, parentPath) => {
		// TODO: support unions in iOS
		return defaultPropertyContext(client, schema, 'id', parentPath, true)
	},
	generateTrackCall: async (client, schema) => ({
		functionName: client.namer.register(schema.name, 'function->track', {
			transform: camelCase,
		}),
	}),
	generateRoot: async (client, context) => {
		await Promise.all([
			client.generateFile(
				'SEGTypewriterAnalytics.h',
				'generators/objc/templates/analytics.h.hbs',
				context
			),
			client.generateFile(
				'SEGTypewriterAnalytics.m',
				'generators/objc/templates/analytics.m.hbs',
				context
			),
			client.generateFile(
				'SEGTypewriterUtils.h',
				'generators/objc/templates/SEGTypewriterUtils.h.hbs',
				context
			),
			client.generateFile(
				'SEGTypewriterUtils.m',
				'generators/objc/templates/SEGTypewriterUtils.m.hbs',
				context
			),
			client.generateFile(
				'SEGTypewriterSerializable.h',
				'generators/objc/templates/SEGTypewriterSerializable.h.hbs',
				context
			),
			...context.objects.map(o =>
				client.generateFile(`${o.name}.h`, 'generators/objc/templates/class.h.hbs', o)
			),
			...context.objects.map(o =>
				client.generateFile(`${o.name}.m`, 'generators/objc/templates/class.m.hbs', o)
			),
		])
	},
}

function defaultPropertyContext(
	client: GeneratorClient,
	schema: Schema,
	type: string,
	namespace: string,
	isPointerType: boolean
): ObjCPropertyContext {
	return {
		name: client.namer.register(schema.name, namespace, {
			transform: camelCase,
		}),
		type,
		modifiers: isPointerType
			? schema.isRequired
				? 'strong, nonatomic, nonnull'
				: 'strong, nonatomic, nullable'
			: 'nonatomic',
		isVariableNullable: !schema.isRequired || !!schema.isNullable,
		isPayloadFieldNullable: !!schema.isNullable && !!schema.isRequired,
		isPointerType,
	}
}

// Handlebars partials

function generateFunctionSignature(
	functionName: string,
	properties: (BasePropertyContext & ObjCPropertyContext)[],
	withOptions: boolean
): string {
	let signature = functionName
	const parameters: {
		type: string
		name: string
		isPointerType: boolean
		isVariableNullable: boolean
	}[] = [...properties]
	if (withOptions) {
		parameters.push({
			name: 'options',
			type: 'SERIALIZABLE_DICT',
			isPointerType: true,
			isVariableNullable: true,
		})
	}

	const withNullability = (property: {
		type: string
		isPointerType: boolean
		isVariableNullable: boolean
	}) => {
		const { isPointerType, type, isVariableNullable } = property
		return isPointerType ? `${isVariableNullable ? 'nullable' : 'nonnull'} ${type}` : type
	}

	// Mutate the function name to match standard Objective-C naming standards (FooBar vs. FooBarWithSparkles:sparkles).
	if (parameters.length > 0) {
		const first = parameters[0]
		signature += `With${upperFirst(first.name)}:(${withNullability(first)})${first.name}\n`
	}
	for (const parameter of parameters.slice(1)) {
		signature += `${parameter.name}:(${withNullability(parameter)})${parameter.name}\n`
	}

	return signature.trim()
}

function generateFunctionCall(
	caller: string,
	functionName: string,
	properties: (BasePropertyContext & ObjCPropertyContext)[],
	extraParameterName?: string,
	extraParameterValue?: string
): string {
	let functionCall = functionName
	const parameters: { name: string; value: string }[] = properties.map(p => ({
		name: p.name,
		value: p.name,
	}))
	if (extraParameterName && extraParameterValue) {
		parameters.push({
			name: extraParameterName,
			value: extraParameterValue,
		})
	}

	if (parameters.length > 0) {
		const { name, value } = parameters[0]
		functionCall += `With${upperFirst(name)}:${value}`
	}
	for (const { name, value } of parameters.slice(1)) {
		functionCall += ` ${name}:${value}`
	}

	return `[${caller} ${functionCall.trim()}];`
}

function generatePropertiesDictionary(
	properties: (BasePropertyContext & ObjCPropertyContext)[],
	prefix?: string
): string {
	let out = 'NSMutableDictionary *properties = [[NSMutableDictionary alloc] init];\n'
	for (const property of properties) {
		const name = prefix && prefix.length > 0 ? `${prefix}${property.name}` : property.name
		const serializableName =
			property.schemaType === Type.BOOLEAN
				? property.isPointerType
					? name
					: `[NSNumber numberWithBool:${name}]`
				: property.schemaType === Type.INTEGER
				? property.isPointerType
					? name
					: `[NSNumber numberWithInteger:${name}]`
				: property.schemaType === Type.OBJECT && !property.type.includes('SERIALIZABLE_DICT')
				? `[${name} toDictionary]`
				: property.schemaType === Type.ARRAY
				? `[SEGTypewriterUtils toSerializableArray:${name}]`
				: name

		let setter: string
		if (property.isPointerType) {
			if (property.isPayloadFieldNullable) {
				// If the value is nil, we need to convert it from a primitive nil to NSNull (an object).
				setter = `properties[@"${
					property.rawName
				}"] = ${name} == nil ? [NSNull null] : ${serializableName};\n`
			} else {
				// If the property is not nullable, but is a pointer, then we need to guard on nil
				// values. In that case, we don't set any value to the field.
				// TODO: do we need these guards if we've already set a field as nonnull? TBD
				setter = `if (${name} != nil) {\n  properties[@"${
					property.rawName
				}"] = ${serializableName};\n}\n`
			}
		} else {
			setter = `properties[@"${property.rawName}"] = ${serializableName};\n`
		}

		out += setter
	}

	return out
}

// Render `NSString *foo` not `NSString * foo` and `BOOL foo` not `BOOLfoo` or `BOOL  foo` by doing:
// `{{type}}{{variableSeparator type}}{{name}}`
function variableSeparator(type: string): string {
	return type.endsWith('*') ? '' : ' '
}
