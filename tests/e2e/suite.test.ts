/* eslint-disable @typescript-eslint/camelcase */
import got from 'got'
import { SDK, Language } from '../../src/generators/options'
import { validateSegmentEvent, events, exactArray } from './validation'
import Joi from '@hapi/joi'

const SIDECAR_ADDRESS = 'http://localhost:8765'

if (!process.env.SDK || !process.env.LANGUAGE || !process.env.IS_DEVELOPMENT) {
	throw new Error(
		'You must run as: SDK=<sdk> LANGUAGE=<language> IS_DEVELOPMENT=<true|false> jest ./suite.test.ts'
	)
}

const sdk: SDK = process.env.SDK as SDK
const language: Language = process.env.LANGUAGE as Language
const isDevelopment: boolean = process.env.IS_DEVELOPMENT === 'true'

describe('e2e tests', () => {
	const testCases: {
		// The name of this test case.
		name: string
		// Some clients don't support the full standard test suite, for various reasons.
		// We document those reasons below and skip the associated tests in the suite.
		skip?: boolean
		// The set of events we expect to have been captured by `segmentio/mock`.
		expect:
			| {
					name: string
					properties?: Joi.SchemaMap
			  }
			| {
					name: string
					properties?: Joi.SchemaMap
			  }[]
	}[] = [
		{
			// For clients where a shared analytics instance (window.analytics, sharedAnalytics, etc)
			// is not available, we should throw an error on an attempted analytics call if the user
			// has not yet provided an analytics instance.
			name: 'a missing analytics instance triggers an error',
			// The analytics-node SDK requires you to initialize an analytics instance before making any
			// calls. Therefore, we can't provide a sane default with standard behavior.
			skip: sdk === SDK.NODE,
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
				},
			},
		},
		{
			name: 'sends an event with every supported type (optional)',
			expect: {
				name: 'Every Optional Type',
			},
		},
		{
			name: 'sends an event with every supported type (nullable + required)',
			expect: {
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
				},
			},
		},
		{
			name: 'sends an event with every supported type (nullable + required)',
			expect: {
				name: 'Every Nullable Required Type',
			},
		},
		{
			name: 'sends an event with every supported type (nullable + optional)',
			expect: {
				name: 'Every Nullable Optional Type',
			},
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
			// We have not yet added support for unions to the iOS client.
			skip: language === Language.OBJECTIVE_C,
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
			skip: ![Language.JAVASCRIPT, Language.TYPESCRIPT].includes(language),
			expect: {
				name: 'Unknown Event Handler Called',
			},
		},
		{
			name: '[development] the default violation handler is called upon a violation',
			// In development mode, we run full JSON Schema validation on payloads and
			// surface any JSON Schema violations to a configurable handler.
			// Note: we can't easily detect in our e2e tests when the default violation handler is
			// fired. The one exception is in environments where we can detect that tests are running
			// because the default violation handler will be configured to throw an error and fail
			// the tests. Currently, the only environment that can do this is Node, because there's
			// a standard in the community around setting NODE_ENV=test (or testing) when a test suite
			// is running.
			skip: !isDevelopment || sdk !== SDK.NODE,
			expect: [
				{
					name: 'Default Violation Handler Called',
				},
			],
		},
		{
			name: '[development] when set, a custom violation handler is called upon a violation',
			// We have not yet added support for run-time validation to the iOS client.
			skip: !isDevelopment || sdk === SDK.IOS,
			expect: [
				{
					name: 'Custom Violation Handler Called',
				},
			],
		},
		{
			name: '[production] events with violations are fired anyway in production builds',
			// We have not yet added support for run-time validation to the iOS client.
			skip: isDevelopment || sdk === SDK.IOS,
			expect: [
				{
					name: 'Default Violation Handler',
					properties: {
						'regex property': 'Not a Real Morty',
					},
				},
				{
					name: 'Custom Violation Handler',
					properties: {
						'regex property': 'Not a Real Morty',
					},
				},
			],
		},
		// TODO: can we add tests to validate the behavior of the default violation handler
		// outside of test mode (NODE_ENV!=test)?
		// TODO: add tests with large integers + large numbers
		// TODO: add test of supplying custom context fields
	]

	// Fetch all analytics calls that were fired after running the client's e2e test application.
	beforeAll(async () => {
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
		for (let event of events) {
			const error = validateSegmentEvent(event)
			expect(error).toBe(undefined)
		}
	})

	for (const testCase of testCases) {
		if (!!testCase.skip) {
			continue
		}

		test(testCase.name, () => {
			// TODO!
		})
	}

	afterAll(() => {
		// If any analytics calls are still in `events`, then they were unexpected by the
		// tests configured above. This either means that a test is missing, or there is a
		// bug in this client.
		// Note: every time we see an event for a given test, we remove it from the
		// events list s.t. we can identify if any extraneous calls were made.
		expect(events).toHaveLength(0)
	})
})
