import { File, Options } from '../../gen'
import { Schema, Type } from '../../ast'
import * as fs from 'fs'
import * as Handlebars from 'handlebars'
import { camelCase, capitalize } from 'lodash'
import { promisify } from 'util'
import { resolve } from 'path'
import Namer from '../../namer'

const readFile = promisify(fs.readFile)

// The context that will be passed to Handlebars to perform rendering.
// Everything in this context should be properly sanitized.
interface TemplateContext {
	trackCalls: TrackCall[]
	interfaces: TSInterface[]
}

// Represents a single exposed track() call.
interface TrackCall {
	// The formatted function name.
	functionName: string
	// The raw name of the event being tracked.
	eventName: string
	// The optional function description.
	description?: string
	// The type of the analytics properties object.
	propsType: string
}

// Represents a generated interface.
interface TSInterface {
	// The name of the interface itself.
	name: string
	// The optional interface description.
	description?: string
	// The properties expected within this interface.
	properties: TSInterfaceProperty[]
}

// Represents a single property within a generated Interface.
interface TSInterfaceProperty {
	name: string
	description?: string
	isRequired: boolean
	type: string
}

// See: https://mathiasbynens.be/notes/reserved-keywords#ecmascript-6
// prettier-ignore
const reservedWords = [
	'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'enum', 'eval', 'null', 'this',
	'true', 'void', 'with', 'await', 'break', 'catch', 'class', 'const', 'false', 'super', 'throw',
	'while', 'yield', 'delete', 'export', 'import', 'public', 'return', 'static', 'switch', 'typeof',
	'default', 'extends', 'finally', 'package', 'private', 'continue', 'debugger', 'function', 'arguments',
	'interface', 'protected', 'implements', 'instanceof',
]

const namer = new Namer({
	reservedWords,
	quoteChar: "'",
	// Note: we don't support the full range of allowed JS chars, instead focusing on a subset.
	// The full regex 11k+ chars: https://mathiasbynens.be/demo/javascript-identifier-regex
	// See: https://mathiasbynens.be/notes/javascript-identifiers-es6
	allowedIdentifierStartingChars: 'A-Za-z_$',
	allowedIdentifierChars: 'A-Za-z0-9_$',
})

export default async function(
	events: Schema[],
	opts: Options
): Promise<File[]> {
	const context = generateContext(events)

	// Render the Handlebars template using the generated TemplateContext.
	const templateContent = await readFile(resolve(__dirname, './template.hbs'), {
		encoding: 'utf-8',
	})
	const templater = Handlebars.compile(templateContent, {
		noEscape: true,
	})
	const contents = templater(context)

	return [
		{
			path: 'index.ts',
			contents,
		},
	]
}

function generateContext(events: Schema[]): TemplateContext {
	// Render a TemplateContext based on the set of schemas.
	const context: TemplateContext = {
		trackCalls: [],
		interfaces: [],
	}

	for (var event of events) {
		// Generate interfaces for each event's properties.
		// First, pull out the schema for the event's properties, with a sane default:
		let properties: Schema = {
			name: 'properties',
			type: Type.OBJECT,
			properties: [],
		}
		if (event.type === Type.OBJECT) {
			const propertiesSchema = event.properties.find(
				(schema: Schema): boolean => schema.name === 'properties'
			)
			if (propertiesSchema && propertiesSchema.type === Type.OBJECT) {
				properties = propertiesSchema
			}
		}

		// Use the event's name and description when generating an interface
		// to represent these properties.
		properties.name = event.name
		properties.description = event.description

		context.trackCalls.push({
			functionName: namer.escapeIdentifier(camelCase(event.name)),
			eventName: namer.escapeString(event.name),
			description: event.description,
			propsType: generateTypeDeclarations(properties, context),
		})
	}

	return context
}

function generateTypeDeclarations(
	schema: Schema,
	context: TemplateContext
): string {
	let type: string
	if (schema.type === Type.ANY) {
		type = 'any'
	} else if (schema.type === Type.STRING) {
		type = 'string'
	} else if (schema.type === Type.BOOLEAN) {
		type = 'boolean'
	} else if (schema.type === Type.INTEGER || schema.type === Type.NUMBER) {
		type = 'number'
	} else if (schema.type === Type.OBJECT) {
		// If no properties are set, allow this track call to take any properties.
		if (schema.properties.length === 0) {
			type = 'Record<string, any>'
		} else {
			const properties: TSInterfaceProperty[] = []
			for (var property of schema.properties) {
				properties.push({
					// We want property names to be grep-able, so we use JS's ability to escape
					// identifiers using quotes.
					name: namer.escapeString(property.name),
					description: property.description,
					isRequired: !!property.isRequired,
					type: generateTypeDeclarations(property, context),
				})
			}

			type = namer.escapeIdentifier(capitalize(camelCase(schema.name)))
			context.interfaces.push({
				name: type,
				description: schema.description,
				properties,
			})
		}
	} else if (schema.type === Type.ARRAY) {
		const itemsSchema = {
			name: schema.name,
			description: schema.description,
			...schema.items,
		}

		type = `${generateTypeDeclarations(itemsSchema, context)}[]`
	} else if (schema.type === Type.UNION) {
		const types = schema.types.map(t => {
			const subSchema = {
				name: schema.name,
				description: schema.description,
				...t,
			}

			return generateTypeDeclarations(subSchema, context)
		})

		type = types.join(' | ')
	} else {
		throw new Error(`Invalid Schema Type: ${schema.type}`)
	}

	return schema.isNullable && schema.type !== Type.ANY ? `${type} | null` : type
}
