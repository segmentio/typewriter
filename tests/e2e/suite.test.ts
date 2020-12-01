import got from 'got'
import { SDK, Language } from '../../src/generators/options'
import Joi from '@hapi/joi'
import { remove } from 'lodash'

const SIDECAR_ADDRESS = 'http://localhost:8765'

if (!process.env.SDK || !process.env.LANGUAGE || !process.env.IS_DEVELOPMENT) {
	throw new Error(
		'You must run as: SDK=<sdk> LANGUAGE=<language> IS_DEVELOPMENT=<true|false> jest ./suite.test.ts'
	)
}

const sdk: SDK = process.env.SDK as SDK
const language: Language = process.env.LANGUAGE as Language
const isDevelopment: boolean = process.env.IS_DEVELOPMENT === 'true'

// events contains all events intercepted by segmentio/mock.
declare type Event = Record<string, unknown>
export const events: Event[] = []

interface Expectation {
	name: string
	if?: boolean
	properties?: Joi.SchemaMap
}

// Joi schema helper for expecting exact matches on array values.
// It's a bit confusing since arrays are used as union schemas,
// not exact matches by default.
function exactArray<T>(arr: T[]): Joi.ArraySchema {
	return Joi.array()
		.ordered(arr)
		.length(arr.length)
}

