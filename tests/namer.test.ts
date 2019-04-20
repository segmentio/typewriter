import Namer from '../src/namer'

describe('Namer', () => {
	const namer = new Namer({
		reservedWords: ['do', 'if', 'then', 'for', 'let', 'new'],
		quoteChar: "'",
		allowedIdentifierStartingChars: 'A-Za-z_$',
		allowedIdentifierChars: 'A-Za-z0-9_$',
	})

	describe('escapeString', () => {
		test("doesn't change valid strings", () => {
			expect(namer.escapeString('is it happening?')).toEqual('is it happening?')
		})
		test('handles a single quote to be escaped', () => {
			expect(namer.escapeString("it's happening!!")).toEqual(
				"it\\'s happening!!"
			)
		})
		test('handles escaping multiple quotes', () => {
			expect(namer.escapeString("it's testing time, Finn's dog said")).toEqual(
				"it\\'s testing time, Finn\\'s dog said"
			)
		})
	})

	describe('escapeIdentifier', () => {
		test("doesn't change valid identifiers", () => {
			expect(namer.escapeIdentifier('test123')).toEqual('test123')
			expect(namer.escapeIdentifier('abcABC123_$')).toEqual('abcABC123_$')
		})
		test('replaces special characters', () => {
			expect(namer.escapeIdentifier('~!@#%^&*()_$+')).toEqual('___________$_')
			expect(namer.escapeIdentifier('testing with whitespace')).toEqual(
				'testing_with_whitespace'
			)
		})
		test('handles reserved words', () => {
			expect(namer.escapeIdentifier('if')).toEqual('if_')
			expect(namer.escapeIdentifier('ifthen')).toEqual('ifthen')
		})
	})
})
