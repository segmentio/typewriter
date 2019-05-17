import { JSONSchema7 } from 'json-schema'
import gen, { Options } from '../src/generators/gen'
import { Environment } from '../src/generators/javascript'
import { Language } from '../src/generators'
import * as trackingPlan from './fixtures/tracking-plan.json'
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
	// TODO: clean up these tests.
	describe('typescript', () => {
		for (var isDevelopment of [true, false]) {
			for (var env of [Environment.NODE, Environment.BROWSER]) {
				;((isDevelopment: boolean, env: Environment) => {
					const developmentString = isDevelopment ? 'development' : 'production'
					test(`${env} - ${developmentString}`, async () => {
						const options: Options = {
							name: Language.TYPESCRIPT,
							isDevelopment,
							env,
						}
						await generateClient(`./generated/typescript/${env}/${developmentString}`, options)
					})
				})(isDevelopment, env)
			}
		}
	})

	describe('javascript', () => {
		for (var isDevelopment of [true, false]) {
			for (var env of [Environment.BROWSER, Environment.NODE]) {
				;((isDevelopment: boolean, env: Environment) => {
					const developmentString = isDevelopment ? 'development' : 'production'
					test(`${env} - ${developmentString}`, async () => {
						const options: Options = {
							name: Language.JAVASCRIPT,
							isDevelopment,
							env,
						}
						await generateClient(`./generated/javascript/${env}/${developmentString}`, options)
					})
				})(isDevelopment, env)
			}
		}
	})
})

async function generateClient(path: string, opts: Options) {
	const plan = trackingPlan as TrackingPlan
	const jsonSchemas: JSONSchema7[] = plan.events.map(event => ({
		...event.rules,
		title: event.name,
		description: event.description,
	}))

	const files = await gen(jsonSchemas, opts)

	const dirPath = resolve(__dirname, path)
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
