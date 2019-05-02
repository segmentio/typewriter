import config from './config'
import gen, { Language, Options } from '../generators'
import { Config } from './config'
import { JSONSchema7 } from 'json-schema'
import { Environment } from '../generators/javascript'
import { resolve } from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import * as childProcess from 'child_process'

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)
const exec = promisify(childProcess.exec)

export async function init() {
	console.log('TODO: implement init function')

	const cfg = await config.get()
	console.log(cfg)
	/*
  // ask what language to generate

  // ask where the clients should be written to
  
  // const token = `get a token`
    // if a token is available in the path
      // ask if they want to use it (show the first N chars, the rest hidden)
      // maybe fetch information on it from the API (who owns it, workspaces it has access to, etc.)
    // if not, ask if a user wants to generate a token
      // if so, ask for an email and password
      // hit the API and fetch a token
      // print out the token with some information on it
      // store the fetched token in TYPEWRITER_TOKEN in the env
    // if not, ask if the user wants to provide a script that will fetch the token
      // if so, take the command and execute it to fetch a TYPEWRITER_TOKEN. If the output isn't a string or 
      // a token isn't added to the env, notify the user that it failed.
  
  // Fetch the Tracking Plans from that workspace (show number of events, name, last updated?, ...)
    // Offer a multi-select of the Tracking Plans, to indicate which to install
  
  // Ask whether you'd like to select events or sync all
    // Select which events to sync: multi-select again
    */
}

export async function generate() {
	await generateClients({ isDevelopment: true })
}

export async function prod() {
	await generateClients({ isDevelopment: false })
}

async function generateClients({ isDevelopment }: { isDevelopment: boolean }) {
	const cfg = await config.get()

	if (!cfg) {
		// TODO: redirect to setting up a config file
		throw new Error('Unable to find typewriter.toml. Try `typewriter init`')
	}

	// Generate the output directory, if it doesn't exist.
	const dirPath = resolve(cfg.path, '../')
	if (!(await exists(dirPath))) {
		await mkdir(dirPath, {
			recursive: true,
		})
	}

	const token = await getToken(cfg)
	if (!token) {
		// TODO: redirect to setting up a token
		throw new Error(
			'Unable to find a TYPEWRITER_TOKEN in your environment or a valid `tokenCommand` field in your `typewriter.toml`.'
		)
	}

	// TODO: sync Tracking Plan
	const schemas: JSONSchema7[] = []

	// Generate a client and write its files out to the specified path.
	const files = await gen(schemas, getOptions(cfg, isDevelopment))
	for (var file of files) {
		const filePath = resolve(dirPath, file.path)
		await writeFile(filePath, file.contents, {
			encoding: 'utf-8',
		})
	}
}

function getOptions(cfg: Config, isDevelopment: boolean): Options {
	const sharedOptions = {
		env: Environment.NODE,
		isDevelopment,
	}

	if (cfg.language.name === 'typescript') {
		return {
			lang: Language.TYPESCRIPT,
			...sharedOptions,
		}
	} else if (cfg.language.name === 'javascript') {
		return {
			lang: Language.JAVASCRIPT,
			...sharedOptions,
		}
	}

	throw new Error('inaccessible')
}

async function getToken(cfg: Config): Promise<string | undefined> {
	if (!!process.env.TYPEWRITER_TOKEN) {
		return process.env.TYPEWRITER_TOKEN
	}

	if (!!cfg.tokenCommand) {
		const { stdout, stderr } = await exec(cfg.tokenCommand)
		if (stderr.trim().length > 0) {
			console.error(stderr)
		} else {
			const possibleToken = stdout.trim()
			if (possibleToken.length > 0) {
				return possibleToken
			}
		}
	}

	return undefined
}

export async function token() {
	const cfg = await config.get()

	if (!cfg) {
		console.log('TODO: implement init via other commands')
		throw new Error('Unable to find typewriter.toml. Try `typewriter init`')
	}

	const token = await getToken(cfg)

	if (!token) {
		console.log(
			'Unable to find a TYPEWRITER_TOKEN in your environment or a valid `tokenCommand` field in your `typewriter.toml`.'
		)
	} else {
		console.log(token)
	}
}

export async function update() {
	console.log('TODO: implement update')
}
