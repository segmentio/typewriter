import { parse } from '../src/generators/ast'
import * as astFixtures from './fixtures/asts'
import * as fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import { map } from 'lodash'

const readFile = promisify(fs.readFile)

describe('AST', () => {
	const foobar = map(astFixtures, (ast, name) => ({ ast, name }))
	test.each(foobar)('parses %s', async ({ ast, name }) => {
		expect.assertions(1)

		const schemaJSON = await readFile(
			resolve(__dirname, `./fixtures/schemas/${name}.json`),
			{
				encoding: 'utf-8',
			}
		)
		const schema = JSON.parse(schemaJSON)

		expect(parse(schema)).toEqual(ast)
	})
})