describe('e2e tests', () => {
	const testCases: {
		// The name of this test case.
		name: string
		// Some clients don't support the full standard test suite, for various reasons.
		// We document those reasons below and skip the associated tests in the suite.
		if?: boolean
		// The set of events we expect to have been captured by `segmentio/mock`.
		expect: Expectation | Expectation[]
	}[] = [
		{
			// For clients where a shared analytics instance (window.analytics, sharedAnalytics, etc)
			// is not available, we should throw an error on an attempted analytics call if the user
			// has not yet provided an analytics instance.
			name: 'a missing analytics instance triggers an error',
			// The analytics-node SDK requires you to initialize an analytics instance before making any
			// calls. Therefore, we can't provide a sane default with standard behavior.
			if: sdk === SDK.NODE,
			expect: {
				name: 'Analytics Instance Missing Threw Error',
			},
		},
		{
			// You can configure an event in a Tracking Plan to not have any explicitly
			// set properties. We treat that case as allowing any properties to be passed
			// through. This test validates that passing no properties to this event produces
			// a `properties: {}` in the output payload.
			name: 'sends an empty event with no properties',
			expect: {
				name: 'Empty Event',
			},
		},
		{
			name: 'sends an event with every supported type (required)',
			expect: {
				name: 'Every Required Type',
				properties: {
					'required any': 'Rick Sanchez',
					'required array': exactArray([137, 'C-137']),
					'required boolean': false,
					'required int': 97,
					'required number': 3.14,
					'required object': {},
					'required string': 'Alpha-Betrium',
					'required string with regex': 'Lawyer Morty',
					'required array with properties': exactArray([
						{
							'required any': 'Rick Sanchez',
							'required array': exactArray([137, 'C-137']),
							'required boolean': false,
							'required int': 97,
							'required number': 3.14,
							'required object': {},
							'required string': 'Alpha-Betrium',
							'required string with regex': 'Lawyer Morty',
						},
					]),
					'required object with properties': {
						'required any': 'Rick Sanchez',
						'required array': exactArray([137, 'C-137']),
						'required boolean': false,
						'required int': 97,
						'required number': 3.14,
						'required object': {},
						'required string': 'Alpha-Betrium',
						'required string with regex': 'Lawyer Morty',
					},
				},
			},
		},
		{
			name: 'sends an event with every supported type (optional)',
			expect: [
				// Not passing any fields:
				{
					name: 'Every Optional Type',
				},
				// Passing real values for all fields:
				{
					name: 'Every Optional Type',
					properties: {
						'optional any': 'Rick Sanchez',
						'optional array': exactArray([137, 'C-137']),
						'optional boolean': false,
						'optional int': 97,
						'optional number': 3.14,
						'optional object': {},
						'optional string': 'Alpha-Betrium',
						'optional string with regex': 'Lawyer Morty',
						'optional array with properties': exactArray([
							{
								'optional any': 'Rick Sanchez',
								'optional array': exactArray([137, 'C-137']),
								'optional boolean': false,
								'optional int': 97,
								'optional number': 3.14,
								'optional object': {},
								'optional string': 'Alpha-Betrium',
								'optional string with regex': 'Lawyer Morty',
							},
						]),
						'optional object with properties': {
							'optional any': 'Rick Sanchez',
							'optional array': exactArray([137, 'C-137']),
							'optional boolean': false,
							'optional int': 97,
							'optional number': 3.14,
							'optional object': {},
							'optional string': 'Alpha-Betrium',
							'optional string with regex': 'Lawyer Morty',
						},
					},
				},
			],
		},
		{
			name: 'sends an event with every supported type (nullable + required)',
			expect: [
				// Passing null for all fields:
				{
					name: 'Every Nullable Required Type',
					properties: {
						'required any': null,
						'required array': null,
						'required boolean': null,
						'required int': null,
						'required number': null,
						'required object': null,
						'required string': null,
						'required string with regex': null,
						'required array with properties': exactArray([
							{
								'required any': null,
								'required array': null,
								'required boolean': null,
								'required int': null,
								'required number': null,
								'required object': null,
								'required string': null,
								'required string with regex': null,
							},
						]),
						'required object with properties': {
							'required any': null,
							'required array': null,
							'required boolean': null,
							'required int': null,
							'required number': null,
							'required object': null,
							'required string': null,
							'required string with regex': null,
						},
					},
				},
				// Passing real values for all fields:
				{
					name: 'Every Nullable Required Type',
					properties: {
						'required any': 'Rick Sanchez',
						'required array': exactArray([137, 'C-137']),
						'required boolean': false,
						'required int': 97,
						'required number': 3.14,
						'required object': {},
						'required string': 'Alpha-Betrium',
						'required string with regex': 'Lawyer Morty',
						'required array with properties': exactArray([
							{
								'required any': 'Rick Sanchez',
								'required array': exactArray([137, 'C-137']),
								'required boolean': false,
								'required int': 97,
								'required number': 3.14,
								'required object': {},
								'required string': 'Alpha-Betrium',
								'required string with regex': 'Lawyer Morty',
							},
						]),
						'required object with properties': {
							'required any': 'Rick Sanchez',
							'required array': exactArray([137, 'C-137']),
							'required boolean': false,
							'required int': 97,
							'required number': 3.14,
							'required object': {},
							'required string': 'Alpha-Betrium',
							'required string with regex': 'Lawyer Morty',
						},
					},
				},
			],
		},
		{
			name: 'sends an event with every supported type (nullable + optional)',
			expect: [
				// Not passing any fields:
				{
					name: 'Every Nullable Optional Type',
				},
				// Passing null for all fields:
				{
					name: 'Every Nullable Optional Type',
					// Unlike in JSON, there's no way to distinguish between a field not set, a field set to null,
					// and a field set to a non-null value in Objective-C. For nullable optional fields, we choose
					// to avoid serializing the field. For required fields, we serialize the value set to null.
					// Therefore, we can't support this case on iOS.
					if: sdk !== SDK.IOS,
					properties: {
						'optional any': null,
						'optional array': null,
						'optional boolean': null,
						'optional int': null,
						'optional number': null,
						'optional object': null,
						'optional string': null,
						'optional string with regex': null,
						'optional array with properties': exactArray([
							{
								'optional any': null,
								'optional array': null,
								'optional boolean': null,
								'optional int': null,
								'optional number': null,
								'optional object': null,
								'optional string': null,
								'optional string with regex': null,
							},
						]),
						'optional object with properties': {
							'optional any': null,
							'optional array': null,
							'optional boolean': null,
							'optional int': null,
							'optional number': null,
							'optional object': null,
							'optional string': null,
							'optional string with regex': null,
						},
					},
				},
				// Passing real values for all fields:
				{
					name: 'Every Nullable Optional Type',
					properties: {
						'optional any': 'Rick Sanchez',
						'optional array': exactArray([137, 'C-137']),
						'optional boolean': false,
						'optional int': 97,
						'optional number': 3.14,
						'optional object': {},
						'optional string': 'Alpha-Betrium',
						'optional string with regex': 'Lawyer Morty',
						'optional array with properties': exactArray([
							{
								'optional any': 'Rick Sanchez',
								'optional array': exactArray([137, 'C-137']),
								'optional boolean': false,
								'optional int': 97,
								'optional number': 3.14,
								'optional object': {},
								'optional string': 'Alpha-Betrium',
								'optional string with regex': 'Lawyer Morty',
							},
						]),
						'optional object with properties': {
							'optional any': 'Rick Sanchez',
							'optional array': exactArray([137, 'C-137']),
							'optional boolean': false,
							'optional int': 97,
							'optional number': 3.14,
							'optional object': {},
							'optional string': 'Alpha-Betrium',
							'optional string with regex': 'Lawyer Morty',
						},
					},
				},
			],
		},
		{
			name: 'sends an event with an event name that requires sanitization',
			expect: {
				name: '42_--terrible==\\"event\'++name~!3',
			},
		},
		{
			name: 'sends an event with a property name that requires sanitization',
			expect: {
				name: 'Property Sanitized',
				properties: {
					'0000---terrible-property-name~!3': 'what a cronenberg',
				},
			},
		},
		{
			name: 'sends events with an event name collision',
			expect: [
				{
					name: 'Event Collided',
				},
				{
					name: 'event_collided',
				},
			],
		},
		{
			name: 'sends an event with a property name collision',
			expect: {
				name: 'Properties Collided',
				properties: {
					'Property Collided': 'The Citadel',
					property_collided: 'Galactic Prison',
				},
			},
		},
		{
			name: 'sends events with property object name collision',
			expect: [
				{
					name: 'Property Object Name Collision #1',
					properties: {
						universe: {
							name: 'Froopyland',
							occupants: exactArray([
								{
									name: 'Beth Smith',
								},
								{
									name: 'Thomas Lipkip',
								},
							]),
						},
					},
				},
				{
					name: 'Property Object Name Collision #2',
					properties: {
						universe: {
							name: 'Froopyland',
							occupants: exactArray([
								{
									name: 'Beth Smith',
								},
								{
									name: 'Thomas Lipkip',
								},
							]),
						},
					},
				},
			],
		},
		{
			name: 'sends an event with arrays of objects',
			expect: {
				name: 'Simple Array Types',
				properties: {
					any: exactArray([137, 'C-137']),
					boolean: exactArray([true, false]),
					integer: exactArray([97]),
					number: exactArray([3.14]),
					object: exactArray([
						{
							name: 'Beth Smith',
						},
					]),
					string: exactArray(['Alpha-Betrium']),
				},
			},
		},
		{
			name: 'sends an event with nested objects',
			expect: {
				name: 'Nested Objects',
				properties: {
					garage: {
						tunnel: {
							'subterranean lab': {
								"jerry's memories": exactArray([]),
								"morty's memories": exactArray([]),
								"summer's contingency plan": 'Oh, man, it’s a scenario four.',
							},
						},
					},
				},
			},
		},
		{
			name: 'sends an event with nested arrays',
			expect: {
				name: 'Nested Arrays',
				properties: {
					universeCharacters: exactArray([
						exactArray([
							{
								name: 'Morty Smith',
							},
							{
								name: 'Rick Sanchez',
							},
						]),
						exactArray([
							{
								name: 'Cronenberg Morty',
							},
							{
								name: 'Cronenberg Rick',
							},
						]),
					]),
				},
			},
		},
		{
			name: 'sends an event with unions',
			// We have not yet added support for unions to the iOS or Android clients.
			if: sdk !== SDK.IOS && sdk !== SDK.ANDROID,
			expect: [
				{
					name: 'Union Type',
					properties: {
						universe_name: 'C-137',
					},
				},
				{
					name: 'Union Type',
					properties: {
						universe_name: 137,
					},
				},
				{
					name: 'Union Type',
					properties: {
						universe_name: null,
					},
				},
			],
		},
		{
			name: 'calls to unknown methods fail quietly',
			// Staticly typed languages (Java, Objective-C, etc.) will fail at compile-time if
			// a generated function is called, but does not exist. However, dynamically typed
			// languages like JavaScript can't do this, so this feature tests that the generated
			// client supports proxying methods s.t. they fail quietly if a generated method does not
			// exist.
			if: [Language.JAVASCRIPT, Language.TYPESCRIPT].includes(language),
			expect: {
				name: 'Unknown Analytics Call Fired',
				properties: {
					method: 'aMissingAnalyticsCall',
				},
			},
		},
		{
			name: 'the default violation handler throws upon a violation',
			// In development mode, we run full JSON Schema validation on payloads and
			// surface any JSON Schema violations to a configurable handler.
			// Note: we can't easily detect in our e2e tests when the default violation handler is
			// fired. The one exception is in environments where we can detect that tests are running
			// because the default violation handler will be configured to throw an error and fail
			// the tests. Currently, the only environment that can do this is Node, because there's
			// a standard in the community around setting NODE_ENV=test (or testing) when a test suite
			// is running.
			if: isDevelopment && sdk === SDK.NODE,
			expect: [
				{
					name: 'Default Violation Handler Called',
				},
			],
		},
		{
			name: 'the default violation handler fires events upon a violation',
			// The default violation handler should always fire events, except for in Node.js
			// environments where we can detect if you are running tests.
			// Note: we have not yet added support for run-time validation to the iOS or Android
			// clients so we cannot detect violations.
			if: !((isDevelopment && sdk === SDK.NODE) || sdk === SDK.IOS || sdk === SDK.ANDROID),
			expect: {
				name: 'Default Violation Handler',
				properties: {
					'regex property': 'Not a Real Morty',
				},
			},
		},
		{
			name: 'when set, a custom violation handler is called upon a violation',
			// We have not yet added support for run-time validation to the iOS or Android clients.
			if: isDevelopment && sdk !== SDK.IOS && sdk !== SDK.ANDROID,
			expect: {
				name: 'Custom Violation Handler Called',
			},
		},
		{
			name: 'when set, a custom violation handler fires events upon a violation',
			// We have not yet added support for run-time validation to the iOS or Android clients.
			if: sdk !== SDK.IOS && sdk !== SDK.ANDROID,
			expect: {
				name: 'Custom Violation Handler',
				properties: {
					'regex property': 'Not a Real Morty',
				},
			},
		},
		{
			name: 'large numbers are serialized correctly',
			expect: {
				name: 'Large Numbers Event',
				properties: {
					'large nullable optional integer': 1230007112658965944,
					'large nullable optional number': 1240007112658965944331.0,
					'large nullable required integer': 1250007112658965944,
					'large nullable required number': 1260007112658965944331.0,
					'large optional integer': 1270007112658965944,
					'large optional number': 1280007112658965944331.0,
					'large required integer': 1290007112658965944,
					'large required number': 1300007112658965944331.0,
				},
			},
		},
		// TODO: can we add tests to validate the behavior of the default violation handler
		// outside of test mode (NODE_ENV!=test)?
		// TODO: add test of supplying custom context fields
	]

	// Fetch all analytics calls that were fired after running the client's e2e test application.
	test('expect all events to be valid', async () => {
		const { body } = await got(`${SIDECAR_ADDRESS}/messages`, {
			json: true,
			timeout: 3000, // ms
		})
		events.push(...body)
		if (process.env.CI) {
			console.log(JSON.stringify(events, undefined, 4))
		}

		expect(events.length).toBeGreaterThan(0)
		// Do a sanity check to make sure our client isn't overwriting any fields that
		// are usually set by the SDK itself.
		for (const event of events) {
			const resp = Joi.validate(
				event,
				Joi.object().keys({
					properties: Joi.object(),
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
				}),
				{
					abortEarly: false,
					allowUnknown: true,
					presence: 'required',
				}
			)
			expect(resp.error, JSON.stringify(event, undefined, 2)).toBeNull()
		}
	})

	for (const testCase of testCases) {
		const t = testCase.if === undefined || testCase.if ? test : test.skip
		t(testCase.name, () => {
			const expectations = ([] as Expectation[]).concat(testCase.expect)
			const expectationsByName = expectations.reduce<Record<string, Joi.SchemaMap[]>>((m, exp) => {
				if (exp.if !== undefined && !exp.if) {
					return m
				}

				return {
					...m,
					[exp.name]: (m[exp.name] || []).concat(exp.properties || {}),
				}
			}, {})

			for (const [name, propertySchemas] of Object.entries(expectationsByName)) {
				const matchingEvents = remove(events, v => v.type === 'track' && v.event === name)
				const schemas = propertySchemas.map(ps =>
					Joi.object().keys({
						properties: Joi.object()
							.keys(ps)
							.unknown(false),
					})
				)

				expect(matchingEvents).toHaveLength(schemas.length)
				const errors = [] as Joi.ValidationError[]
				for (const event of matchingEvents) {
					const i = schemas.findIndex(schema => {
						const resp = Joi.validate(event, schema, {
							abortEarly: false,
							allowUnknown: true,
							presence: 'required',
						})

						if (resp.error) {
							errors.push(resp.error)
						}

						return !resp.error
					})
					// Verify that at least one schema matched.
					expect(
						i >= 0,
						`Of ${
							schemas.length
						} schema(s), none matched. The following errors were produced by each schema:\n\n${JSON.stringify(
							{ errors },
							undefined,
							2
						)}`
					).toBeTruthy()
				}
			}
		})
	}

	test('all events are expected', () => {
		// If any analytics calls are still in `events`, then they were unexpected by the
		// tests configured above. This either means that a test is missing, or there is a
		// bug in this client.
		// Note: every time we see an event for a given test, we remove it from the
		// events list s.t. we can identify if any extraneous calls were made.
		expect(events).toHaveLength(0)
	})
})
