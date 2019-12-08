/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'

import typewriter, {
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
	customViolationHandler,
	customViolationHandlerCalled,
	propertySanitized,
	largeNumbersEvent,
	enumTypes,
	StringConst,
	StringEnum,
} from '../analytics'

export default class HomePage extends React.Component {
	componentDidMount() {
		if (!window.analytics) {
			throw new Error("Seems like window.analytics isn't available")
		}

		this.runTestSuite()
	}

	render() {
		return (
			<h1>
				Typewriter is <em>nifty</em>
			</h1>
		)
	}

	// Run through our standard test suite. See suite.test.ts.
	runTestSuite() {
		emptyEvent()

		everyRequiredType({
			'required any': 'Rick Sanchez',
			'required array': [137, 'C-137'],
			'required boolean': false,
			'required int': 97,
			'required number': 3.14,
			'required object': {},
			'required string': 'Alpha-Betrium',
			'required string with regex': 'Lawyer Morty',
			'required array with properties': [
				{
					'required any': 'Rick Sanchez',
					'required array': [137, 'C-137'],
					'required boolean': false,
					'required int': 97,
					'required number': 3.14,
					'required object': {},
					'required string': 'Alpha-Betrium',
					'required string with regex': 'Lawyer Morty',
				},
			],
			'required object with properties': {
				'required any': 'Rick Sanchez',
				'required array': [137, 'C-137'],
				'required boolean': false,
				'required int': 97,
				'required number': 3.14,
				'required object': {},
				'required string': 'Alpha-Betrium',
				'required string with regex': 'Lawyer Morty',
			},
		})

		everyNullableRequiredType({
			'required any': null,
			'required array': null,
			'required boolean': null,
			'required int': null,
			'required number': null,
			'required object': null,
			'required string': null,
			'required string with regex': null,
			'required array with properties': [
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
			],
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
		})

		everyNullableRequiredType({
			'required any': 'Rick Sanchez',
			'required array': [137, 'C-137'],
			'required boolean': false,
			'required int': 97,
			'required number': 3.14,
			'required object': {},
			'required string': 'Alpha-Betrium',
			'required string with regex': 'Lawyer Morty',
			'required array with properties': [
				{
					'required any': 'Rick Sanchez',
					'required array': [137, 'C-137'],
					'required boolean': false,
					'required int': 97,
					'required number': 3.14,
					'required object': {},
					'required string': 'Alpha-Betrium',
					'required string with regex': 'Lawyer Morty',
				},
			],
			'required object with properties': {
				'required any': 'Rick Sanchez',
				'required array': [137, 'C-137'],
				'required boolean': false,
				'required int': 97,
				'required number': 3.14,
				'required object': {},
				'required string': 'Alpha-Betrium',
				'required string with regex': 'Lawyer Morty',
			},
		})

		everyOptionalType()

		everyOptionalType({
			'optional any': 'Rick Sanchez',
			'optional array': [137, 'C-137'],
			'optional boolean': false,
			'optional int': 97,
			'optional number': 3.14,
			'optional object': {},
			'optional string': 'Alpha-Betrium',
			'optional string with regex': 'Lawyer Morty',
			'optional array with properties': [
				{
					'optional any': 'Rick Sanchez',
					'optional array': [137, 'C-137'],
					'optional boolean': false,
					'optional int': 97,
					'optional number': 3.14,
					'optional object': {},
					'optional string': 'Alpha-Betrium',
					'optional string with regex': 'Lawyer Morty',
				},
			],
			'optional object with properties': {
				'optional any': 'Rick Sanchez',
				'optional array': [137, 'C-137'],
				'optional boolean': false,
				'optional int': 97,
				'optional number': 3.14,
				'optional object': {},
				'optional string': 'Alpha-Betrium',
				'optional string with regex': 'Lawyer Morty',
			},
		})

		everyNullableOptionalType()

		everyNullableOptionalType({
			'optional any': null,
			'optional array': null,
			'optional boolean': null,
			'optional int': null,
			'optional number': null,
			'optional object': null,
			'optional string': null,
			'optional string with regex': null,
			'optional array with properties': [
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
			],
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
		})

		everyNullableOptionalType({
			'optional any': 'Rick Sanchez',
			'optional array': [137, 'C-137'],
			'optional boolean': false,
			'optional int': 97,
			'optional number': 3.14,
			'optional object': {},
			'optional string': 'Alpha-Betrium',
			'optional string with regex': 'Lawyer Morty',
			'optional array with properties': [
				{
					'optional any': 'Rick Sanchez',
					'optional array': [137, 'C-137'],
					'optional boolean': false,
					'optional int': 97,
					'optional number': 3.14,
					'optional object': {},
					'optional string': 'Alpha-Betrium',
					'optional string with regex': 'Lawyer Morty',
				},
			],
			'optional object with properties': {
				'optional any': 'Rick Sanchez',
				'optional array': [137, 'C-137'],
				'optional boolean': false,
				'optional int': 97,
				'optional number': 3.14,
				'optional object': {},
				'optional string': 'Alpha-Betrium',
				'optional string with regex': 'Lawyer Morty',
			},
		})

		I42TerribleEventName3()

		propertySanitized({
			'0000---terrible-property-name~!3': 'what a cronenberg',
		})

		eventCollided()

		eventCollided1()

		propertiesCollided({
			'Property Collided': 'The Citadel',
			property_collided: 'Galactic Prison',
		})

		propertyObjectNameCollision1({
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
		})

		propertyObjectNameCollision2({
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
		})

		simpleArrayTypes({
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
		})

		nestedObjects({
			garage: {
				tunnel: {
					'subterranean lab': {
						"jerry's memories": [],
						"morty's memories": [],
						"summer's contingency plan": 'Oh, man, it’s a scenario four.',
					},
				},
			},
		})

		nestedArrays({
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
		})

		unionType({
			universe_name: 'C-137',
		})
		unionType({
			universe_name: 137,
		})
		unionType({
			universe_name: null,
		})

		// This will trigger the default Violation handler, because the regex will not match.
		// In analytics.js, this just logs instead of throwing.
		defaultViolationHandler({
			'regex property': 'Not a Real Morty',
		})

		// Register a custom onViolation handler.
		setTypewriterOptions({
			onViolation: (msg, violations) => {
				if (msg.event !== 'Custom Violation Handler' || violations.length !== 1) {
					throw new Error('Wrong message supplied to custom onViolation handler')
				}

				customViolationHandlerCalled()
			},
		})

		// This will trigger the Violation handler, iff running in development mode
		// because the regex will not match.
		customViolationHandler({
			'regex property': 'Not a Real Morty',
		})

		largeNumbersEvent({
			'large nullable optional integer': 1230007112658965944,
			'large nullable optional number': 1240007112658965944331.0,
			'large nullable required integer': 1250007112658965944,
			'large nullable required number': 1260007112658965944331.0,
			'large optional integer': 1270007112658965944,
			'large optional number': 1280007112658965944331.0,
			'large required integer': 1290007112658965944,
			'large required number': 1300007112658965944331.0,
		})

		enumTypes({
			'string const': StringConst.RickSanchez,
			'string enum': StringEnum.LawyerMorty,
		})

		// There is no generated function for `aMissingAnalyticsCall`, but the JS Proxy should
		// handle this and avoid a crash.
		typewriter.aMissingAnalyticsCall()
	}
}
