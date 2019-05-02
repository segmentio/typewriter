import { Schema, Type } from '../../../../src/generators/ast'

const s: Schema = {
	name: 'Nested Fixture',
	description:
		'This fixture validates generation for objects nested within other objects or arrays.',
	type: Type.OBJECT,
	properties: [
		{
			name: 'nested-object',
			type: Type.OBJECT,
			properties: [
				{
					name: 'name',
					type: Type.STRING,
				},
				{
					name: 'address',
					isNullable: true,
					type: Type.ANY,
				},
			],
		},
		{
			name: 'nested-array',
			type: Type.ARRAY,
			items: {
				type: Type.OBJECT,
				properties: [
					{
						name: 'name',
						type: Type.STRING,
					},
					{
						name: 'address',
						isNullable: true,
						type: Type.ANY,
					},
				],
			},
		},
	],
}
export default s
