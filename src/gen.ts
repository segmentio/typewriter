import { JSONSchema7 } from 'json-schema'
import javascript from './generators/javascript'
import { parse, Schema } from './ast'
import { Options as JavaScriptOptions } from './generators/javascript'

export enum Language {
	JAVASCRIPT,
	TYPESCRIPT,
}

// Options that all clients must support.
export interface DefaultOptions {
	lang: Language
	// Whether or not to generate a development bundle. If so, analytics payloads will
	// be validated against the full JSON Schema before being sent to the underlying
	// analytics instance.
	isDevelopment: boolean
}

export type Options = JavaScriptOptions

export interface File {
	path: string
	contents: string
}

export interface GenerationConfig {
	tracks: {
		raw: JSONSchema7
		schema: Schema
	}[]
	options: Options
}

export default async function gen(
	rawSchemas: JSONSchema7[],
	options: Options
): Promise<File[]> {
	const config = {
		tracks: rawSchemas.map(s => ({
			raw: s,
			schema: parse(s),
		})),
		options,
	}

	if (
		options.lang === Language.TYPESCRIPT ||
		options.lang === Language.JAVASCRIPT
	) {
		return await javascript(config)
	} else {
		throw new Error('Invalid language')
	}
}
