/**
 * Fetches all analytics calls for a specific test from the sidecar
 * and snapshots them to a specified directory.
 */
import fetch from 'node-fetch'
import { SDK, Language } from '../../src/generators/options'
import { validateSegmentEvent } from './schema'

const SIDECAR_ADDRESS = 'http://localhost:8765'

if (!process.env.SDK || !process.env.LANGUAGE) {
	throw new Error('You must run as: SDK=<sdk> LANGUAGE=<language> jest ./suite.test.ts')
}

const env: SDK = process.env.SDK as SDK
const language: Language = process.env.LANGUAGE as Language

const events: any[] = []

describe(`env:${env}`, () => {
	describe(`language:${language}`, () => {
		// Fetch all analytics calls that were fired after running the client's
		beforeAll(async () => {
			const resp = await fetch(`${SIDECAR_ADDRESS}/messages`)
			events.push(...(await resp.json()))
		})

		test('at least one event was received', () => {
			expect(events.length).toBeGreaterThan(0)
		})

		// Do a sanity check to make sure our client isn't overwriting any fields that
		// are usually set by the SDK itself.
		test('all received events are valid Segment payloads', () => {
			for (let event of events) {
				const error = validateSegmentEvent(event)
				expect(error).toBe(undefined)
			}
		})

		// You can configure an event in a Tracking Plan to not have any explicitely
		// set properties. We treat that case as allowing any properties to be passed
		// through. This test validates that passing no properties to this event produces
		// a `properties: {}` in the output payload.
		test('sends an empty event with no properties', () => {
			// TODO
		})

		// TODO! add the various tests

		afterAll(() => {
			// If any analytics calls are still in `events`, then they were unexpected by the
			// tests configured above. This either means that a test is missing, or there is a
			// bug in this client.
			// Note: every time we see an event for a given test, remove it from the
			// events list s.t. we can identify if any extraneous calls were seen.
			expect(events).toHaveLength(0)
		})
	})
})
