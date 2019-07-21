import { File, TrackingPlan, GenOptions, TemplateBaseContext, baseContext } from '../gen'
import { generateFromTemplate, registerStandardHelpers } from '../../templates'
import { Namer } from '../namer'
import { camelCase, upperFirst } from 'lodash'
import { Schema, Type, getPropertiesSchema } from '../ast'
import * as Handlebars from 'handlebars'

// See: https://github.com/AnanthaRajuCprojects/Reserved-Key-Words-list-of-various-programming-languages/blob/master/Objective-C%20Reserved%20Words.md
// prettier-ignore
const reservedWords = [
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
]

interface TemplateAnalyticsContext extends TemplateBaseContext {
	// All track calls available in this client.
	tracks: TemplateTrackCall[]
	// All property groups, each rendered in its own file.
	classes: TemplateClass[]
}

interface TemplateClassContext extends TemplateBaseContext, TemplateClass {}

// Represents a single exposed track() call.
interface TemplateTrackCall {
	// The formatted function name.
	functionName: string
	// The raw name of the event being tracked.
	eventName: string
	// The optional function description.
	description?: string
	// All properties that can be set on this event.
	properties: TemplateProperty[]
}

interface TemplateClass {
	// The formatted name of this class. ex: SEGProduct
	name: string
	// All properties that can be set on this class.
	properties: TemplateProperty[]
	// Set of files that need to be imported in this file.
	imports: string[]
}

