import { getConfig, getDefaultPath, setConfig } from './config'
import gen, { Language, Options } from '../generators'
import { Config } from './config'
import { JSONSchema7 } from 'json-schema'
import { Environment } from '../generators/javascript'
import { resolve } from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import * as childProcess from 'child_process'
import {
	fetchTrackingPlan,
	fetchWorkspaces,
	isValidToken,
	generateToken,
	fetchAllTrackingPlans,
} from './api'
import * as prompts from 'prompts'

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)
const exec = promisify(childProcess.exec)

export async function init() {
	// Attempt to read a config, if one is available.
	const currentConfig = await getConfig()

	const languageChoices = [
		{ title: 'JavaScript', value: 'javascript' },
		{ title: 'TypeScript', value: 'typescript' },
		{ title: 'iOS Objective-C', value: 'ios:objective-c', disabled: true },
		{ title: 'Android Java', value: 'android:java', disabled: true },
	]

	const tokenProviderChoices = [
		{ title: 'Generate a new token', value: 'generate' },
		{ title: 'Provide a shell command', value: 'command' },
	]

	let token = process.env.TYPEWRITER_TOKEN

	// If a TYPEWRITER_TOKEN is set and is a valid Segment API token,
	// then add it to tokenProviderChoices.
	if (!!token && (await isValidToken({ token }))) {
		tokenProviderChoices.unshift({
			title: `Use TYPEWRITER_TOKEN (${await tokenToString(token)})`,
			value: 'environment',
		})
	}

	const response = await prompts([
		// Set the config.language value.
		{
			type: 'select',
			message: 'What language should Typewriter generate?',
			name: 'language',
			choices: languageChoices,
			initial:
				currentConfig &&
				languageChoices.findIndex(
					({ value }) => value === currentConfig.language.name
				),
		},

		// Set the config.path value.
		{
			type: 'text',
			message: 'What directory should Typewriter write clients into?',
			name: 'path',
			initial: currentConfig ? currentConfig.path : await getDefaultPath(),
		},

		// Fetch a Segment API Token
		{
			type: 'select',
			message: 'How do you want to provide a Segment API Token?',
			name: 'tokenProvider',
			choices: tokenProviderChoices,
		},
		// If the user selects "environment", then we don't need to do anything else.
		// If the user selected "generate", then hit the Segment API to generate a new
		// API token.
		{
			type: (_, values) =>
				// Note: upstream fix here: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35510
				(((values as unknown) as prompts.Answers<'tokenProvider'>)
					.tokenProvider === 'generate'
					? 'text'
					: false) as prompts.PromptType,
			message: 'What workspace slug should the token have read access to?',
			name: 'workspaceSlug',
		},
		{
			type: (_, values) =>
				// Note: upstream fix here: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35510
				(((values as unknown) as prompts.Answers<'tokenProvider'>)
					.tokenProvider === 'generate'
					? 'text'
					: false) as prompts.PromptType,
			message: 'What is your segment.com account email?',
			name: 'email',
		},
		{
			type: (_, values) =>
				// Note: upstream fix here: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35510
				(((values as unknown) as prompts.Answers<'tokenProvider'>)
					.tokenProvider === 'generate'
					? 'password'
					: false) as prompts.PromptType,
			message: 'What is your segment.com account password?',
			name: 'password',
			format: async (password, values) => {
				token = await generateToken({
					workspaceSlug: values.workspaceSlug,
					email: values.email,
					password,
				})

				console.log(`Successfully generated a new Segment API token.
You'll need to store this token in your environment with:
	export TYPEWRITER_TOKEN=${token}

Alternatively, you can store this token in your team's secret store system and provide
it to your team using a shell command by setting a tokenCommand in typewriter.yml.`)

				return password
			},
		},
		// If the user selected "command", then fetch a shell command and verify it produces an API token.
		{
			type: (_, values) =>
				// Note: upstream fix here: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35510
				(((values as unknown) as prompts.Answers<'tokenProvider'>)
					.tokenProvider === 'command'
					? 'text'
					: false) as prompts.PromptType,
			message:
				'Enter a shell command which will output an API token to stdout. For example, this may query your secret store to fetch the correct token:',
			name: 'tokenCommand',
			validate: async command => {
				token = await executeTokenCommand(command)

				return token && (await isValidToken({ token }))
					? true
					: `Found invalid token: ${token}`
			},
		},
	])

	if (!token) {
		// We'll have found a token by this point (or failed), so this won't happen.
		throw new Error('Unable to find an API Token.')
	}

	// Now that we have a token, we can fetch their Tracking Plans.
	const availableTrackingPlans = await fetchAllTrackingPlans({ token })

	if (availableTrackingPlans.length === 0) {
		console.error(
			`No Tracking Plans accessible from your token (${await tokenToString(
				token
			)})`
		)
		return
	}
	const preSelectedTrackingPlanIDs = currentConfig
		? currentConfig.trackingPlans.map(tp => tp.id)
		: []

	const trackingPlanResponse = await prompts([
		{
			type: 'autocomplete',
			message: 'Which Tracking Plan should Typewriter generate clients for?',
			name: 'trackingPlan',
			min: 1,
			choices: availableTrackingPlans
				// Sort Tracking Plans by update time, to match the Tracking Plan list view.
				.sort((a, b) => b.update_time.getTime() - a.update_time.getTime())
				.map(tp => ({
					title: tp.display_name,
					value: tp.name,
					selected: preSelectedTrackingPlanIDs.includes(
						tp.name.split('/').slice(-1)[0]
					),
				})),
		},
	])

	const trackingPlanName = trackingPlanResponse.trackingPlan as string
	const trackingPlan = availableTrackingPlans.find(
		tp => tp.name === trackingPlanName
	)
	if (!trackingPlan) {
		throw new Error('You must select a Tracking Plan')
	}

	const cfg: Config = {
		language: response.language,
		path: response.path,
		trackingPlans: [
			{
				name: trackingPlan.display_name,
				id: trackingPlan.name.split('/').slice(-1)[0],
				workspaceSlug: trackingPlan.name
					.replace('workspaces/', '')
					.split('/')[0],
			},
		],
		tokenCommand:
			response.tokenProvider === 'command' ? response.tokenCommand : undefined,
	}

	await setConfig(cfg)
}

