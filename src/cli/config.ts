import * as fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import * as yaml from 'js-yaml'
import { generateFromTemplate } from '../templates'
import * as Ajv from 'ajv'
import { JavaScriptOptions, TypeScriptOptions } from '../generators/javascript'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)

// A config, stored in a typewriter.yml file.
// If you update this inferface, make sure to keep `typewriter.yml.schema.json` in sync.
export interface Config {
	tokenCommand?: string
	language: JavaScriptOptions | TypeScriptOptions
	trackingPlans: TrackingPlan[]
}

export interface TrackingPlan {
	name?: string
	id: string
	workspaceSlug: string
	path: string
	events?: {
		// Note: when we support Event Versioning in the Config API,
		// then we will support numeric values here, which will map to versions.
		[key: string]: 'latest'
	}
}

// Want to learn TOML? See: https://learnxinyminutes.com/docs/toml/
const TYPEWRITER_CONFIG_NAME = 'typewriter.yml'

async function getPath(path: string): Promise<string> {
	path = path.replace(/typewriter\.yml$/, '')
	// TODO: recursively move back folders until you find it, ala package.json
	return resolve(path, TYPEWRITER_CONFIG_NAME)
}

// getConfig looks for, and reads, a typewriter.yml configuration file.
// If it does not exist, it will return undefined. If the configuration
// if invalid, an Error will be thrown.
// Note: path is relative to the directory where the typewriter command
// was run.
export async function getConfig(path = './'): Promise<Config | undefined> {
	// Check if typewriter.yml exists
	const configPath = await getPath(path)
	if (!(await exists(configPath))) {
		return undefined
	}

	const file = await readFile(configPath, {
		encoding: 'utf-8',
	})
	const rawConfig = yaml.safeLoad(file)

	// Validate the provided configuration file using JSON Schema.
	const schema = JSON.parse(
		await readFile(resolve(__dirname, './typewriter.yml.schema.json'), {
			encoding: 'utf-8',
		})
	)
	const ajv = new Ajv({ schemaId: 'auto', allErrors: true, verbose: true })
	if (!ajv.validate(schema, rawConfig) && ajv.errors) {
		let error = 'Invalid `typewriter.yml`:\n'
		for (var ajvError of ajv.errors) {
			// Remove the "." prefix from the data path.
			const dataPath = ajvError.dataPath.replace(/^\./, '')
			error += `	- ${dataPath.length > 0 ? `${dataPath}: ` : ''}${ajvError.message}\n`
		}

		// TODO: think of a better way to throw an error, such that we can render it better
		// than the way yargs handles uncaught errors. Catch and render?
		throw new Error(error)
	}

	// We can safely type cast the config, now that is has been validated.
	return rawConfig as Config
}

// setConfig writes a config out to a typewriter.yml file.
// Note path is relative to the directory where the typewriter command
// was run.
export async function setConfig(config: Config, path = './') {
	const file = await generateFromTemplate<Config>('cli/typewriter.yml.hbs', config)

	await writeFile(await getPath(path), file)
}
