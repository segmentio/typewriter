/**
 * Fetches all analytics calls for a specific test from the sidecar
 * and snapshots them to a specified directory.
 */
import fetch from 'node-fetch'
import { SDK, Language } from '../../src/generators/options'
import { coverage, validateSegmentMessage, TestSuiteError } from './types'

const SIDECAR_ADDRESS = 'http://localhost:8765'

const run = async () => {
	// ts-node suite.ts [sdk] [language]
	if (process.argv.length !== 4) {
		throw new Error('You must pass an SDK and language: `$ ts-node snapshots.ts [sdk] [language]`')
	}
	const sdk = process.argv[2] as SDK
	const language = process.argv[3] as Language
	if (!coverage[sdk]) {
		throw new Error(
			`The SDK you passed to suite.ts (${sdk}) is not configured in the coverage map in suite.ts.`
		)
	}
	if (!coverage[sdk][language]) {
		throw new Error(
			`The language you passed to suite.ts (${language}) is not configured in the coverage map in suite.ts.`
		)
	}
	const tests = coverage[sdk][language]!

	const resp = await fetch(`${SIDECAR_ADDRESS}/messages`)
	const messages = (await resp.json()) as any[]
	const errors: TestSuiteError[] = []

	// Do a sanity check to make sure our client isn't overwriting any fields that
	// are usually set by the SDK itself.
	for (let message of messages) {
		const error = validateSegmentMessage(message)
		if (error !== undefined) {
			errors.push({
				description:
					'Payload failed to validate against the expected format for a Segment message payload',
				error: {
					message,
					validationError: error,
				},
			})
		}
	}

	// Run through each test in `Tests` to validate that the client's behavior is correct.
	// Note: every time we see a message for a given test, remove it from the
	// messages list s.t. we can identify if any extraneous calls were seen.
	if (tests['sends an empty event with no properties']) {
		// TODO!
	}

	// If any analytics calls are still in `messages`, then they were unexpected. This
	// either means that a test is missing from `Tests` above and needs to be configured,
	// or there is a bug in this client.
	if (messages.length > 0) {
		errors.push({
			description: 'Extra messages seen in test output',
			error: messages,
		})
	}

	if (errors.length > 0) {
		console.error(JSON.stringify(errors, undefined, 4))
		throw new Error(`Test suite failed for ${sdk} ${language} (see errors above)`)
	}
}

run()
