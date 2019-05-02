import { Schema, Type } from '../../../../src/generators/ast'

const s: Schema = {
	name: 'Types Fixture',
	description:
		'This fixture validates generation for the various JSON Schema types.',
	type: Type.OBJECT,
	properties: [
		{
			name: 'string',
			type: Type.STRING,
		},
		{
			name: 'integer',
			type: Type.INTEGER,
		},
		{
			name: 'number',
			type: Type.NUMBER,
		},
		{
			name: 'boolean',
			type: Type.BOOLEAN,
		},
		{
			name: 'any',
			type: Type.ANY,
			isNullable: true,
		},
		{
			name: 'array',
			type: Type.ARRAY,
			items: {
				type: Type.ANY,
			},
		},
		{
			name: 'object',
			type: Type.OBJECT,
			properties: [],
		},
		{
			name: 'null',
			type: Type.ANY,
			isNullable: true,
			enum: [null],
		},
	],
}
export default s
