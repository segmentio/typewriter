/* eslint-disable no-null/no-null */
import { emptyEvent, eventWithAllTypes, setTypewriterOptions } from './analytics'
import SegmentAnalytics from 'analytics-node'
import fetch from 'node-fetch'
import { promisify } from 'util'

const SIDECAR_ADDRESS = 'http://localhost:8765'

test('Validate Analytics Calls', async cb => {
	// Initialize an analytics-node instance.
	const analytics = new SegmentAnalytics('123456', {
		host: SIDECAR_ADDRESS,
	})
	analytics.flush = promisify(analytics.flush)

	setTypewriterOptions({
		analytics,
	})

	emptyEvent({
		userId: '1234',
	})

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
		userId: '1234',
	})

	await analytics.flush()

	const resp = await fetch(`${SIDECAR_ADDRESS}/messages`)
	const messages = await resp.json()
	console.log(messages)

	expect(messages).toMatchSnapshot()

	cb()
})
