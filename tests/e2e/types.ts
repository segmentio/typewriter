import { SDK, Language } from '../../src/generators/options'
import Joi from '@hapi/joi'

// This interface defines the types of tests we run, and is used to specify the expected
// coverage of each client. Clients should execute every test below, except for langauge-
// specific reasons that preclude that test from being run on that client (f.e. tests
// that would not compile in a staticly-typed language only need to be run in dynamic
// language clients).
export interface Tests {
	// You can configure an event in a Tracking Plan to not have any explicitely
	// set properties. We treat that case as allowing any properties to be passed
	// through. This test validates that passing no properties to this event produces
	// a `properties: {}` in the output payload.
	'sends an empty event with no properties': boolean
	// TODO...
}

// This object declares the set of tests that each client is expected to pass.
export const coverage: Record<SDK, Partial<Record<Language, Tests>>> = {
	[SDK.WEB]: {},
	[SDK.IOS]: {
		[Language.OBJECTIVE_C]: {
			'sends an empty event with no properties': false,
		},
	},
	[SDK.NODE]: {
		[Language.JAVASCRIPT]: {
			'sends an empty event with no properties': true,
		},
		[Language.TYPESCRIPT]: {
			'sends an empty event with no properties': true,
		},
	},
}

export interface TestSuiteError {
	description: string
	error?: object
}

// Messages are expected to conform to this schema, to be considered valid Segment
// payloads.
const baseSegmentPayloadSchema = Joi.object().keys({})

// Messages sent from our mobile SDKs are expected to match this schema to be considered
// valid Segment payloads.
const mobileSegmentPayloadSchema = Joi.object().keys({})

export function validateSegmentMessage(payload: object): Joi.ValidationError | undefined {
	for (let schema of [baseSegmentPayloadSchema, mobileSegmentPayloadSchema]) {
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
