import Joi from '@hapi/joi'
import { remove } from 'lodash'

declare type Event = any
export const events: Event[] = []

declare global {
	namespace jest {
		interface Matchers<R> {
			toHaveBeenReceived: (schema?: Joi.SchemaMap) => void
			toHaveBeenReceivedMultipleTimes: (schemas?: Joi.SchemaMap[]) => void
		}
	}
}

function toHaveBeenReceived(
	eventName: string,
	schemas?: Joi.SchemaMap[]
): jest.CustomMatcherResult {
	const n = schemas ? schemas.length : 1
	const matchingEvents = remove(events, v => v.type === 'track' && v.event === eventName)

	if (matchingEvents.length !== n) {
		return {
			message: () =>
				`Expected ${n === 1 ? 'one' : n} '${eventName}' track call, but ${
					matchingEvents.length === 0 ? 'none' : `${matchingEvents.length}`
				} were received`,
			pass: matchingEvents.length === n,
		}
	}

	let validationErrors: Joi.ValidationError[] = []
	if (schemas) {
		for (let i in matchingEvents) {
			const event = matchingEvents[i]
			const schema = Joi.object().keys({
				properties: Joi.object()
					.keys(schemas[i])
					.unknown(false),
			})
			let resp = Joi.validate(event, schema, {
				abortEarly: false,
				allowUnknown: true,
			})
			if (!!resp.error) {
				validationErrors.push(resp.error)
			}
		}
	}

	return {
		message: () => `Schema validation failed: ${validationErrors}`,
		pass: validationErrors.length === 0,
	}
}

expect.extend({
	// Checks if an event was included in the events list from the sidecar snapshotter.
	// Removes the matching events from the events list.
	toHaveBeenReceived(eventName: string, schema?: Joi.SchemaMap) {
		return toHaveBeenReceived(eventName, schema ? [schema] : undefined)
	},
	toHaveBeenReceivedMultipleTimes(eventName: string, schemas: Joi.SchemaMap[]) {
		return toHaveBeenReceived(eventName, schemas)
	},
})

export function exactArray<T>(arr: T[]): Joi.ArraySchema {
	return Joi.array()
		.ordered(arr)
		.length(arr.length)
}

// Messages are expected to conform to this schema, to be considered valid Segment
// payloads.
const baseSegmentPayloadSchema = Joi.object().keys({
	properties: Joi.object(),
	userId: 'user-1234',
	event: Joi.string(),
	context: Joi.object().keys({
		library: Joi.object().keys({
			name: Joi.string(),
			version: Joi.string(),
		}),
		typewriter: Joi.object().keys({
			language: Joi.string(),
			version: Joi.string(),
		}),
	}),
	type: Joi.string(),
})

export function validateSegmentEvent(payload: object): Joi.ValidationError | undefined {
	for (let schema of [baseSegmentPayloadSchema]) {
		const { error } = Joi.validate(payload, schema, {
			abortEarly: false,
			allowUnknown: true,
		})
		if (error) {
			return error
		}
	}

	return undefined
}
