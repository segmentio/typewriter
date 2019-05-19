import { getConfig, setConfig, resolveRelativePath, getToken } from './config'
import gen, { Language } from '../generators'
import { JSONSchema7 } from 'json-schema'
import * as fs from 'fs'
import { promisify } from 'util'
import {
	fetchTrackingPlan,
	fetchWorkspaces,
	isValidToken,
	generateToken,
	fetchAllTrackingPlans,
} from './api'
import * as prompts from 'prompts'
import { Environment, JavaScriptOptions, TypeScriptOptions } from 'src/generators/javascript'
import { Arguments, Config } from './types'
import { writeTrackingPlan, loadTrackingPlan } from './trackingplans'

const writeFile = promisify(fs.writeFile)

export async function init(args: Arguments) {
	// Attempt to read a config, if one is available.
	const currentConfig = await getConfig(args.config)

	const languageChoices = [
		{ title: 'JavaScript (analytics.js)', value: 'javascript:browser' },
		{ title: 'TypeScript (analytics.js)', value: 'typescript:browser' },
		{ title: 'JavaScript (analytics-node)', value: 'javascript:node' },
		{ title: 'TypeScript (analytics-node)', value: 'typescript:node' },
		{ title: 'Objective-C (analytics-ios)', value: 'objective-c:analytics-ios', disabled: true },
		{ title: 'Java (analytics-java)', value: 'android:analytics-java', disabled: true },
	]
	const defaultLanguage =
		currentConfig &&
		languageChoices.findIndex(
			({ value }) =>
				value.split(':')[0] === currentConfig.language.name &&
				value.split(':')[1] === currentConfig.language.env
		)

	const tokenProviderChoices = [
		{ title: 'Generate a new token', value: 'generate' },
		{ title: 'Provide a shell command', value: 'command' },
	]
	let defaultTokenProvider = currentConfig && currentConfig.tokenCommand ? 'command' : 'generate'

	let token = process.env.TYPEWRITER_TOKEN

	// If a TYPEWRITER_TOKEN is set and is a valid Segment API token,
	// then add it to tokenProviderChoices.
	if (!!token && (await isValidToken({ token }))) {
		tokenProviderChoices.unshift({
			title: `Use TYPEWRITER_TOKEN (${await tokenToString(token)})`,
			value: 'environment',
		})
		defaultTokenProvider = 'environment'
	}

	const response = await prompts([
		// Set the config.language value.
		{
			type: 'select',
			message: 'What language should Typewriter generate?',
			name: 'language',
			choices: languageChoices,
			initial: defaultLanguage,
		},

		// Set the config.path value.
		{
			type: 'text',
			message: 'What directory should Typewriter write this client into?',
			name: 'path',
			initial:
				currentConfig && currentConfig.trackingPlans.length > 0
					? currentConfig.trackingPlans[0].path
					: './analytics',
		},

		// Fetch a Segment API Token
		{
			type: 'select',
			message: 'How do you want to provide a Segment API Token?',
			name: 'tokenProvider',
			choices: tokenProviderChoices,
			initial: tokenProviderChoices.findIndex(c => c.value === defaultTokenProvider),
		},
		// If the user selects "environment", then we don't need to do anything else.
		// If the user selected "generate", then hit the Segment API to generate a new
		// API token.
		{
			type: (_, values) =>
				// Note: upstream fix here: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35510
				(((values as unknown) as prompts.Answers<'tokenProvider'>).tokenProvider === 'generate'
					? 'text'
					: false) as prompts.PromptType,
			message: 'What workspace slug should the token have read access to?',
			name: 'workspaceSlug',
		},
		{
			type: (_, values) =>
				// Note: upstream fix here: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35510
				(((values as unknown) as prompts.Answers<'tokenProvider'>).tokenProvider === 'generate'
					? 'text'
					: false) as prompts.PromptType,
			message: 'What is your segment.com account email?',
			name: 'email',
		},
		{
			type: (_, values) =>
				// Note: upstream fix here: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35510
				(((values as unknown) as prompts.Answers<'tokenProvider'>).tokenProvider === 'generate'
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
				(((values as unknown) as prompts.Answers<'tokenProvider'>).tokenProvider === 'command'
					? 'text'
					: false) as prompts.PromptType,
			message:
				'Enter a shell command which will output an API token to stdout. For example, this may query your secret store to fetch the correct token:',
			name: 'tokenCommand',
			initial: currentConfig && currentConfig.tokenCommand,
			format: async tokenCommand => {
				token = await getToken({
					tokenCommand,
				})
				return tokenCommand
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
		console.error(`No Tracking Plans accessible from your token (${await tokenToString(token)})`)
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
					selected: preSelectedTrackingPlanIDs.includes(tp.name.split('/').slice(-1)[0]),
				})),
		},
	])

	const trackingPlanName = trackingPlanResponse.trackingPlan as string
	const trackingPlan = availableTrackingPlans.find(tp => tp.name === trackingPlanName)
	if (!trackingPlan) {
		throw new Error('You must select a Tracking Plan')
	}

	const [languageName, env] = (response.language as string).split(':')

	const cfg: Config = {
		language: getLanguage(languageName, env),
		trackingPlans: [
			{
				name: trackingPlan.display_name,
				id: trackingPlan.name.split('/').slice(-1)[0],
				workspaceSlug: trackingPlan.name.replace('workspaces/', '').split('/')[0],
				path: response.path,
			},
		],
		tokenCommand: response.tokenProvider === 'command' ? response.tokenCommand : undefined,
	}

	await setConfig(cfg)

	// Now generate a client using the newly initialized configuration.
	console.log("Successfully initialized a new 'typewriter.yml' configuration.")
	console.log("Running 'npx typewriter@next' to build your typewriter client...")
	await generate(args)
}

