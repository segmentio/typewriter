import { JSONSchema7 } from 'json-schema'
import { gen, GenOptions, RawTrackingPlan } from '../src/generators/gen'
import * as trackingPlanFixture from './fixtures/tracking-plan.json'
import * as fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import { SDK, Language, Options } from '../src/generators/options'

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)

interface TrackingPlanFixture {
	name: string
	events: Event[]
}

interface Event {
	name: string
	description: string
	rules: JSONSchema7
}

describe('generators', () => {
	const clients: Options[] = [
		{
			language: Language.JAVASCRIPT,
			sdk: SDK.WEB,
		},
		{
			language: Language.TYPESCRIPT,
			sdk: SDK.WEB,
		},
		{
			language: Language.JAVASCRIPT,
			sdk: SDK.NODE,
		},
		{
			language: Language.TYPESCRIPT,
			sdk: SDK.NODE,
		},
		{
			language: Language.OBJECTIVE_C,
			sdk: SDK.IOS,
		},
	]

	for (var client of clients) {
		for (var isDevelopment of [true, false]) {
			runTest({
				client,
				isDevelopment,
				typewriterVersion: '1.0.0',
			})
		}
	}
})

function runTest(options: GenOptions) {
	const developmentString = options.isDevelopment ? 'development' : 'production'
	test(`${options.client.language} - ${options.client.sdk} - ${developmentString}`, async () => {
		await generateClient(
			`./generated/${options.client.sdk}/${options.client.language}/${developmentString}`,
			options
		)
	})
}

async function generateClient(path: string, options: GenOptions) {
	const fixture = trackingPlanFixture as TrackingPlanFixture
	const trackingPlan: RawTrackingPlan = {
		trackCalls: fixture.events.map(event => ({
			...event.rules,
			title: event.name,
			description: event.description,
		})),
	}

	const files = await gen(trackingPlan, options)

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
