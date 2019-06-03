import { getConfig, setConfig, resolveRelativePath, getToken } from './config'
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
import prompts from 'prompts'
import { Arguments, Config } from './types'
import { writeTrackingPlan, loadTrackingPlan } from './trackingplans'
import { gen } from '../generators/gen'
import { RawTrackingPlan } from '../generators/gen'
import { Options, SDK, Language } from '../generators/options'

const writeFile = promisify(fs.writeFile)

export async function init(args: Arguments) {
	// Attempt to read a config, if one is available.
	const currentConfig = await getConfig(args.config)

	const sdkChoices = [
		{ title: 'analytics.js', value: 'analytics.js' },
		{ title: 'analytics-node', value: 'analytics-node' },
		{ title: 'analytics-ios', value: 'analytics-ios' },
		{ title: 'analytics-android', value: 'analytics-android', disabled: true },
	]
	const defaultSDK =
		currentConfig && sdkChoices.findIndex(({ value }) => value === currentConfig.client.sdk)

	const javascriptLanguageChoices = [
		{ title: 'JavaScript', value: 'javascript' },
		{ title: 'TypeScript', value: 'typescript' },
	]
	const defaultJavaScriptLanguage =
		currentConfig &&
		javascriptLanguageChoices.findIndex(({ value }) => value === currentConfig.client.language)

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
		// Set the config.client.sdk value.
		{
			type: 'select',
			message: 'What SDK should the Typewriter client use?',
			name: 'sdk',
			choices: sdkChoices,
			initial: defaultSDK,
		},
		// Set the config.client.language value, depending on the SDK option selected.
		// We skip the language select if there is only one language option for the selected SDK.
		// For now, that means we'll only show it for our JavaScript clients.
		{
			type: (_, values) =>
				['analytics.js', 'analytics-node'].includes(values.sdk) ? 'select' : false,
			message: 'What language should the Typewriter client be generated in?',
			name: 'language',
			choices: javascriptLanguageChoices,
			initial: defaultJavaScriptLanguage,
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
			type: (_, values) => (values.tokenProvider === 'generate' ? 'text' : false),
			message: 'What workspace slug should the token have read access to?',
			name: 'workspaceSlug',
		},
		{
			type: (_, values) => (values.tokenProvider === 'generate' ? 'text' : false),
			message: 'What is your segment.com account email?',
			name: 'email',
		},
		{
			type: (_, values) => (values.tokenProvider === 'generate' ? 'password' : false),
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
			type: (_, values) => (values.tokenProvider === 'command' ? 'text' : false),
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

	let language = response.language
	// If there is only one language option, we will have skipped the language select,
	// so we'll need to default to the sole language option for the selected SDK.
	if (!language) {
		if (response.sdk === SDK.IOS) {
			language = Language.OBJECTIVE_C
		}
	}

	const client: Options = {
		sdk: response.sdk,
		language,
	}
	const cfg: Config = {
		client,
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

	await setConfig(cfg, args.config)

	console.log("Successfully initialized a new 'typewriter.yml' configuration.")

	// Now generate a client using the newly initialized configuration.
	if (response.tokenProvider !== 'generate') {
		console.log("Running 'npx typewriter@next' to build your typewriter client...")
		await generate(args)
	}
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

	console.log("Running 'npx typewriter@next' to re-build your typewriter client...")
	await generate(args)
}

// Command Helpers

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
		throw new Error('Unable to find typewriter.yml. Try `typewriter init`')
	}

	for (var config of cfg.trackingPlans) {
		const segmentTrackingPlan = await loadTrackingPlan(args, config)
		const trackingPlan: RawTrackingPlan = {
			trackCalls: segmentTrackingPlan.rules.events.map<JSONSchema7>(e => ({
				...e.rules,
				title: e.name,
				description: e.description,
			})),
		}

		// Generate a client and write its files out to the specified path.
		const files = await gen(trackingPlan, {
			...cfg,
			// TODO: fetch from package.json
			typewriterVersion: '7.0.0',
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
