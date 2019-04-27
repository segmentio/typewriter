import { JSONSchema7 } from 'json-schema'
import typescript from './generators/typescript'
import { parse } from './ast'
import { Options as TypeScriptOptions } from './generators/typescript'

export enum Language {
	TYPESCRIPT,
}

// Options that all clients must support.
export interface DefaultOptions {
	// Whether or not to generate a development bundle. If so, analytics payloads will
	// be validated against the full JSON Schema before being sent to the underlying
	// analytics instance.
	isDevelopment: boolean
}

export type Options = TypeScriptOptions

export interface File {
	path: string
	contents: string
}

export default async function gen(
	rawSchemas: JSONSchema7[],
	opts: Options
): Promise<File[]> {
	const asts = rawSchemas.map(s => parse(s))

	if (opts.lang === Language.TYPESCRIPT) {
		return await typescript(asts, opts)
	} else {
		throw new Error('Invalid language')
	}
}
