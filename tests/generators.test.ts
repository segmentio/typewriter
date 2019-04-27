import { JSONSchema7 } from 'json-schema'
import gen, { Options } from '../src/gen'
import { Environment } from '../src/generators/javascript'
import { Language } from '../src/gen'
import * as trackingPlan from './fixtures/generators/tracking-plan.json'
import * as fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)

interface TrackingPlan {
	name: string
	events: Event[]
}

interface Event {
	name: string
	description: string
	rules: JSONSchema7
}

describe('generators', () => {
	describe('TypeScript', () => {
		test('Browser', async () => {
			await generateClient('./generated/typescript/browser', {
				lang: Language.TYPESCRIPT,
				isDevelopment: true,
				env: Environment.BROWSER,
			})
		})

		test('Node', async () => {
			await generateClient('./generated/typescript/node', {
				lang: Language.TYPESCRIPT,
				isDevelopment: true,
				env: Environment.NODE,
			})
		})
	})

	describe('JavaScript', () => {
		test('Browser', async () => {
			await generateClient('./generated/javascript/browser', {
				lang: Language.JAVASCRIPT,
				isDevelopment: true,
				env: Environment.BROWSER,
			})
		})

		test('Node', async () => {
			await generateClient('./generated/javascript/node', {
				lang: Language.JAVASCRIPT,
				isDevelopment: true,
				env: Environment.NODE,
			})
		})
	})
})

async function generateClient(outputPath: string, opts: Options) {
	const plan = trackingPlan as TrackingPlan
	const jsonSchemas: JSONSchema7[] = plan.events.map(event => ({
		...event.rules,
		title: event.name,
		description: event.description,
	}))

	const files = await gen(jsonSchemas, opts)

	const dirPath = resolve(__dirname, outputPath)
	if (!(await exists(dirPath))) {
		await mkdir(dirPath, {
			recursive: true,
		})
	}

	for (var file of files) {
		await writeFile(`${dirPath}/${file.path}`, file.contents, {
			encoding: 'utf-8',
		})
	}
}
