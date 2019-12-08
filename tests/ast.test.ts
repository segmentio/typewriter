import { parse } from '../src/generators/ast'
import * as astFixtures from './fixtures/asts'
import * as fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import { map } from 'lodash'

const readFile = promisify(fs.readFile)

describe('AST', () => {
	const tests = map(astFixtures, (ast, name) => ({ ast, name }))
	for (const t of tests) {
		test(`parses ${t.name}`, async () => {
			expect.assertions(1)

			const schemaJSON = await readFile(resolve(__dirname, `./fixtures/schemas/${t.name}.json`), {
				encoding: 'utf-8',
			})
			const schema = JSON.parse(schemaJSON)

			expect(parse(schema)).toEqual(t.ast)
		})
	}
})
