export type Options = {
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

export type SanitizeOptions = {
	// A transformation that is applied before collision detection, but after registering
	// a name to the internal registry. It's recommended to apply a transform here, rather
	// than before calling register() since transformations are oftentimes lossy (camelcase,
	// f.e.) -- in other words, it can lead to collisions after transformation that don't exist
	// before.
	transform?: (name: string) => string
	// A set of strings that can be used as prefixes to avoid a collision, before
	// falling back on simple numeric transforms.
	prefixes?: string[]
	// An opaque identifier representing whatever this name represents. If the same
	// name + id combination has been seen before, then the same sanitized name will
	// be returned. This might be used, for example, to re-use interfaces if the JSON
	// Schema matches. If not specified, the same
	id?: string
}

export class Namer {
	private options: Options
	// Maps namespace -> Set of sanitized names
	private lookupByName: Record<string, Set<string>>
	// Maps (namespace, name, id) -> sanitized name
	private lookupByID: Record<string, Record<string, Record<string, string>>>

	public constructor(options: Options) {
		this.options = options
		this.lookupByID = {}
		this.lookupByName = {}

		// Add the various analytics calls as reserved words.
		this.options.reservedWords.push(
			// v1
			'track',
			'identify',
			'group',
			'page',
			'screen',
			'alias',
			// v2
			'set'
		)
	}

	/**
	 * register registers a name within a given namespace. The sanitized, collision-free name is returned.
	 *
	 * An optional transform function can be supplied, which'll be applied during the sanitization process.
	 */
	public register(name: string, namespace: string, options?: SanitizeOptions): string {
		// If an id was provided, check if we have a cached sanitized name for this id.
		if (options && options.id) {
			if (
				this.lookupByID[namespace] &&
				this.lookupByID[namespace][name] &&
				this.lookupByID[namespace][name][options.id]
			) {
				return this.lookupByID[namespace][name][options.id]
			}
		}

		if (!this.lookupByName[namespace]) {
			this.lookupByName[namespace] = new Set()
		}

		// Otherwise, we need to generate a new sanitized name.
		const sanitizedName = this.uniqueify(name, namespace, options)

		// Reserve this newly generated name so that future calls will not re-reserve this name.
		this.lookupByName[namespace].add(sanitizedName)
		// Cache this newly generated name by the id.
		if (options && options.id) {
			if (!this.lookupByID[namespace]) {
				this.lookupByID[namespace] = {}
			}
			if (!this.lookupByID[namespace][name]) {
				this.lookupByID[namespace][name] = {}
			}
			this.lookupByID[namespace][name][options.id] = sanitizedName
		}

		return sanitizedName
	}

	/**
	 * escapeString escapes quotes (and escapes) within a string so that it can safely generated.
	 */
	public escapeString(str: string): string {
		return str
			.replace(/\\/g, '\\\\')
			.replace(new RegExp(this.options.quoteChar, 'g'), `\\` + this.options.quoteChar)
	}

	private uniqueify(name: string, namespace: string, options?: SanitizeOptions): string {
		// Find a unique name by using a prefix/suffix if necessary.
		let prefix = ''
		let suffix = ''
		while (this.lookupByName[namespace].has(this.sanitize(prefix + name + suffix, options))) {
			if (options && options.prefixes && options.prefixes.length > 0) {
				// If the user provided prefixes, first try to find a unique sanitized name with those prefixes.
				prefix = options.prefixes.shift()! + '_'
				suffix = ''
			} else {
				// Fallback on a numeric suffix.
				prefix = ''
				suffix = suffix === '' ? '1' : (parseInt(suffix) + 1).toString()
			}
		}

		return this.sanitize(prefix + name + suffix, options)
	}

	private sanitize(name: string, options?: SanitizeOptions): string {
		// Handle zero length names.
		if (name.length === 0) {
			name = 'EmptyIdentifier'
		}

		// Apply the optional user-supplied transform.
		if (options && options.transform) {
			name = options.transform(name)
		}

		// Handle names that are reserved words.
		if (this.options.reservedWords.includes(name)) {
			name += '_'
		}

		// Replace invalid characters within the name.
		const invalidChars = new RegExp(`[^${this.options.allowedIdentifierChars}]`, 'g')
		name = name.replace(invalidChars, '_')

		// Handle names that start with an invalid character.
		const invalidStartingChars = new RegExp(`^[^${this.options.allowedIdentifierStartingChars}]`)
		if (invalidStartingChars.test(name)) {
			name = `I${name}`
		}

		return name
	}
}
