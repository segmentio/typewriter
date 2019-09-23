import * as fs from 'fs'
import { promisify } from 'util'
import { resolve, dirname } from 'path'
import * as yaml from 'js-yaml'
import { generateFromTemplate } from '../../templates'
import * as childProcess from 'child_process'
import { homedir } from 'os'
import { Config, validateConfig } from './schema'
import { validateToken, SegmentAPI } from '../api'
import { wrapError } from '../commands/error'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)
const mkdir = promisify(fs.mkdir)
const exec = promisify(childProcess.exec)

export const CONFIG_NAME = 'typewriter.yml'

// getConfig looks for, and reads, a typewriter.yml configuration file.
// If it does not exist, it will return undefined. If the configuration
// if invalid, an Error will be thrown.
// Note: path is relative to the directory where the typewriter command
// was run.
export async function getConfig(path = './'): Promise<Config | undefined> {
	// Check if a typewriter.yml exists.
	const configPath = await getPath(path)
	if (!(await exists(configPath))) {
		return undefined
	}

	// If so, read it's contents.
	let file
	try {
		file = await readFile(configPath, {
			encoding: 'utf-8',
		})
	} catch (err) {
		throw wrapError(
			'Unable to open typewriter.yml',
			err as Error,
			`Failed due to an ${err.code} error (${err.errno}).`,
			configPath
		)
	}

	const rawConfig = yaml.safeLoad(file)

	return validateConfig(rawConfig)
}

// setConfig writes a config out to a typewriter.yml file.
// Note path is relative to the directory where the typewriter command
// was run.
export async function setConfig(config: Config, path = './') {
	const file = await generateFromTemplate<Config>('cli/config/typewriter.yml.hbs', config, false)

	await writeFile(await getPath(path), file)
}

// resolveRelativePath resolves a relative path from the directory of the `typewriter.yml` config
// file. It supports file and directory paths.
export function resolveRelativePath(
	configPath: string | undefined,
	path: string,
	...otherPaths: string[]
): string {
	// Resolve the path based on the optional --config flag.
	return configPath
		? resolve(configPath.replace(/typewriter\.yml$/, ''), path, ...otherPaths)
		: resolve(path, ...otherPaths)
}

export async function verifyDirectoryExists(
	path: string,
	type: 'directory' | 'file' = 'directory'
) {
	// If this is a file, we need to verify it's parent directory exists.
	// If it is a directory, then we need to verify the directory itself exists.
	const dirPath = type === 'directory' ? path : dirname(path)
	if (!(await exists(dirPath))) {
		await mkdir(dirPath, {
			recursive: true,
		})
	}
}

export async function assertHasToken(cfg: Partial<Config> | undefined): Promise<string> {
	const token = await getToken(cfg)
	if (token) {
		return token
	}

	throw new Error(`Unable to find an API token.`)
}

// getToken uses a Config to fetch a Segment API token. It will search for it in this order:
//   1. The stdout from executing the optional token script from the config.
//   2. cat ~/.typewriter
// Returns undefined if no token can be found.
export async function getToken(cfg: Partial<Config> | undefined): Promise<string | undefined> {
	const token = await getTokenMetadata(cfg)
	return token ? token.token : undefined
}

export async function getTokenMethod(
	cfg: Partial<Config> | undefined
): Promise<string | undefined> {
	const token = await getTokenMetadata(cfg)
	return token ? token.method : undefined
}

async function getTokenMetadata(
	cfg: Partial<Config> | undefined
): Promise<TokenMetadata | undefined> {
	const tokens = await listTokens(cfg)
	const resolutionOrder = [tokens.script, tokens.file]
	for (const metadata of resolutionOrder) {
		if (metadata.isValidToken) {
			return metadata
		}
	}

	return undefined
}

export interface ListTokensOutput {
	script: TokenMetadata
	file: TokenMetadata
}

export interface TokenMetadata {
	token?: string
	method: 'script' | 'file'
	isValidToken: boolean
	workspace?: SegmentAPI.Workspace
}

// Only resolve token scripts once per CLI invocation.
// Maps a token script -> output, if any
const tokenScriptCache: Record<string, string> = {}

export async function listTokens(cfg: Partial<Config> | undefined): Promise<ListTokensOutput> {
	const output: ListTokensOutput = {
		script: { method: 'script', isValidToken: false },
		file: { method: 'file', isValidToken: false },
	}

	// Attempt to read a token from the ~/.typewriter token file.
	// Tokens are stored here during the `init` flow, if a user generates a token.
	try {
		const path = resolve(homedir(), '.typewriter')
		const token = await readFile(path, 'utf-8')
		output.file.token = token.trim()
	} catch (e) {
		// Ignore errors if ~/.typewriter doesn't exist
	}

	// Attempt to read a token by executing the token script from the typewriter.yml config file.
	// Handle token script errors gracefully, f.e., in CI where you don't need it.
	if (cfg && cfg.scripts && cfg.scripts.token) {
		const tokenScript = cfg.scripts.token
		// Since we don't know if this token script has side effects, cache (in-memory) the result
		// s.t. we only execute it once per CLI invocation.
		if (!tokenScriptCache[tokenScript]) {
			const { stdout } = await exec(tokenScript).catch(err => {
				return { stdout: '' }
			})

			if (!!stdout) {
				tokenScriptCache[tokenScript] = stdout.trim()
			}
		}

		output.script.token = tokenScriptCache[tokenScript]
	}

	// Validate whether any of these tokens are valid Segment API tokens.
	for (const metadata of Object.values(output)) {
		const result = await validateToken(metadata.token)
		metadata.isValidToken = result.isValid
		metadata.workspace = result.workspace
	}

	return output
}

// storeToken writes a token to ~/.typewriter.
export async function storeToken(token: string) {
	const path = resolve(homedir(), '.typewriter')
	return writeFile(path, token, 'utf-8')
}

async function getPath(path: string): Promise<string> {
	path = path.replace(/typewriter\.yml$/, '')
	// TODO: recursively move back folders until you find it, ala package.json
	return resolve(path, CONFIG_NAME)
}
