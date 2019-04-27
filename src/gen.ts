import { JSONSchema7 } from 'json-schema'
import javascript from './generators/javascript'
import { parse } from './ast'
import { Options as JavaScriptOptions } from './generators/javascript'

export enum Language {
	JAVASCRIPT,
	TYPESCRIPT,
}

// Options that all clients must support.
export interface DefaultOptions {
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

export default async function gen(
	rawSchemas: JSONSchema7[],
	opts: Options
): Promise<File[]> {
	const asts = rawSchemas.map(s => parse(s))

	if (opts.lang === Language.TYPESCRIPT || opts.lang === Language.JAVASCRIPT) {
		return await javascript(asts, opts)
	} else {
		throw new Error('Invalid language')
	}
}
