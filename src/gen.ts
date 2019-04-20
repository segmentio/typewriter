import { JSONSchema7 } from 'json-schema'
import typescript from './generators/typescript'
import { parse } from './ast'

export enum Language {
	TYPESCRIPT,
}

export interface Options {
	lang: Language
}

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
