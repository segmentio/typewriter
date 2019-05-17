export interface Options {
	// Words that are reserved by a given language, and which should not be allowed
	// for identifier names.
	reservedWords: string[]
	// String to use for quoted strings. Usually a single or double quote.
	quoteChar: string
	// A character set matching all characters that are allowed as the first character in an identifier.
	allowedIdentifierStartingChars: string
	// A character set matching all characters that are allowed within identifiers.
	allowedIdentifierChars: string
}

export default class Namer {
	private opts: Options

	public constructor(opts: Options) {
		this.opts = opts
	}

	// escapeString escapes quotes within a string so that it can safely generated.
	public escapeString(str: string): string {
		return str.replace(new RegExp(this.opts.quoteChar, 'g'), `\\${this.opts.quoteChar}`)
	}

	// escapeIdentifier replaces all characters that are invalid within a language's identifier.
	// See: https://mathiasbynens.be/notes/javascript-identifiers-es6
	public escapeIdentifier(id: string): string {
		// If id is a reservedWord, mutate it by appending a suffix.
		if (this.opts.reservedWords.includes(id)) {
			id = `${id}_`
		}

		// Replace invalid characters within the identifier.
		const invalidChars = new RegExp(`[^${this.opts.allowedIdentifierChars}]`, 'g')
		id = id.replace(invalidChars, '_')

		// Handle zero length identifiers.
		if (id.length === 0) {
			id = 'EmptyIdentifier'
		}

		// Handle identifiers that start with an invalid character.
		const invalidStartingChars = new RegExp(`^[^${this.opts.allowedIdentifierStartingChars}]`)
		if (invalidStartingChars.test(id)) {
			id = `I${id}`
		}

		return id
	}

	// TODO: offer helpers for naming identifiers and handling naming conflicts.
	// Ideally handle the case when two schemas are identical, and therefore should be merged.
}
