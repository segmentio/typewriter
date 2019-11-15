/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
const {
	analyticsInstanceMissing,
	setTypewriterOptions,
	emptyEvent,
	everyRequiredType,
	everyOptionalType,
	everyNullableRequiredType,
	everyNullableOptionalType,
	I42TerribleEventName3,
	eventCollided,
	eventCollided1,
	nestedObjects,
	nestedArrays,
	defaultViolationHandler,
	propertiesCollided,
	propertyObjectNameCollision1,
	propertyObjectNameCollision2,
	simpleArrayTypes,
	unionType,
	defaultViolationHandlerCalled,
	customViolationHandler,
	customViolationHandlerCalled,
	analyticsInstanceMissingThrewError,
	propertySanitized,
	largeNumbersEvent,
} = require('./analytics')
const typewriter = require('./analytics').default
const SegmentAnalytics = require('analytics-node')
const { promisify } = require('util')

const SIDECAR_ADDRESS = 'http://localhost:8765'

async function run() {
	// Initialize an analytics-node instance.
	const analytics = new SegmentAnalytics('123456', {
		host: SIDECAR_ADDRESS,
	})
	analytics.flush = promisify(analytics.flush)

	const userId = 'user-1234'

	// Verify analytics calls fail before setting an analytics instance.
	try {
		analyticsInstanceMissing({
			userId,
		})
	} catch (error) {
		// Verify that this throws the correct error:
		if (
			!(error instanceof Error) ||
			!error.message.startsWith('You must set an analytics-node instance')
		) {
			console.log(error.message)
			throw error
		}
	}

	// Initialize Typewriter with an analytics-node instance.
	setTypewriterOptions({
		analytics,
	})

	// Mark that the analyticsInstanceMissing test passed.
	analyticsInstanceMissingThrewError({
		userId,
	})

	emptyEvent({
		userId,
	})

	everyRequiredType({
		properties: {
			'required any': 'Rick Sanchez',
			'required array': [137, 'C-137'],
			'required boolean': false,
			'required int': 97,
			'required number': 3.14,
			'required object': {},
			'required string': 'Alpha-Betrium',
			'required string with regex': 'Lawyer Morty',
		},
		userId,
	})

	everyNullableRequiredType({
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
		userId,
	})

	everyNullableOptionalType({
		userId,
	})

	everyOptionalType({
		userId,
	})

	I42TerribleEventName3({
		userId,
	})

	propertySanitized({
		properties: {
			'0000---terrible-property-name~!3': 'what a cronenberg',
		},
		userId,
	})

	eventCollided({
		userId,
	})

	eventCollided1({
		userId,
	})

	propertiesCollided({
		properties: {
			'Property Collided': 'The Citadel',
			property_collided: 'Galactic Prison',
		},
		userId,
	})

	propertyObjectNameCollision1({
		properties: {
			universe: {
				name: 'Froopyland',
				occupants: [
					{
						name: 'Beth Smith',
					},
					{
						name: 'Thomas Lipkip',
					},
				],
			},
		},
		userId,
	})

	propertyObjectNameCollision2({
		properties: {
			universe: {
				name: 'Froopyland',
				occupants: [
					{
						name: 'Beth Smith',
					},
					{
						name: 'Thomas Lipkip',
					},
				],
			},
		},
		userId,
	})

	simpleArrayTypes({
		properties: {
			any: [137, 'C-137'],
			boolean: [true, false],
			integer: [97],
			number: [3.14],
			object: [
				{
					name: 'Beth Smith',
				},
			],
			string: ['Alpha-Betrium'],
		},
		userId,
	})

	nestedObjects({
		properties: {
			garage: {
				tunnel: {
					'subterranean lab': {
						"jerry's memories": [],
						"morty's memories": [],
						"summer's contingency plan": 'Oh, man, it’s a scenario four.',
					},
				},
			},
		},
		userId,
	})

	nestedArrays({
		properties: {
			universeCharacters: [
				[
					{
						name: 'Morty Smith',
					},
					{
						name: 'Rick Sanchez',
					},
				],
				[
					{
						name: 'Cronenberg Morty',
					},
					{
						name: 'Cronenberg Rick',
					},
				],
			],
		},
		userId,
	})

	unionType({
		properties: {
			universe_name: 'C-137',
		},
		userId,
	})
	unionType({
		properties: {
			universe_name: 137,
		},
		userId,
	})
	unionType({
		properties: {
			universe_name: null,
		},
		userId,
	})

	try {
		// This will trigger the Violation handler, iff running in development mode
		// because the regex will not match.
		defaultViolationHandler({
			properties: {
				'regex property': 'Not a Real Morty',
			},
			userId,
		})
	} catch (error) {
		// Validate that the default handler was called.
		if (
			!(error instanceof Error) ||
			error.toString().startsWith('You made an analytics call (Violation Handler Test)')
		) {
			throw error
		}

		defaultViolationHandlerCalled({
			userId,
		})
	}

	// Register a custom onViolation handler.
	setTypewriterOptions({
		analytics,
		onViolation: (msg, violations) => {
			if (msg.event !== 'Custom Violation Handler' || violations.length !== 1) {
				throw new Error('Wrong message supplied to custom onViolation handler')
			}

			customViolationHandlerCalled({
				userId,
			})
		},
	})

	// This will trigger the Violation handler, iff running in development mode
	// because the regex will not match.
	customViolationHandler({
		properties: {
			'regex property': 'Not a Real Morty',
		},
		userId,
	})

	// There is no generated function for `aMissingAnalyticsCall`, but the JS Proxy should
	// handle this and avoid a crash.
	typewriter.aMissingAnalyticsCall({
		userId,
	})

	largeNumbersEvent({
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
		userId,
	})

	await analytics.flush()
}

process.on('unhandledRejection', err => {
	throw err
})

run()
