import Namer from '../../namer'

// See: https://mathiasbynens.be/notes/reserved-keywords#ecmascript-6
// prettier-ignore
const reservedWords = [
	'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'enum', 'eval', 'null', 'this',
	'true', 'void', 'with', 'await', 'break', 'catch', 'class', 'const', 'false', 'super', 'throw',
	'while', 'yield', 'delete', 'export', 'import', 'public', 'return', 'static', 'switch', 'typeof',
	'default', 'extends', 'finally', 'package', 'private', 'continue', 'debugger', 'function', 'arguments',
	'interface', 'protected', 'implements', 'instanceof',
]

const namer = new Namer({
	reservedWords,
	quoteChar: "'",
	// Note: we don't support the full range of allowed JS chars, instead focusing on a subset.
	// The full regex 11k+ chars: https://mathiasbynens.be/demo/javascript-identifier-regex
	// See: https://mathiasbynens.be/notes/javascript-identifiers-es6
	allowedIdentifierStartingChars: 'A-Za-z_$',
	allowedIdentifierChars: 'A-Za-z0-9_$',
})

export default namer
