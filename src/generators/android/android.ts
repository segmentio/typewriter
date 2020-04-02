import { camelCase, upperFirst } from 'lodash'
import { Type, Schema, getPropertiesSchema } from '../ast'
import * as Handlebars from 'handlebars'
import { Generator, BasePropertyContext, GeneratorClient } from '../gen'

// These contexts are what will be passed to Handlebars to perform rendering.
// Everything in these contexts should be properly sanitized.

interface AndroidObjectContext {
	// The formatted name for this object, ex: "ProductClicked"
	name: string
}

interface AndroidPropertyContext {
	// The formatted name for this property, ex: "numAvocados".
	name: string
	// The type of this property. ex: "String".
	type: string
	// Stringified property modifiers. ex: "final, @Nonnull".
	modifiers: Modifier
	// Whether the property is nullable (@Nonnull vs @Nullable modifier).
	isVariableNullable: boolean
	// Whether null is a valid value for this property when sent to Segment.
	isPayloadFieldNullable: boolean
}

interface AndroidTrackCallContext {
	// The formatted function name, ex: "orderCompleted".
	functionName: string
	propsParam: boolean
}

export const android: Generator<
	{},
	AndroidTrackCallContext,
	AndroidObjectContext,
	AndroidPropertyContext
> = {
	generatePropertiesObject: true,
	namer: {
		// See: https://github.com/AnanthaRajuCprojects/Reserved-Key-Words-list-of-various-programming-languages/blob/master/Objective-C%20Reserved%20Words.md
		// prettier-ignore
		reservedWords: [],
		quoteChar: '"',
		allowedIdentifierStartingChars: 'A-Za-z_$',
		allowedIdentifierChars: 'A-Za-z0-9_$',
	},
	setup: async () => {
		Handlebars.registerHelper('functionSignature', generateFunctionSignature)
		Handlebars.registerHelper('functionExecution', generateFunctionExecution)
		Handlebars.registerHelper('builderSignature', generateBuilderFunctionSignature)
		Handlebars.registerHelper('builderExecution', generateBuilderFunctionBody)
		Handlebars.registerHelper('propertiesGetterSetter', generatePropertiesGetterSetter)
		return {}
	},
	generatePrimitive: async (client, schema, parentPath) => {
		let type = '?'

		if (schema.type === Type.STRING) {
			type = 'String'
		} else if (schema.type === Type.BOOLEAN) {
			type = 'Boolean'
		} else if (schema.type === Type.INTEGER) {
			type = 'Integer'
		} else if (schema.type === Type.NUMBER) {
			type = 'Double'
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

		let object: AndroidObjectContext | undefined

		if (properties.length > 0) {
			const className = client.namer.register(schema.name, 'class', {
				transform: (name: string) => {
					return upperFirst(camelCase(name))
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
		// TODO: support unions
		return defaultPropertyContext(client, schema, '?', parentPath)
	},
	generateTrackCall: async (client, schema) => {
		const { properties } = getPropertiesSchema(schema)
		return {
			functionName: client.namer.register(schema.name, 'function->track', {
				transform: camelCase,
			}),
			propsParam: !!properties.length,
		}
	},
	generateRoot: async (client, context) => {
		await Promise.all([
			client.generateFile(
				'SEGTypewriterAnalytics.java',
				'generators/android/templates/analytics.java.hbs',
				context
			),
			client.generateFile(
				'TypewriterArraySerializer.java',
				'generators/android/templates/serializeArray.java.hbs',
				context
			),
			...context.objects.map(o =>
				client.generateFile(`${o.name}.java`, 'generators/android/templates/class.java.hbs', o)
			),
		])
	},
}

interface Param {
	hasParam: boolean
	name: string
	type: string
}

interface Arg {
	inUse: boolean
	execution: string
	fallback?: string
}

enum Modifier {
	FinalNullable = 'final @Nullable',
	FinalNonNullable = 'final @NonNull',
}

enum Separator {
	Comma = ', ',
	Indent = '  ',
}

enum Properties {
	ToProperties = 'props.toProperties()',
	Create = 'new Properties()',
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
		modifiers:
			!schema.isRequired || !!schema.isNullable
				? Modifier.FinalNullable
				: Modifier.FinalNonNullable,
		isVariableNullable: !schema.isRequired || !!schema.isNullable,
		isPayloadFieldNullable: !!schema.isNullable,
	}
}

function generateBuilderFunctionSignature(name: string, modifiers: string, type: string): string {
	return `public Builder ${name}(${modifiers} ${type} ${name})`
}

function generateBuilderFunctionBody(name: string, rawName: string, type: string): string {
	const isArrayType = type.match(/List\<(.*)\>/)
	const defaultHandler = (raw = rawName, n = name) => {
		return `${Separator.Indent}properties.putValue("${raw}", ${n});
    ${Separator.Indent}return this;`
	}

	const serializeArray = `${Separator.Indent}List<?> p = ArraySerializer.serialize(${name});
    ${defaultHandler(rawName, 'p')}`

	return isArrayType && isArrayType[1] !== 'Properties'
		? `{
    ${serializeArray}
    }`
		: `{
    ${defaultHandler()}
    }`
}

const getValidParams = (potentialParams: Param[]) =>
	potentialParams.reduce((acc: string[], { hasParam, name, type }) => {
		if (hasParam) {
			acc.push(`${Modifier.FinalNullable} ${type} ${name}`)
		}
		return acc
	}, [])

const getValidArgs = (potentialParams: Arg[], defaultArg?: string[]) =>
	potentialParams.reduce((acc: string[], { inUse, execution, fallback }) => {
		if (inUse) {
			acc.push(execution)
		} else if (fallback) {
			acc.push(fallback)
		}
		return acc
	}, defaultArg || [])

const intersperse = (values: string[], char: string) => {
	let joined = values[0] || ''
	if (values.length) {
		for (let i = 1; i < values.length; i++) {
			joined += `${char}${values[i]}`
		}
	}
	return joined
}

function generateFunctionSignature(
	{ functionName, propsParam }: { functionName: string; propsParam: boolean },
	withOptions: boolean
): string {
	const params = getValidParams([
		{ hasParam: propsParam, name: 'props', type: upperFirst(functionName) },
		{ hasParam: withOptions, name: 'options', type: 'Options' },
	])

	return `public void ${functionName}(${intersperse(params, Separator.Comma)})`
}

function generateFunctionExecution(
	{ rawEventName, propsParam }: { rawEventName: string; propsParam: boolean },
	withOptions: boolean
): string {
	const args = getValidArgs(
		[
			{ inUse: propsParam, execution: Properties.ToProperties, fallback: Properties.Create },
			{ inUse: withOptions, execution: 'options' },
		],
		[`"${rawEventName}"`]
	)
	return `{
    this.analytics.track(${intersperse(args, Separator.Comma)});
  }`
}

function generatePropertiesGetterSetter(name: string): string {
	return `
  private ${name}(Properties properties) {
    this.properties = properties;
  }

  protected Properties toProperties() {
    return properties;
  }
  `
}
