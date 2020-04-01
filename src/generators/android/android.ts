import { camelCase, upperFirst } from 'lodash'
import { Type, Schema } from '../ast'
import * as Handlebars from 'handlebars'
import { Generator, BasePropertyContext, GeneratorClient } from '../gen'

// These contexts are what will be passed to Handlebars to perform rendering.
// Everything in these contexts should be properly sanitized.

interface AndroidObjectContext {
	// The formatted name for this object, ex: "numAvocados
	name: string
	required: (AndroidPropertyContext & BasePropertyContext)[] | []
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

enum StringifiedType {
	Properties = 'Properties',
}

enum Modifier {
	FinalNullable = 'final @Nullable',
	FinalNonNullable = 'final @NonNull',
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
		return {}
	},
	generatePrimitive: async (client, schema, parentPath) => {
		let type = 'id'

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

		const className = client.namer.register(schema.name, 'class', {
			transform: (name: string) => {
				const match = name.match(/^(.*)s item/i)
				return `SEG${upperFirst(camelCase(match ? match[1] : name))}`
			},
		})

		let object: AndroidObjectContext | undefined = undefined

		if (properties.length > 0) {
			property.type = className
			object = {
				name: className,
				required: properties.filter(p => p.isRequired),
			}
		}

		return { property, object }
	},
	generateUnion: async (client, schema, _, parentPath) => {
		// TODO: support unions
		return defaultPropertyContext(client, schema, 'id', parentPath)
	},
	generateTrackCall: async (client, schema) => ({
		functionName: client.namer.register(schema.name, 'function->track', {
			transform: camelCase,
		}),
	}),
	generateRoot: async (client, context) => {
		await Promise.all([
			client.generateFile(
				'SEGTypewriterAnalytics.java',
				'generators/android/templates/analytics.java.hbs',
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

function generateBuilderFunctionBody(
	name: string,
	rawName: string,
	modifiers: string,
	type: string
): string {
	const isArrayType = type.match(/List\<(.*)\>/)
	const makeArraySerializableSnippet =
		isArrayType && isArrayType[1] !== StringifiedType.Properties
			? `
      List<Properties> p = new ArrayList<>();
      for(${isArrayType && isArrayType[1]} elem : ${name}) {
        p.add(elem.toProperties());
      }`
			: ''

	return `{${makeArraySerializableSnippet}
      properties.putValue("${rawName}", ${name});
      return this;
    }`
}

function generateFunctionSignature(
	{ functionName }: { functionName: string },
	withOptions: boolean
): string {
	// prettier-ignore
	return `public void ${functionName}(final @Nullable SEG${upperFirst(functionName)} props${withOptions ? ', final @Nullable Options options': ''})`;
}

function generateFunctionExecution(
	{ rawEventName }: { rawEventName: string },
	withOptions: boolean
): string {
	return `{
    this.analytics.track("${rawEventName}", props.toProperties()${withOptions ? ', options' : ''});
  }`
}
