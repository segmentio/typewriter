import { parse } from '../src/ast'
import * as fs from 'fs'

describe('AST', () => {
	// Read the AST fixtures, and execute a test for each one.
	const tests = fs
		.readdirSync('tests/fixtures/ast/schemas')
		.map(f => f.replace(/\.json$/, ''))

	test.each(tests)('parses %s', async filename => {
		expect.assertions(1)

		const { default: ast } = await import(`./fixtures/ast/asts/${filename}.ts`)
		const schema = await import(`./fixtures/ast/schemas/${filename}.json`)

		expect(parse(schema)).toEqual(ast)
	})
})