interface TemplateProperty {
	// The formatted name of this property. ex: "userID"
	name: string
	// The raw name of this property. ex: "user id"
	raw: string
	// The type of this property. ex: "NSNumber"
	type: string
	// The AST type of this property. ex: Type.INTEGER
	schemaType: Type
	// The optional description of this property.
	description?: string
	// Stringified property modifiers. ex: "nonatomic, copy"
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

export default async function(trackingPlan: TrackingPlan, options: GenOptions): Promise<File[]> {
	registerStandardHelpers()
	Handlebars.registerHelper('propertiesDictionary', generatePropertiesDictionary)
	Handlebars.registerHelper('functionCall', generateFunctionCall)
	Handlebars.registerHelper('functionSignature', generateFunctionSignature)

	const ctx = getAnalyticsContext(trackingPlan, options)
	const files = [
		{
			path: 'SEGTypewriterAnalytics.h',
			contents: await generateFromTemplate<TemplateAnalyticsContext>(
				'generators/ios/templates/analytics.h.hbs',
				ctx
			),
		},
		{
			path: 'SEGTypewriterAnalytics.m',
			contents: await generateFromTemplate<TemplateAnalyticsContext>(
				'generators/ios/templates/analytics.m.hbs',
				ctx
			),
		},
		{
			path: 'SEGTypewriterUtils.h',
			contents: await generateFromTemplate<TemplateBaseContext>(
				'generators/ios/templates/SEGTypewriterUtils.h.hbs',
				ctx
			),
		},
		{
			path: 'SEGTypewriterUtils.m',
			contents: await generateFromTemplate<TemplateBaseContext>(
				'generators/ios/templates/SEGTypewriterUtils.m.hbs',
				ctx
			),
		},
		{
			path: 'SEGTypewriterSerializable.h',
			contents: await generateFromTemplate<TemplateBaseContext>(
				'generators/ios/templates/SEGTypewriterSerializable.h.hbs',
				ctx
			),
		},
	]

	for (var c of ctx.classes) {
		const classContext: TemplateClassContext = {
			...baseContext(options),
			...c,
		}

		files.push(
			{
				path: `${c.name}.h`,
				contents: await generateFromTemplate<TemplateClassContext>(
					'generators/ios/templates/class.h.hbs',
					classContext
				),
			},
			{
				path: `${c.name}.m`,
				contents: await generateFromTemplate<TemplateClassContext>(
					'generators/ios/templates/class.m.hbs',
					classContext
				),
			}
		)
	}

	return files
}

function getAnalyticsContext(
	trackingPlan: TrackingPlan,
	options: GenOptions
): TemplateAnalyticsContext {
	// Render a TemplateAnalyticsContext based on the set of event schemas.
	const context: TemplateAnalyticsContext = {
		...baseContext(options),
		tracks: [],
		classes: [],
	}

	const namer = new Namer({
		reservedWords,
		quoteChar: '"',
		allowedIdentifierStartingChars: 'A-Za-z_$',
		allowedIdentifierChars: 'A-Za-z0-9_$',
	})

	for (var { schema } of trackingPlan.trackCalls) {
		const propertiesSchema = getPropertiesSchema(schema)

		const functionName = namer.register(propertiesSchema.name, 'function', { transform: camelCase })

		const parameters: TemplateProperty[] = []
		const namespace = `function->${functionName}`
		for (var rootProperty of propertiesSchema.properties) {
			const template = getProperty(rootProperty, context, namer, namespace)
			parameters.push(template)
		}

		context.tracks.push({
			functionName,
			eventName: namer.escapeString(schema.name),
			description: schema.description,
			properties: parameters,
		})
	}

	return context
}

function getProperty(
	schema: Schema,
	context: TemplateAnalyticsContext,
	namer: Namer,
	namespace: string
): TemplateProperty {
	const res: TemplateProperty = {
		type: 'id',
		schemaType: schema.type,
		name: namer.register(schema.name, namespace, { transform: camelCase }),
		raw: namer.escapeString(schema.name),
		description: schema.description,
		modifiers: 'strong, nonatomic',
		isVariableNullable: !schema.isRequired || !!schema.isNullable,
		isPayloadFieldNullable: !!schema.isNullable,
		isPointerType: true,
	}

	if (schema.type === Type.ANY) {
		return res
	} else if (schema.type === Type.STRING) {
		return {
			...res,
			type: 'NSString *',
		}
	} else if (schema.type === Type.BOOLEAN) {
		return {
			...res,
			type: res.isVariableNullable ? 'BOOL *' : 'BOOL',
			isPointerType: res.isVariableNullable,
		}
	} else if (schema.type === Type.INTEGER) {
		return {
			...res,
			type: res.isVariableNullable ? 'NSInteger *' : 'NSInteger',
			isPointerType: res.isVariableNullable,
		}
	} else if (schema.type === Type.NUMBER) {
		return {
			...res,
			type: 'NSNumber *',
		}
	} else if (schema.type === Type.OBJECT) {
		// If no properties are set, allow this track call to take any properties.
		if (schema.properties.length === 0) {
			return {
				...res,
				type: 'SERIALIZABLE_DICT',
			}
		}

		const name = namer.register(schema.name, 'interface', {
			transform: (name: string) => {
				return `SEG${upperFirst(camelCase(name))}`
			},
		})
		const properties = schema.properties.map(p =>
			getProperty(p, context, namer, `interface->${name}`)
		)
		const c: TemplateClass = {
			name,
			properties,
			imports: properties.filter(p => !!p.importName).map(p => p.importName!),
		}
		context.classes.push(c)

		return {
			...res,
			type: `${name} *`,
			importName: `"${name}.h"`,
		}
	} else if (schema.type === Type.ARRAY) {
		const itemsSchema: Schema = {
			name: `${res.name} Item`,
			description: res.description,
			...schema.items,
		}
		const item = getProperty(itemsSchema, context, namer, `${namespace}->array`)

		let itemType = item.type
		// Objective-C doesn't support NSArray's of primitives. Therefore, we
		// map booleans and integers to NSNumbers.
		if ([Type.BOOLEAN, Type.INTEGER].includes(item.schemaType)) {
			itemType = 'NSNumber *'
		}

		return {
			...res,
			type: `NSArray<${itemType}> *`,
			importName: item.importName,
		}
	} else if (schema.type === Type.UNION) {
		// TODO: support unions
		return {
			...res,
			type: 'id',
		}
	} else {
		throw new Error(`Invalid Schema Type: ${schema.type}`)
	}
}

// Handlebars partials

function generateFunctionSignature(
	functionName: string,
	properties: TemplateProperty[],
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
	for (var parameter of parameters.slice(1)) {
		signature += `${parameter.name}:(${withNullability(parameter)})${parameter.name}\n`
	}

	return signature.trim()
}

function generateFunctionCall(
	caller: string,
	functionName: string,
	properties: TemplateProperty[],
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
	for (var { name, value } of parameters.slice(1)) {
		functionCall += ` ${name}:${value}`
	}

	return `[${caller} ${functionCall.trim()}];`
}

function generatePropertiesDictionary(properties: TemplateProperty[], prefix?: string): string {
	let out = 'NSMutableDictionary *properties = [[NSMutableDictionary alloc] init];\n'
	for (let property of properties) {
		const name = prefix && prefix.length > 0 ? `${prefix}${property.name}` : property.name
		const serializableName =
			property.schemaType === Type.BOOLEAN
				? property.isPointerType
					? `[NSNumber numberWithBool:*${name}]`
					: `[NSNumber numberWithBool:${name}]`
				: property.schemaType === Type.INTEGER
				? property.isPointerType
					? `[NSNumber numberWithInteger:*${name}]`
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
					property.raw
				}"] = ${name} == nil ? [NSNull null] : ${serializableName};\n`
			} else {
				// If the property is not nullable, but is a pointer, then we need to guard on nil
				// values. In that case, we don't set any value to the field.
				// TODO: do we need these guards if we've already set a field as nonnull? TBD
				setter = `if (${name} != nil) {\n  properties[@"${
					property.raw
				}"] = ${serializableName};\n}\n`
			}
		} else {
			setter = `properties[@"${property.raw}"] = ${serializableName};\n`
		}

		out += setter
	}

	return out
}