// tokenToString partially redacts a token and prints a list of accessible
// workspaces to provide context on the token.
async function tokenToString(token: string) {
	const workspaces = await fetchWorkspaces({ token })
	const redactedToken = token.substring(0, 10) + '...'

	return `${redactedToken} [${workspaces.map(w => w.display_name).join(', ')}]`
}

export async function generate() {
	await generateClients({ isDevelopment: true })
}

export async function prod() {
	await generateClients({ isDevelopment: false })
}

async function generateClients({ isDevelopment }: { isDevelopment: boolean }) {
	const cfg = await getConfig()

	if (!cfg) {
		// TODO: redirect to setting up a config file
		throw new Error('Unable to find typewriter.yml. Try `typewriter init`')
	}

	// Generate the output directory, if it doesn't exist.
	if (!(await exists(cfg.path))) {
		await mkdir(cfg.path, {
			recursive: true,
		})
	}

	const token = await getToken(cfg)
	if (!token) {
		// TODO: redirect to setting up a token
		throw new Error(
			'Unable to find a TYPEWRITER_TOKEN in your environment or a valid `tokenCommand` field in your `typewriter.yml`.'
		)
	}

	for (var trackingPlanConfig of cfg.trackingPlans) {
		const trackingPlan = await fetchTrackingPlan({
			id: trackingPlanConfig.id,
			workspaceSlug: trackingPlanConfig.workspaceSlug,
			token,
		})

		const events = trackingPlan.rules.events.map<JSONSchema7>(e => ({
			...e.rules,
			title: e.name,
			description: e.description,
		}))

		// Generate a client and write its files out to the specified path.
		const files = await gen(events, getOptions(cfg, isDevelopment))
		for (var file of files) {
			const filePath = resolve(cfg.path, file.path)
			await writeFile(filePath, file.contents, {
				encoding: 'utf-8',
			})
		}
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
	} else {
		throw new Error(`Invalid Language Name: ${cfg.language.name}`)
	}
}

async function getToken(cfg: Config | undefined): Promise<string | undefined> {
	if (!!process.env.TYPEWRITER_TOKEN) {
		return process.env.TYPEWRITER_TOKEN
	}

	if (cfg && cfg.tokenCommand) {
		return executeTokenCommand(cfg.tokenCommand)
	}

	return undefined
}

async function executeTokenCommand(cmd: string): Promise<string | undefined> {
	const { stdout, stderr } = await exec(cmd).catch(err => {
		throw new Error(`Invalid tokenCommand: ${err}`)
	})
	if (stderr.trim().length > 0) {
		console.error(stderr)
	} else {
		const possibleToken = stdout.trim()
		if (possibleToken.length > 0) {
			return possibleToken
		}
	}

	return undefined
}

export async function token() {
	const cfg = await getConfig()

	if (!cfg) {
		console.log('TODO: implement init via other commands')
		throw new Error('Unable to find typewriter.yml. Try `typewriter init`')
	}

	const token = await getToken(cfg)

	if (!token) {
		console.log(
			'Unable to find a TYPEWRITER_TOKEN in your environment or a valid `tokenCommand` field in your `typewriter.yml`.'
		)
	} else {
		console.log(token)
	}
}

export async function update() {
	console.log('TODO: implement update')
}
