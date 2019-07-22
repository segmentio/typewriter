import * as fs from 'fs'
import { promisify } from 'util'
import { resolve, dirname } from 'path'
import * as yaml from 'js-yaml'
import { generateFromTemplate } from '../templates'
import Ajv from 'ajv'
import { Arguments, Config } from './types'
import * as childProcess from 'child_process'
import { homedir } from 'os'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)
const mkdir = promisify(fs.mkdir)
const exec = promisify(childProcess.exec)

export const CONFIG_NAME = 'typewriter.yml'

async function getPath(path: string): Promise<string> {
	path = path.replace(/typewriter\.yml$/, '')
	// TODO: recursively move back folders until you find it, ala package.json
	return resolve(path, CONFIG_NAME)
}

export function assertConfig(cfg: Config | undefined) {
	if (cfg) {
		return cfg
	}

	throw new Error('Unable to find typewriter.yml. Try `typewriter init`')
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
	const file = await generateFromTemplate<Config>('cli/typewriter.yml.hbs', config, false)

	await writeFile(await getPath(path), file)
}

// resolveRelativePath resolves a relative path from the directory of the `typewriter.yml` config
// file, creating any parent directories, if necessary. It supports file and directory paths.
export async function resolveRelativePath(
	args: Arguments,
	type: 'directory' | 'file',
	path: string,
	...otherPaths: string[]
): Promise<string> {
	// Resolve the path based on the optional --config flag.
	const fullPath = args.config
		? resolve(args.config.replace(/typewriter\.yml$/, ''), path, ...otherPaths)
		: resolve(path, ...otherPaths)
	// If this is a file, we need to verify it's parent directory exists.
	// If it is a directory, then we need to verify the directory itself exists.
	const dirPath = type === 'directory' ? fullPath : dirname(fullPath)

	// Generate the output directory, if it doesn't exist.
	if (!(await exists(dirPath))) {
		await mkdir(dirPath, {
			recursive: true,
		})
	}

	return fullPath
}

export async function assertHasToken(cfg: Partial<Config> | undefined): Promise<string> {
	const token = await getToken(cfg)
	if (token) {
		return token
	}

	throw new Error(`Unable to find an API token.`)
}

// getToken uses a Config to fetch a Segment API token. It will search for it in this order:
//   1. process.env.TYPEWRITER_TOKEN
//   2. The stdout from executing tokenCommand from the config.
//   3. cat ~/.typewriter.yml
// Returns undefined if no token can be found.
export async function getToken(cfg: Partial<Config> | undefined): Promise<string | undefined> {
	const { token } = await getTokenWithReason(cfg)
	return token
}

// Only resolve tokens (specifically, tokenCommands) once per CLI invocation.
let tokenCache: { token: string | undefined; reason: string | undefined } = {
	token: undefined,
	reason: undefined,
}
export async function getTokenWithReason(
	cfg: Partial<Config> | undefined
): Promise<typeof tokenCache> {
	// Check the cache first.
	if (tokenCache.token) {
		return tokenCache
	}

	// Attempt to read a token from the shell environment.
	if (process.env.TYPEWRITER_TOKEN) {
		tokenCache = {
			token: process.env.TYPEWRITER_TOKEN,
			reason: 'env',
		}
		return tokenCache
	}

	// Attempt to read a token by executing the tokenCommand from the typewriter.yml config file.
	if (cfg && cfg.tokenCommand) {
		const { stdout, stderr } = await exec(cfg.tokenCommand).catch(err => {
			throw new Error(`Invalid tokenCommand: ${err}`)
		})

		if (stderr.trim().length > 0) {
			console.error(stderr)
		} else {
			const token = stdout.trim()
			if (token) {
				tokenCache = {
					token,
					reason: 'tokenCommand',
				}
				return tokenCache
			}
		}
	}

	// Attempt to read a token from the ~/.typewriter token file.
	// Tokens are stored here during the `init` flow, if a user generates a token.
	try {
		const path = resolve(homedir(), '.typewriter')
		const token = await readFile(path, 'utf-8')
		if (token) {
			tokenCache = {
				token,
				reason: 'file',
			}
			return tokenCache
		}
	} catch (e) {
		// Ignore errors if ~/.typewriter doesn't exist
	}

	return {
		token: undefined,
		reason: undefined,
	}
}

// storeToken writes a token to ~/.typewriter.
export async function storeToken(token: string) {
	const path = resolve(homedir(), '.typewriter')
	return writeFile(path, token, 'utf-8')
}
