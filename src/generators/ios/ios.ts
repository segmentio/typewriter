import { File, TrackingPlan, GenOptions } from '../gen'
import { generateFromTemplate } from '../../templates'
import Namer from '../namer'
import { camelCase, upperFirst } from 'lodash'
import { Schema, Type, getPropertiesSchema } from '../ast'

// See: https://github.com/AnanthaRajuCprojects/Reserved-Key-Words-list-of-various-programming-languages/blob/master/Objective-C%20Reserved%20Words.md
// prettier-ignore
const reservedWords = [
	'asm', 'atomic', 'auto', 'bool', 'break', 'bycopy', 'byref', 'case', 'catch', 'char',
	'class', 'const', 'continue', 'copy', 'debugDescription', 'default', 'description',
	'do', 'double', 'dynamic', 'else', 'end', 'enum', 'extern', 'false', 'finally', 'float',
	'for', 'goto', 'hash', 'id', 'if', 'imp', 'implementation', 'in', 'init', 'inline',
	'inout', 'int', 'interface', 'long', 'mutableCopy', 'new', 'nil', 'no', 'nonatomic',
	'null', 'oneway', 'options', 'out', 'private', 'property', 'protected', 'protocol', 'public',
	'register', 'restrict', 'retain', 'return', 'sel', 'selector', 'self', 'short', 'signed',
	'sizeof', 'static', 'struct', 'super', 'superclass', 'switch', 'synthesize', 'throw',
	'true', 'try', 'typedef', 'typeof', 'union', 'unsigned', 'void', 'volatile', 'while', 'yes'
]

interface TemplateSharedContext {
	isDevelopment: boolean
	language: string
	typewriterVersion: string
}

interface TemplateAnalyticsContext extends TemplateSharedContext {
	// All track calls available in this client.
	tracks: TemplateTrackCall[]
	// All property groups, each rendered in its own file.
	objects: TemplateObject[]
}

interface TemplateObjectContext extends TemplateSharedContext, TemplateObject {}

// Represents a single exposed track() call.
interface TemplateTrackCall {
	// The formatted function name.
	functionName: string
	// The raw name of the event being tracked.
	eventName: string
	// The optional function description.
	description?: string
	// The generated function type definition. ex: 'functionNameWithParam1:param1 param2:param2'
	functionSignature: string
	// Same as above, but for the variant with an options argument.
	functionSignatureWithOptions: string
	functionCallWithOptions: string
	// All properties that can be set on this event.
	properties: TemplateProperty[]
}

interface TemplateObject {
	// The formatted name of this object. ex: SEGProduct
	name: string
	// All properties that can be set on this object.
	properties: TemplateProperty[]
	// Function signature for the initialization
	initFunctionSignature: string
}

interface TemplateProperty {
	// The formatted name of this property. ex: "userID"
	name: string
	// The raw name of this property. ex: "user id"
	raw: string
	// The type of this property. ex: "NSNumber"
	type: string
	// The optional description of this property.
	description?: string
	// Stringified property modifiers. ex: "nonatomic, copy"
	modifiers: string
	// Whether the property is required.
	isRequired: boolean
	// The following boolean fields are used for conditional templating, since
	// Handlebars doesn't support performing performing comparisons inside templates.
	isBoolean: boolean
	isInteger: boolean
	isClass: boolean
	isArray: boolean
}

