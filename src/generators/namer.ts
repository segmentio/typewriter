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
	// Maps (namespace, raw name) => sanitized name
	private sanitizedNameLookup: Record<string, Record<string, string>>
	// Maps (namespace, sanitized name) => raw name
	private rawNameLookup: Record<string, Record<string, string>>

	public constructor(opts: Options) {
		this.opts = opts
		this.sanitizedNameLookup = {}
		this.rawNameLookup = {}
	}

	/**
	 * register registers a name within a given namespace. The sanitized, collision-free name is returned.
	 *
	 * An optional transform function can be supplied, which'll be applied during the sanitization process.
	 */
	public register(name: string, namespace: string, transform?: (name: string) => string): string {
		// We don't currently support duplicate raw names within a given namespace.
		// This is likely a bug in a customer's Tracking Plan (duplicate property names, duplicate event names).
		if (this.sanitizedNameLookup[namespace] && this.sanitizedNameLookup[namespace][name]) {
			throw new Error(`Duplicate name '${name}' within namespace '${namespace}'`)
		}

		const sanitizedName = this.sanitize(name, namespace, transform)

		if (!this.sanitizedNameLookup[namespace]) {
			this.sanitizedNameLookup[namespace] = {}
		}
		this.sanitizedNameLookup[namespace][name] = sanitizedName

		if (!this.rawNameLookup[namespace]) {
			this.rawNameLookup[namespace] = {}
		}
		this.rawNameLookup[namespace][sanitizedName] = name

		return this.getName(name, namespace)
	}

	/**
	 * getName returns a sanitized, collision-free name for the given (namespace, name) tuple.
	 *
	 * All returned names will be unique within their namespace, for all currently-registered names.
	 * Example namespaces might be: "function", "interface", "property:<random integer>", etc.
	 */
	public getName(name: string, namespace: string): string {
		if (!this.sanitizedNameLookup[namespace]) {
			throw new Error(`Unknown namespace: '${namespace}'`)
		}

		if (!this.sanitizedNameLookup[namespace][name]) {
			throw new Error(`Unknown name: '${name}' (from namespace='${namespace}')`)
		}

		return this.sanitizedNameLookup[namespace][name]
	}

	/**
	 * escapeString escapes quotes within a string so that it can safely generated.
	 */
	public escapeString(str: string): string {
		return str.replace(new RegExp(this.opts.quoteChar, 'g'), `\\${this.opts.quoteChar}`)
	}

	private sanitize(name: string, namespace: string, transform?: (name: string) => string): string {
		if (transform) {
			name = transform(name)
		}

		// Handle names that are reserved words.
		if (this.opts.reservedWords.includes(name)) {
			name += '_'
		}

		// Replace invalid characters within the name.
		const invalidChars = new RegExp(`[^${this.opts.allowedIdentifierChars}]`, 'g')
		name = name.replace(invalidChars, '_')

		// Handle zero length names.
		if (name.length === 0) {
			name = 'EmptyIdentifier'
		}

		// Handle names that start with an invalid character.
		const invalidStartingChars = new RegExp(`^[^${this.opts.allowedIdentifierStartingChars}]`)
		if (invalidStartingChars.test(name)) {
			name = `I${name}`
		}

		// Handle naming collisions.
		let suffix = ''
		while (this.rawNameLookup[namespace] && this.rawNameLookup[namespace][name + suffix]) {
			suffix = suffix === '' ? '1' : (parseInt(suffix) + 1).toString()
		}

		return name + suffix
	}
}
