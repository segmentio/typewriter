import { Schema, Type } from '../../../../src/ast'

const s: Schema = {
	name: 'Null Fixture',
	description: 'This fixture validates generation for nulls in JSON Schema.',
	type: Type.OBJECT,
	properties: [
		{
			name: 'null-type',
			type: Type.ANY,
			isNullable: true,
			enum: [null],
		},
		{
			name: 'nullable-string',
			type: Type.STRING,
			isNullable: true,
		},
		{
			name: 'null-union',
			type: Type.UNION,
			types: [{ type: Type.STRING }, { type: Type.BOOLEAN }],
			isNullable: true,
		},
		{
			name: 'simple-null-enum',
			type: Type.ANY,
			isNullable: true,
			enum: [null],
		},
		{
			name: 'multi-value-null-enum',
			type: Type.ANY,
			isNullable: true,
			enum: [true, false, null],
		},
		{
			name: 'nullable-string-enum',
			type: Type.STRING,
			isNullable: true,
			enum: ['yes', 'no', null],
		},
		{
			name: 'null-enum-union',
			type: Type.UNION,
			types: [
				{ type: Type.STRING, enum: [true, false, 'yes', 'no', null] },
				{ type: Type.BOOLEAN, enum: [true, false, 'yes', 'no', null] },
			],
			isNullable: true,
			enum: [true, false, 'yes', 'no', null],
		},
	],
}
export default s
