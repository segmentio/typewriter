import * as fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import TOML from '@iarna/toml'
import { generateFromTemplate } from '../templates'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)

// A config, stored in a typewriter.toml file.
export interface Config {
	languages: Language[]
	trackingPlans: TrackingPlan[]
	tokenCommand?: string
}

export interface Language {
	name: string
	path: string
	// TODO: language-specific options
}

export interface TrackingPlan {
	id: string
	events: {
		// Note: when we support Event Versioning in the Config API,
		// this will support numeric values which'll map to versions.
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
// If it is invalid or does not exist, it will return undefined.
// Note path is relative to the directory where the typewriter command
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
	console.log(rawConfig)

	const config: Config = {
		languages: [],
		trackingPlans: [],
	}

	// TODO!

	return config
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
