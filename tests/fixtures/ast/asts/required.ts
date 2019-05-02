import { Schema, Type } from '../../../../src/generators/ast'

const s: Schema = {
	name: 'Required Properties Fixture',
	description:
		'This fixture validates generation for JSON Schema properties that are marked as required.',
	type: Type.OBJECT,
	properties: [
		{
			name: 'required-property',
			isRequired: true,
			isNullable: true,
			type: Type.ANY,
		},
		{
			name: 'optional-property',
			isNullable: true,
			type: Type.ANY,
		},
		{
			name: 'required-nested-property',
			isRequired: true,
			type: Type.OBJECT,
			properties: [
				{
					name: 'required-property',
					isRequired: true,
					isNullable: true,
					type: Type.ANY,
				},
				{
					name: 'optional-property',
					isNullable: true,
					type: Type.ANY,
				},
			],
		},
		{
			name: 'optional-nested-property',
			type: Type.OBJECT,
			properties: [
				{
					name: 'required-property',
					isRequired: true,
					isNullable: true,
					type: Type.ANY,
				},
				{
					name: 'optional-property',
					isNullable: true,
					type: Type.ANY,
				},
			],
		},
	],
}
export default s