export default async function(trackingPlan: TrackingPlan, options: GenOptions): Promise<File[]> {
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
			contents: await generateFromTemplate<TemplateSharedContext>(
				'generators/ios/templates/SEGTypewriterUtils.h.hbs',
				ctx
			),
		},
		{
			path: 'SEGTypewriterUtils.m',
			contents: await generateFromTemplate<TemplateSharedContext>(
				'generators/ios/templates/SEGTypewriterUtils.m.hbs',
				ctx
			),
		},
		{
			path: 'SEGTypewriterSerializable.h',
			contents: await generateFromTemplate<TemplateSharedContext>(
				'generators/ios/templates/SEGTypewriterSerializable.h.hbs',
				ctx
			),
		},
	]

	for (var o of ctx.objects) {
		const objectContext: TemplateObjectContext = {
			...getSharedContext(options),
			...o,
		}

		files.push(
			{
				path: `${o.name}.h`,
				contents: await generateFromTemplate<TemplateObjectContext>(
					'generators/ios/templates/object.h.hbs',
					objectContext
				),
			},
			{
				path: `${o.name}.m`,
				contents: await generateFromTemplate<TemplateObjectContext>(
					'generators/ios/templates/object.m.hbs',
					objectContext
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
		...getSharedContext(options),
		tracks: [],
		objects: [],
	}

	const namer = new Namer({
		reservedWords,
		quoteChar: '"',
		allowedIdentifierStartingChars: 'A-Za-z_$',
		allowedIdentifierChars: 'A-Za-z0-9_$',
	})

	for (var { schema } of trackingPlan.trackCalls) {
		const propertiesSchema = getPropertiesSchema(schema)

		const functionName = namer.register(propertiesSchema.name, 'function', camelCase)

		const parameters: TemplateProperty[] = []
		const namespace = `function->${functionName}`
		for (var rootProperty of propertiesSchema.properties) {
			const template = getProperty(rootProperty, context, namer, namespace)
			parameters.push(template)
		}

		const option = {
			name: 'options',
			type: 'SERIALIZABLE_DICT',
			isRequired: false,
		}

		// TODO: is there a bug with supplying custom options/context fields?
		// We should add this as a standard test.
		context.tracks.push({
			functionName,
			eventName: namer.escapeString(schema.name),
			description: schema.description,
			functionSignature: getFunctionSignature(functionName, parameters),
			functionSignatureWithOptions: getFunctionSignature(functionName, [...parameters, option]),
			functionCallWithOptions: getFunctionCall(functionName, [
				...parameters.map(p => ({ name: p.name, value: p.name })),
				{ name: 'options', value: '@{}' },
			]),
			properties: parameters,
		})
	}

	return context
}

function getSharedContext(options: GenOptions): TemplateSharedContext {
	return {
		isDevelopment: options.isDevelopment,
		language: options.client.language,
		typewriterVersion: options.typewriterVersion,
	}
}

function getProperty(
	schema: Schema,
	context: TemplateAnalyticsContext,
	namer: Namer,
	namespace: string
): TemplateProperty {
	const res: TemplateProperty = {
		type: 'id',
		name: namer.register(schema.name, namespace, camelCase),
		raw: schema.name,
		description: schema.description,
		modifiers: 'strong, nonatomic',
		isRequired: !!schema.isRequired && !schema.isNullable,
		isBoolean: false,
		isInteger: false,
		isClass: false,
		isArray: false,
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
			type: schema.isRequired ? 'BOOL' : 'BOOL *',
			isBoolean: true,
		}
	} else if (schema.type === Type.INTEGER) {
		return {
			...res,
			type: schema.isRequired ? 'NSInteger' : 'NSInteger *',
			isInteger: true,
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

		const name = namer.register(schema.name, 'interface', (name: string) => {
			return `SEG${upperFirst(camelCase(name))}`
		})
		const properties = schema.properties.map(p =>
			getProperty(p, context, namer, `interface->${name}`)
		)
		const object: TemplateObject = {
			name,
			properties,
			initFunctionSignature: getFunctionSignature('init', properties),
		}
		context.objects.push(object)

		return {
			...res,
			type: `${name} *`,
			isClass: true,
		}
	} else if (schema.type === Type.ARRAY) {
		const itemsSchema: Schema = {
			name: `${res.name} Item`,
			description: res.description,
			...schema.items,
		}
		const item = getProperty(itemsSchema, context, namer, `${namespace}->array`)

		return {
			...res,
			type: `NSArray<${item.type}> *`,
			isArray: true,
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

// TODO: can we make this a Handlebars partial somehow?
function getFunctionSignature(
	name: string,
	parameters: { type: string; name: string; isRequired: boolean }[]
): string {
	let functionSignature = name
	if (parameters.length > 0) {
		functionSignature += `With${upperFirst(parameters[0].name)}:(${withNullability(
			parameters[0]
		)})${parameters[0].name}\n`
	}
	for (var parameter of parameters.slice(1)) {
		functionSignature += `${parameter.name}:(${withNullability(parameter)})${parameter.name}\n`
	}

	return functionSignature.trim()
}

function withNullability(property: { type: string; isRequired: boolean }) {
	const { type, isRequired } = property
	// Only attach a nullability attribute if this parameter is a pointer type.
	return /(id|SERIALIZABLE_DICT|\*)$/.test(type)
		? `${isRequired ? 'nonnull' : 'nullable'} ${type}`
		: type
}

// TODO: can we make this a Handlebars partial somehow?
function getFunctionCall(name: string, parameters: { name: string; value: string }[]): string {
	let functionCall = name

	const firstParameter = parameters.shift()
	if (firstParameter) {
		functionCall += `With${upperFirst(firstParameter.name)}:${firstParameter.value}`
	}
	for (var { name, value } of parameters) {
		functionCall += ` ${name}:${value}`
	}

	return functionCall.trim()
}
