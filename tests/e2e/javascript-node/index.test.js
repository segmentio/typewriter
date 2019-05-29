/* eslint-disable no-null/no-null */
import { emptyEvent, eventWithAllTypes, setTypewriterOptions } from './analytics'
import SegmentAnalytics from 'analytics-node'

const SIDECAR_ADDRESS = 'http://localhost:8765'

test('Validate Analytics Calls', () => {
	// Initialize an analytics-node instance.
	const analytics = new SegmentAnalytics('123456', {
		host: SIDECAR_ADDRESS,
	})

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
})
