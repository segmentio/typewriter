import { camelCase, upperFirst } from 'lodash'
import { Type, Schema, getPropertiesSchema } from '../ast'
import { Generator, GeneratorClient } from '../gen'

// These contexts are what will be passed to Handlebars to perform rendering.
// Everything in these contexts should be properly sanitized.

type AndroidObjectContext = {
	// The formatted name for this object, ex: "ProductClicked"
	name: string
}

type AndroidPropertyContext = {
	// The formatted name for this property, ex: "numAvocados".
	name: string
	// The type of this property. ex: "String".
	type: string
	// Whether the property is nullable (@NonNull vs @Nullable modifier).
	isVariableNullable: boolean
	// Whether runtime error should be thrown for null payload value
	shouldThrowRuntimeError: boolean | undefined
	// Whether this is a List property
	isListType: boolean
	// Whether this is property can be serialized with toProperties()
	implementsSerializableProperties: boolean
}

type AndroidTrackCallContext = {
	// The formatted function name, ex: "orderCompleted".
	functionName: string
	propsType: string
	propsParam: boolean
}

export const android: Generator<
	Record<string, unknown>,
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
	generatePrimitive: async (client, schema, parentPath) => {
		let type = 'Object'

		if (schema.type === Type.STRING) {
			type = 'String'
		} else if (schema.type === Type.BOOLEAN) {
			type = 'Boolean'
		} else if (schema.type === Type.INTEGER) {
			type = 'Long'
		} else if (schema.type === Type.NUMBER) {
			type = 'Double'
		}

		return {
			...defaultPropertyContext(client, schema, type, parentPath),
		}
	},
	setup: async () => ({}),
	generateArray: async (client, schema, items, parentPath) => {
		return {
			...defaultPropertyContext(client, schema, `List<${items.type}>`, parentPath),
			isListType: true,
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
			property.implementsSerializableProperties = true
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
	generateTrackCall: async (client, schema, propertiesObject) => {
		const { properties } = getPropertiesSchema(schema)
		return {
			class: schema.name.replace(/\s/g, ''),
			functionName: client.namer.register(schema.name, 'function->track', {
				transform: camelCase,
			}),
			propsType: propertiesObject.type,
			propsParam: !!properties.length,
		}
	},
	generateRoot: async (client, context) => {
		await Promise.all([
			client.generateFile(
				'TypewriterAnalytics.java',
				'generators/android/templates/TypewriterAnalytics.java.hbs',
				context
			),
			client.generateFile(
				'TypewriterUtils.java',
				'generators/android/templates/TypewriterUtils.java.hbs',
				context
			),
			client.generateFile(
				'SerializableProperties.java',
				'generators/android/templates/SerializableProperties.java.hbs',
				context
			),
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
		isVariableNullable: !schema.isRequired || !!schema.isNullable,
		shouldThrowRuntimeError: schema.isRequired && !schema.isNullable,
		isListType: false,
		implementsSerializableProperties: false,
	}
}
