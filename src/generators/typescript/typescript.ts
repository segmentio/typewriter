import { File, DefaultOptions, Language } from '../../gen'
import { Schema, Type, getPropertiesSchema } from '../../ast'
import { camelCase, capitalize } from 'lodash'
import namer from './namer'
import { getTemplate } from 'src/templates'
import { transpileModule, ModuleKind, ScriptTarget } from 'typescript'

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
	type: string
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

// Which JavaScript environment to generate for.
// The browser environments will use analytics-js, window.analytics, and
// generate analytics calls as functions.
// The Node environment will use analytics-node, and generate class which
// accepts an analytics object. Analytics calls will be class methods.
export enum Environment {
	BROWSER = 1,
	NODE = 2,
}

export interface Options extends DefaultOptions {
	lang: Language.TYPESCRIPT
	env: Environment
	// JavaScript transpilation settings:
	scriptTarget: ScriptTarget
	moduleTarget: ModuleKind
}

export default async function(
	events: Schema[],
	opts: Options
): Promise<File[]> {
	return Promise.all([
		getTemplate<TemplateContext>(
			'generators/typescript/index.ts.hbs',
			'index.ts',
			getContext(events)
		),
	])
}

function getContext(events: Schema[]): TemplateContext {
	// Render a TemplateContext based on the set of event schemas.
	const context: TemplateContext = {
		trackCalls: [],
		interfaces: [],
	}

	for (var event of events) {
		// Recursively generate all types, into the context, for the schema.
		const rootType = getTypeForSchema(getPropertiesSchema(event), context)

		context.trackCalls.push({
			functionName: namer.escapeIdentifier(camelCase(event.name)),
			eventName: namer.escapeString(event.name),
			description: event.description,
			type: rootType,
		})
	}

	return context
}

function getTypeForSchema(schema: Schema, context: TemplateContext): string {
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
			// Otherwise generate an interface to represent the object.
			const properties: TSInterfaceProperty[] = []
			for (var property of schema.properties) {
				properties.push({
					// We want property names to be grep-able, so we use JS's ability to escape
					// identifiers using quotes.
					name: namer.escapeString(property.name),
					description: property.description,
					isRequired: !!property.isRequired,
					type: getTypeForSchema(property, context),
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

		type = `${getTypeForSchema(itemsSchema, context)}[]`
	} else if (schema.type === Type.UNION) {
		const types = schema.types.map(t => {
			const subSchema = {
				name: schema.name,
				description: schema.description,
				...t,
			}

			return getTypeForSchema(subSchema, context)
		})

		type = types.join(' | ')
	} else {
		throw new Error(`Invalid Schema Type: ${schema.type}`)
	}

	return schema.isNullable && schema.type !== Type.ANY ? `${type} | null` : type
}