export async function generate(args: Arguments) {
	await generateClients(args, { isDevelopment: true })
}

export async function prod(args: Arguments) {
	await generateClients(args, { isDevelopment: false })
}

export async function token(args: Arguments) {
	const cfg = await getConfig(args.config)

	if (!cfg) {
		// TODO: potentially call out to typewriter init to gracefully handle this.
		// Otherwise, as part of the error message UX, drive the user towards running typewriter init.
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

export async function update(args: Arguments) {
	const cfg = await getConfig(args.config)

	if (!cfg) {
		throw new Error('Unable to find typewriter.yml. Try `typewriter init`')
	}

	const token = await getToken(cfg)
	if (!token) {
		throw new Error(
			'Unable to find a TYPEWRITER_TOKEN in your environment or a valid `tokenCommand` field in your `typewriter.yml`.'
		)
	}

	// TODO(colinking): support fine-grained event updates, by event name and by label.
	// For now, we will just support updating the full tracking plan.
	for (var config of cfg.trackingPlans) {
		const plan = await fetchTrackingPlan({
			id: config.id,
			workspaceSlug: config.workspaceSlug,
			token,
		})

		await writeTrackingPlan(args, plan, config)
	}
}

// Command Helpers

function getLanguage(name: string, env: string): JavaScriptOptions | TypeScriptOptions {
	if (name === Language.JAVASCRIPT) {
		return {
			name,
			env: env as Environment,
		}
	} else if (name === Language.TYPESCRIPT) {
		return {
			name,
			env: env as Environment,
		}
	} else {
		throw new Error(`Unknown language: ${name}`)
	}
}

// tokenToString partially redacts a token and prints a list of accessible
// workspaces to provide context on the token.
async function tokenToString(token: string) {
	const workspaces = await fetchWorkspaces({ token })
	const redactedToken = token.substring(0, 10) + '...'

	return `${redactedToken} [${workspaces.map(w => w.display_name).join(', ')}]`
}

async function generateClients(args: Arguments, { isDevelopment }: { isDevelopment: boolean }) {
	const cfg = await getConfig(args.config)

	if (!cfg) {
		// TODO: redirect to setting up a config file
		throw new Error('Unable to find typewriter.yml. Try `typewriter init`')
	}

	for (var config of cfg.trackingPlans) {
		const plan = await loadTrackingPlan(args, config)

		const events = plan.rules.events.map<JSONSchema7>(e => ({
			...e.rules,
			title: e.name,
			description: e.description,
		}))

		// Generate a client and write its files out to the specified path.
		const files = await gen(events, {
			...cfg.language,
			isDevelopment,
		})
		for (var file of files) {
			const path = await resolveRelativePath(args, 'file', config.path, file.path)
			await writeFile(path, file.contents, {
				encoding: 'utf-8',
			})
		}
	}
}
