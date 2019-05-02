import * as fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import TOML from '@iarna/toml'
import { generateFromTemplate } from '../templates'
import Ajv from 'ajv'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)

// A config, stored in a typewriter.toml file.
// Note: `typewriter.toml.schema.json` must match with this interface.
export interface Config {
	path: string
	tokenCommand?: string
	language: Language
	trackingPlans: TrackingPlan[]
}

export interface Language {
	name: string
	// TODO: language-specific options
}

export interface TrackingPlan {
	id: string
	workspaceSlug: string
	events?: {
		// Note: when we support Event Versioning in the Config API,
		// then we will support numeric values here, which will map to versions.
		[key: string]: 'latest'
	}
}

// Want to learn TOML? See: https://learnxinyminutes.com/docs/toml/
const TYPEWRITER_CONFIG_NAME = 'typewriter.toml'

async function getPath(path: string): Promise<string> {
	// TODO: recursively move back folders until you find it, ala package.json
	return resolve(path, TYPEWRITER_CONFIG_NAME)
}

// get looks for, and reads, a typewriter.toml configuration file.
// If it does not exist, it will return undefined. If the configuration
// if invalid, an Error will be thrown.
// Note: path is relative to the directory where the typewriter command
// was run.
export async function get(path = './'): Promise<Config | undefined> {
	// Check if typewriter.toml exists
	const configPath = await getPath(path)
	if (!(await exists(configPath))) {
		return undefined
	}

	const file = await readFile(configPath, {
		encoding: 'utf-8',
	})
	const rawConfig = TOML.parse(file)

	// Validate the provided configuration file using JSON Schema.
	const schema = JSON.parse(
		await readFile(resolve(__dirname, './typewriter.toml.schema.json'), {
			encoding: 'utf-8',
		})
	)
	const ajv = new Ajv({ schemaId: 'auto', allErrors: true, verbose: true })
	if (!ajv.validate(schema, rawConfig) && ajv.errors) {
		let error = 'Invalid `typewriter.toml`:\n'
		for (var ajvError of ajv.errors) {
			// Remove the "." prefix from the data path.
			const dataPath = ajvError.dataPath.replace(/^\./, '')
			error += `	- ${dataPath.length > 0 ? `${dataPath}: ` : ''}${
				ajvError.message
			}\n`
		}

		// TODO: think of a better way to throw an error, such that we can render it better
		// than the way yargs handles uncaught errors. Catch and render?
		throw new Error(error)
	}

	const rawConfigWithDefaults = {
		...(rawConfig as object),
		path: await getPath((rawConfig.path as string) || './typewriter'),
	}

	// We can safely type cast the config, now that is has been validated.
	return rawConfigWithDefaults as Config
}

// set writes a config out to a typewriter.toml file.
// Note path is relative to the directory where the typewriter command
// was run.
export async function set(config: Config, path = './') {
	const file = await generateFromTemplate<Config>(
		'cli/typewriter.toml.hbs',
		config
	)

	await writeFile(await getPath(path), file)
}

export default {
	get,
	set,
}
