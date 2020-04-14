import { camelCase, upperFirst } from 'lodash'
import { Type, Schema, getPropertiesSchema } from '../ast'
import * as Handlebars from 'handlebars'
import { Generator, GeneratorClient, BasePropertyContext } from '../gen'

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
	// Whether runtime error should be thrown for null payload value
	shouldThrowRuntimeError: boolean | undefined
}

interface AndroidTrackCallContext {
	// The formatted function name, ex: "orderCompleted".
	functionName: string
	propsParam: boolean
}

enum JavaType {
	String = 'String',
	Long = 'Long',
	Double = 'Double',
	Boolean = 'Boolean',
	Object = 'Object',
}

export const android: Generator<
	{},
	AndroidTrackCallContext,
	AndroidObjectContext,
	AndroidPropertyContext
> = {
	generatePropertiesObject: true,
	namer: {
		// See: https://github.com/AnanthaRajuCprojects/Reserved-Key-Words-list-of-various-programming-languages/blob/master/Java%20Keywords%20List.md
		// prettier-ignore
		reservedWords: [
      "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
      "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float",
      "for", "goto", "if", "implement", "imports", "instanceof", "int", "interface", "long", "native",
      "new", "package", "private", "protected", "public", "return", "short", "static", "strictfp", "super",
      "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void", "volatile", "while"
    ],
		quoteChar: '"',
		allowedIdentifierStartingChars: 'A-Za-z_',
		allowedIdentifierChars: 'A-Za-z0-9_',
	},
	setup: async () => {
		Handlebars.registerHelper('trackCallFunctionSignature', generateFunctionSignature)
		Handlebars.registerHelper('trackCallFunctionExecution', generateFunctionExecution)
		Handlebars.registerHelper('builderFunctionBody', generateBuilderFunctionBody)
		return {}
	},
	generatePrimitive: async (client, schema, parentPath) => {
		let type = JavaType.Object

		if (schema.type === Type.STRING) {
			type = JavaType.String
		} else if (schema.type === Type.BOOLEAN) {
			type = JavaType.Boolean
		} else if (schema.type === Type.INTEGER) {
			type = JavaType.Long
		} else if (schema.type === Type.NUMBER) {
			type = JavaType.Double
		}

		return defaultPropertyContext(client, schema, type, parentPath)
	},
	generateArray: async (client, schema, items, parentPath) => {
		return defaultPropertyContext(client, schema, `List<${items.type}>`, parentPath)
	},
	generateObject: async (client, schema, properties, parentPath) => {
		const property = defaultPropertyContext(client, schema, JavaType.Object, parentPath)
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
		return defaultPropertyContext(client, schema, 'Object', parentPath)
	},
	generateTrackCall: async (client, schema) => {
		const { properties } = getPropertiesSchema(schema)
		return {
			class: schema.name.replace(/\s/g, ''),
			functionName: client.namer.register(schema.name, 'function->track', {
				transform: camelCase,
			}),
			propsParam: !!properties.length,
		}
	},
	generateRoot: async (client, context) => {
		await Promise.all([
			client.generateFile(
				'TypewriterAnalytics.java',
				'generators/android/templates/analytics.java.hbs',
				context
			),
			client.generateFile(
				'TypewriterUtils.java',
				'generators/android/templates/typewriterUtils.java.hbs',
				context
			),
			client.generateFile(
				'SerializableProperties.java',
				'generators/android/templates/abstractSerializableClass.java.hbs',
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
	NewLineIndent = '      ',
}

enum Properties {
	ToProperties = 'props.toProperties()',
	Create = 'new Properties()',
}

enum Options {
	MergeOptions = 'TypewriterUtils.addTypewriterContext(options)',
	Create = 'TypewriterUtils.addTypewriterContext()',
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
		shouldThrowRuntimeError: schema.isRequired && !schema.isNullable,
	}
}

function generateBuilderFunctionBody(name: string, rawName: string, type: string): string {
	const isArrayType = type.match(/List\<(.*)\>/)
	const isSerializable = Object.values(JavaType).every(t => t !== type)

	const defaultHandler = (raw = rawName, n = name, indentFirstLine = true) =>
		`${indentFirstLine ? Separator.Indent : ''}properties.putValue("${raw}", ${n});\n` +
		`${Separator.NewLineIndent}return this;`

	const serializeObject =
		`${Separator.Indent}if(${name} != null){\n` +
		`${Separator.NewLineIndent}${
			Separator.Indent
		}properties.putValue("${rawName}", ${name}.toProperties());\n` +
		`${Separator.NewLineIndent}}else{\n` +
		`${Separator.NewLineIndent}${Separator.Indent}properties.putValue("${rawName}", ${name});\n` +
		`${Separator.NewLineIndent}}\n` +
		`${Separator.NewLineIndent}return this;`

	const serializeArray =
		`${Separator.Indent}List<?> p = TypewriterUtils.serialize(${name});\n` +
		`${Separator.NewLineIndent}${defaultHandler(rawName, 'p', false)}`

	return isArrayType && isArrayType[1] !== 'Properties'
		? serializeArray
		: isSerializable
		? serializeObject
		: defaultHandler()
}

const getValidParams = (potentialParams: Param[]) =>
	potentialParams.reduce((acc: string[], { hasParam, name, type }) => {
		if (hasParam) {
			acc.push(`${Modifier.FinalNullable} ${type} ${name}`)
		}
		return acc
	}, [])

const getValidArgs = (potentialArgs: Arg[], defaultArg?: string[]) =>
	potentialArgs.reduce((acc: string[], { inUse, execution, fallback }) => {
		if (inUse) {
			acc.push(execution)
		} else if (fallback) {
			acc.push(fallback)
		}
		return acc
	}, defaultArg || [])

function generateFunctionSignature(
	{ functionName, propsParam }: { functionName: string; propsParam: boolean },
	withOptions: boolean
): string {
	const params = getValidParams([
		{ hasParam: propsParam, name: 'props', type: upperFirst(functionName) },
		{ hasParam: withOptions, name: 'options', type: 'Options' },
	])

	return `public void ${functionName}(${params.join(Separator.Comma)})`
}

function generateFunctionExecution(
	{ rawEventName, propsParam }: { rawEventName: string; propsParam: boolean },
	withOptions: boolean
): string {
	const args = getValidArgs(
		[
			{ inUse: propsParam, execution: Properties.ToProperties, fallback: Properties.Create },
			{ inUse: withOptions, execution: Options.MergeOptions, fallback: Options.Create },
		],
		[`"${rawEventName}"`]
	)
	return `{
    this.analytics.track(${args.join(Separator.Comma)});
  }`
}
