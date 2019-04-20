import { Schema, Type } from '../../../../src/ast'

const s: Schema = {
	name: 'Union Types Fixture',
	description: 'This fixture validates generation for JSON Schema union types.',
	type: Type.OBJECT,
	properties: [
		{
			name: 'primitive-union',
			type: Type.UNION,
			types: [{ type: Type.STRING }, { type: Type.NUMBER }],
		},
		{
			name: 'primitive-or-object-union',
			type: Type.UNION,
			types: [
				{
					type: Type.STRING,
				},
				{
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
			],
		},
		{
			name: 'array-or-object-union',
			type: Type.UNION,
			types: [
				{
					type: Type.ARRAY,
					items: { type: Type.STRING },
				},
				{
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
			],
		},
	],
}
export default s
