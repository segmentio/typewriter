/* eslint-disable no-null/no-null */
/* eslint-disable @typescript-eslint/camelcase */
import {
	emptyEvent,
	eventWithAllTypes,
	I42TerribleEventName3,
	exampleNamingCollision,
	exampleNamingCollision1,
	violationHandlerTest,
	setTypewriterOptions,
} from './analytics'
import SegmentAnalytics from 'analytics-node'
import fetch from 'node-fetch'
import { promisify } from 'util'

const SIDECAR_ADDRESS = 'http://localhost:8765'

test('Validate Analytics Calls', async cb => {
	// Initialize an analytics-node instance.
	const analytics = new SegmentAnalytics('123456', {
		host: SIDECAR_ADDRESS,
	})
	analytics.flush = promisify(analytics.flush) as any

	const userId = 'user-1234'

	// Verify analytics calls fail before setting an analytics instance.
	expect(() => {
		emptyEvent({
			userId,
		})
	}).toThrow()

	// Initialize Typewriter with an analytics-node instance.
	setTypewriterOptions({
		// TODO: we should look into updating the type definitions for analytics-node.
		analytics: analytics as any,
	})

	// Send an event with no properties.
	emptyEvent({
		userId,
	})

	// Send an event with every combination of property type.
	eventWithAllTypes({
		properties: {
			'required any': 123,
			'required array': [
				{
					'required sub-property': 'Hello World',
				},
			],
			'required array (empty)': [123, 'Hello World'],
			'required boolean': false,
			'required int': 123,
			'required nullable string': null,
			'required number': 3.1415,
			'required number or string': 123,
			'required object': {
				'required sub-property': 'Hello World',
			},
			'required object (empty)': {},
			'required string': 'Hello World',
			'required string regex': 'FOO',
		},
		userId,
	})

	// Test an event with poor naming standards, to validate sanitization.
	I42TerribleEventName3({
		properties: {
			'0000---terrible-property-name~!3': 'foobar',
			propertyNameCollision: 'camelcase',
			property_name_collision: 'snakecase',
		},
		userId,
	})

	exampleNamingCollision({
		userId,
	})
	exampleNamingCollision1({
		userId,
	})

	// TODO: Test the handler for unknown methods.

	// Test the onViolation error handler.
	// By default, it'll throw an error on Violation in NODE_ENV=test.
	expect(() => {
		violationHandlerTest({
			properties: {
				'required string regex': 'an invalid value',
			},
			userId,
		})
	}).toThrow('You made an analytics call (Violation Handler Test)')

	// Verify that a custom onViolation error handler is called on Violation.
	setTypewriterOptions({
		analytics: analytics as any,
		onViolation: (msg, violations) => {
			expect(msg.event).toEqual('Violation Handler Test')
			expect(violations).toHaveLength(1)

			throw new Error('onViolation called')
		},
	})
	expect(() => {
		violationHandlerTest({
			properties: {
				'required string regex': 'an invalid value',
			},
			userId,
		})
	}).toThrow('onViolation called')

	// Verify that onViolation error handler is not called unless there is a Violation.
	violationHandlerTest({
		properties: {
			'required string regex': 'YES',
		},
		userId,
	})

	await analytics.flush()

	const resp = await fetch(`${SIDECAR_ADDRESS}/messages`)
	const messages = await resp.json()

	expect(messages).toMatchSnapshot()

	cb()
})
