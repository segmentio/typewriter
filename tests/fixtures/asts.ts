import { Schema, Type } from '../../src/generators/ast'

export const basicTypes: Schema = {
	name: 'Types Fixture',
	description: 'This fixture validates generation for the various JSON Schema types.',
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

export const enums: Schema = {
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
			name: 'typed-enum',
			type: Type.STRING,
			enum: ['personas', 'protocols', 'connections', '<redacted>'],
		},
	],
}

export const nested: Schema = {
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

export const nulls: Schema = {
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
			name: 'nullable-any-enum',
			type: Type.ANY,
			isNullable: true,
			enum: ['yes', 'no', null],
		},
		{
			name: 'nullable-string-enum',
			type: Type.STRING,
			isNullable: true,
			enum: ['yes', 'no', null],
		},
	],
}

export const required: Schema = {
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

export const unions: Schema = {
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
