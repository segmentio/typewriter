import { Schema, Type } from '../../../../src/generators/ast'

const s: Schema = {
	name: 'Enums Fixture',
	description: 'This fixture validates generation for JSON Schema enums.',
	type: Type.OBJECT,
	properties: [
		{
			name: 'string-enum',
			type: Type.ANY,
			enum: ['boggs', 'rob', 'anastassia', 'evan', 'marc', 'nick'],
		},
		{
			name: 'number-enum',
			type: Type.ANY,
			enum: [8997, 8998, 8999],
		},
		{
			name: 'typed-enum',
			type: Type.STRING,
			enum: ['personas', 'protocols', 'connections', '<redacted>'],
		},
		{
			name: 'typed-union-enum',
			type: Type.UNION,
			types: [
				{
					type: Type.STRING,
					enum: ['yes', 'no', true, false],
				},
				{
					type: Type.BOOLEAN,
					enum: ['yes', 'no', true, false],
				},
			],
			enum: ['yes', 'no', true, false],
		},
	],
}
export default s
