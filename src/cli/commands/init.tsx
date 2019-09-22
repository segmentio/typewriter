import React, { useState, useEffect } from 'react'
import { Text, Box, Color } from 'ink'
import Link from 'ink-link'
import SelectInput, { Item } from 'ink-select-input'
import TextInput from 'ink-text-input'
import Spinner from 'ink-spinner'
import { Config, listTokens, getTokenMethod, setConfig, storeToken } from '../config'
import { validateToken, SegmentAPI, fetchAllTrackingPlans, parseTrackingPlanName } from '../api'
import { SDK, Language, Options, JavaScriptOptions } from '../../generators/options'
import figures from 'figures'
import * as fs from 'fs'
import { promisify } from 'util'
import { join, normalize } from 'path'
import { get as stringDistance } from 'fast-levenshtein'
import { orderBy } from 'lodash'
import { Build } from './build'

const readir = promisify(fs.readdir)

interface Props {
	/** Path to typewriter.yml */
	configPath: string
	/** typewriter.yml contents */
	config?: Config
}

export const Init: React.FC<Props> = ({ configPath, config }) => {
	const [step, setStep] = useState(0)
	const [sdk, setSDK] = useState(SDK.WEB)
	const [language, setLanguage] = useState(Language.JAVASCRIPT)
	const [path, setPath] = useState('')
	const [token, setToken] = useState('')
	const [trackingPlan, setTrackingPlan] = useState<SegmentAPI.TrackingPlan>()

	const onNext = () => [setStep(step + 1)]
	const onRestart = () => {
		setStep(1)
	}

	function withNextStep<Arg>(f: (arg: Arg) => void) {
		return (arg: Arg) => {
			f(arg)
			setStep(step + 1)
		}
	}

	return (
		<Box marginLeft={2} marginRight={2} marginTop={1} marginBottom={1}>
			{/* <Header/> */}
			{step === 0 && <ConfirmationPrompt onSubmit={onNext} />}
			{step === 1 && <SDKPrompt sdk={sdk} onSubmit={withNextStep(setSDK)} />}
			{step === 2 && (
				<LanguagePrompt sdk={sdk} language={language} onSubmit={withNextStep(setLanguage)} />
			)}
			{step === 3 && <PathPrompt path={path} onSubmit={withNextStep(setPath)} />}
			{step === 4 && <APITokenPrompt config={config} onSubmit={withNextStep(setToken)} />}
			{step === 5 && (
				<TrackingPlanPrompt
					path={path}
					token={token}
					trackingPlan={trackingPlan}
					onSubmit={withNextStep(setTrackingPlan)}
				/>
			)}
			{step === 6 && (
				<SummaryPrompt
					sdk={sdk}
					language={language}
					path={path}
					trackingPlan={trackingPlan!}
					onConfirm={onNext}
					onRestart={onRestart}
				/>
			)}
			{step === 7 && (
				<Build configPath={configPath} config={config} production={false} update={true} />
			)}
		</Box>
	)
}

const Header: React.FC = () => {
	return (
		<Box flexDirection="column">
			<Box textWrap="wrap" marginBottom={10}>
				<Color white>
					Typewriter is a tool for generating strongly-typed{' '}
					<Link url="https://segment.com">Segment</Link> analytics libraries from a{' '}
					<Link url="https://segment.com/docs/protocols/tracking-plan">Tracking Plan</Link>.
				</Color>{' '}
				<Color grey>
					Learn more from{' '}
					<Link url="https://segment.com/docs/protocols/typewriter">
						{"Typewriter's documentation here"}
					</Link>
					. To get started, {"you'll"} need a <Color yellow>typewriter.yml</Color>. The quickstart
					below will walk you through creating one.
				</Color>
			</Box>
		</Box>
	)
}

interface ConfirmationPromptProps {
	text?: string
	onSubmit: () => void
}

/** A simple prompt to get users acquainted with the terminal-based select. */
const ConfirmationPrompt: React.FC<ConfirmationPromptProps> = ({ text, onSubmit }) => {
	const items = [{ label: 'Ok!', value: 'ok' }]

	return (
		<Box flexDirection="column">
			<Color white>{text || 'Ready?'}</Color>
			<Color grey>Tip: Hit return to continue.</Color>
			<Box marginTop={1}>
				<SelectInput items={items} onSelect={onSubmit} />
			</Box>
		</Box>
	)
}

interface SDKPromptProps {
	sdk: SDK
	onSubmit: (sdk: SDK) => void
}

/** A prompt to identify which Segment SDK a user wants to use. */
const SDKPrompt: React.FC<SDKPromptProps> = ({ sdk, onSubmit }) => {
	const items: Item[] = [
		{ label: 'Web (analytics.js)', value: SDK.WEB },
		{ label: 'Node.js (analytics-node)', value: SDK.NODE },
		{ label: 'iOS (analytics-ios)', value: SDK.IOS },
	]
	const initialIndex = items.findIndex(i => i.value === sdk)

	const onSelect = (item: Item) => {
		onSubmit(item.value as SDK)
	}

	return (
		<Box flexDirection="column">
			<Color white>What analytics library are you using?</Color>
			<Color grey>Tip: Use your arrow keys to select an SDK.</Color>
			<Color grey>
				Tip: Typewriter clients are strongly-typed wrappers around a Segment analytics SDK.
			</Color>
			<Color grey>
				Tip: To learn more about {"Segment's"} SDKs, see the{' '}
				<Link url="https://segment.com/docs/sources">documentation</Link>.
			</Color>
			<Box marginTop={1}>
				<SelectInput items={items} initialIndex={initialIndex} onSelect={onSelect} />
			</Box>
		</Box>
	)
}

interface LanguagePromptProps {
	sdk: SDK
	language: Language
	onSubmit: (language: Language) => void
}

/** A prompt to identify which Segment programming language a user wants to use. */
const LanguagePrompt: React.FC<LanguagePromptProps> = ({ sdk, language, onSubmit }) => {
	const items: Item[] = [
		{ label: 'JavaScript', value: Language.JAVASCRIPT },
		{ label: 'TypeScript', value: Language.TYPESCRIPT },
		{ label: 'Objective-C', value: Language.OBJECTIVE_C },
		{ label: 'Swift', value: Language.SWIFT },
	].filter(item => {
		// Filter out items that aren't relevant, given the selected SDK.
		const supportedLanguages = {
			[SDK.WEB]: [Language.JAVASCRIPT, Language.TYPESCRIPT],
			[SDK.NODE]: [Language.JAVASCRIPT, Language.TYPESCRIPT],
			[SDK.IOS]: [Language.OBJECTIVE_C, Language.SWIFT],
		}

		return supportedLanguages[sdk].includes(item.value)
	})
	const initialIndex = items.findIndex(i => i.value === language)

	const onSelect = (item: Item) => {
		onSubmit(item.value as Language)
	}

	return (
		<Box flexDirection="column">
			<Color white>What programming language are you using?</Color>
			<Box marginTop={1}>
				<SelectInput items={items} initialIndex={initialIndex} onSelect={onSelect} />
			</Box>
		</Box>
	)
}

interface PathPromptProps {
	path: string
	onSubmit: (path: string) => void
}

/** Helper to list and filter all directories under a given filesystem path. */
async function filterDirectories(path: string): Promise<string[]> {
	/** Helper to list all directories in a given path. */
	const listDirectories = async (path: string): Promise<string[]> => {
		const files = await readir(path, {
			withFileTypes: true,
		})
		return files
			.filter(f => f.isDirectory() && !f.name.startsWith('.'))
			.map(f => join(path, f.name))
			.filter(f => normalize(f).startsWith(normalize(path).replace(/^\.\/?/, '')))
	}

	const directories = new Set()

	// First look for all directories in the same directory as the current query path.
	const parentPath = join(path, ['', '.', './'].includes(path) || path.endsWith('/') ? '.' : '..')
	const parentDirectories = await listDirectories(parentPath)
	parentDirectories.forEach(f => directories.add(f))

	const queryPath = join(parentPath, path)
	// Next, if the current query IS a directory, then we want to prioritize results from inside that directory.
	if (directories.has(queryPath)) {
		;(await listDirectories(queryPath)).forEach(f => directories.add(f))
	}

	// Otherwise, show results from inside any other directories at the level of the current query path.
	for (const dirPath of parentDirectories) {
		if (directories.size >= 10) {
			break
		}

		;(await listDirectories(dirPath)).forEach(f => directories.add(f))
	}

	// Now sort these directories by the query path.
	return [...directories].sort((a, b) => {
		const distDelta = stringDistance(a, path) - stringDistance(b, path)
		if (distDelta !== 0) {
			return distDelta
		}
		// Fall back on showing "closer" paths.
		return a.split('/').length - b.split('/').length
	})
}

/** A prompt to identify where to store the new client on the user's filesystem. */
const PathPrompt: React.FC<PathPromptProps> = ({ path: initialPath, onSubmit }) => {
	const [path, setPath] = useState(initialPath)
	const [directories, setDirectories] = useState<string[] | undefined>()

	// Fetch a list of directories, filtering by the supplied path.
	useEffect(() => {
		;(async () => {
			let directories: string[] = []
			try {
				directories = await filterDirectories(path)
			} catch {}

			setDirectories(directories)
		})()
	}, [path])

	const onChange = (newPath: string) => {
		setPath(newPath)
	}

	return (
		<Box flexDirection="column">
			<Color white>Which directory should the Typewriter client be stored in?</Color>
			<Box flexDirection="column" marginLeft={1}>
				<Color grey>
					{figures.arrowRight} Start typing to filter existing directories. Hit return to submit.
				</Color>
				<Color grey>
					{figures.arrowRight} Directories will be automatically created, if needed.
				</Color>
			</Box>
			<Box flexDirection="column" marginLeft={1}>
				<Box marginTop={1}>
					<Text>{figures.pointer}</Text>{' '}
					<TextInput value={path} showCursor={true} onChange={onChange} onSubmit={onSubmit} />
				</Box>
				<Box height={10} flexDirection="column">
					{!directories && (
						<Color grey>
							<Spinner type="dots" /> Loading...
						</Color>
					)}
					{directories && directories.length === 0 && <Color grey>Hit return to create</Color>}
					{directories &&
						directories.length > 0 &&
						directories.slice(0, 10).map(d => (
							<Color key={d} grey>
								{d}
							</Color>
						))}
				</Box>
			</Box>
		</Box>
	)
}

interface APITokenPromptProps {
	config?: Config
	onSubmit: (token: string) => void
}

/** A prompt to walk a user through getting a new Segment API token. */
const APITokenPrompt: React.FC<APITokenPromptProps> = ({ config, onSubmit }) => {
	const [token, setToken] = useState('')
	const [canBeSet, setCanBeSet] = useState(true)
	const [workspace, setWorkspace] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isInvalid, setIsInvalid] = useState(false)
	const [foundCachedToken, setFoundCachedToken] = useState(false)

	useEffect(() => {
		;(async () => {
			const tokens = await listTokens(config)
			const method = await getTokenMethod(config)
			const token = method === tokens.script.method ? tokens.script : tokens.file

			setToken(token.token || '')
			setFoundCachedToken(!!token.token)
			if (token.workspace) {
				setWorkspace(token.workspace.name)
			}
			setIsLoading(false)
			// If the user already has a typewriter.yml with a valid token,
			// then let the user know that they can't overwrite it.
			setCanBeSet(method !== tokens.script.method)
		})()
	}, [])

	// Helper to clear the invalid state every time the token changes.
	useEffect(() => {
		setIsInvalid(false)
	}, [token])

	// Fired after a user enters a token.
	const onConfirm = async () => {
		// Validate whether the entered token is a valid Segment API token.
		setIsLoading(true)

		const result = await validateToken(token)
		if (result.isValid) {
			await storeToken(token)
			onSubmit(token)
		} else {
			setToken('')
			setIsInvalid(true)
		}

		setIsLoading(false)
	}

	// Fired if a user confirms a cached token.
	const onConfirmCachedToken = async (item: Item) => {
		if (item.value === 'no') {
			// Clear the selected token so they can enter their own.
			setFoundCachedToken(false)
			setToken('')
		} else {
			// Otherwise submit this token.
			onConfirm()
		}
	}

	return (
		<Box flexDirection="column">
			<Color white>Segment API token:</Color>
			<Color grey>
				{figures.arrowRight} An API token is used to download Tracking Plans from Segment.
			</Color>
			<Color grey>
				{figures.arrowRight} Documentation on generating an API token can be found{' '}
				<Link url="https://segment.com/docs/protocols/typewriter/#api-token-configuration">
					here
				</Link>
				.
			</Color>
			{foundCachedToken && (
				<Box textWrap="wrap" marginRight={2}>
					<Color yellow>
						{figures.arrowRight} A cached token for {workspace} is already in your environment.
					</Color>
				</Box>
			)}
			{!canBeSet && (
				<Box textWrap="wrap" marginRight={2}>
					<Color yellow>
						{figures.arrowRight} A token script has already been configured in your typewriter.yml.
					</Color>
				</Box>
			)}
			<Box marginTop={1}>
				<>
					{/* Loading state */}
					{isLoading && (
						<Color grey>
							<Spinner type="dots" /> Loading...
						</Color>
					)}
					{/* We found a token from a typewriter.yml token script. To let the user change token
					 * in this init command, we'd have to remove their token script. Instead, just tell
					 * the user this and don't let them change their token. */}
					{!isLoading && !canBeSet && (
						<SelectInput items={[{ label: 'Ok!', value: 'ok' }]} onSelect={onConfirm} />
					)}
					{/* We found a token in a ~/.typewriter. Confirm that the user wants to use this token
					 * before continuing. */}
					{!isLoading && canBeSet && foundCachedToken && (
						<SelectInput
							items={[
								{ label: 'Use this token', value: 'yes' },
								{ label: 'No, provide a different token.', value: 'no' },
							]}
							onSelect={onConfirmCachedToken}
						/>
					)}
					{/* We didn't find a token anywhere that they wanted to use, so just prompt the user for one. */}
					{!isLoading && canBeSet && !foundCachedToken && (
						<Box flexDirection="column">
							<Box>
								<Text>{figures.pointer}</Text>{' '}
								<TextInput
									value={token}
									showCursor={true}
									onChange={setToken}
									onSubmit={onConfirm}
									mask="*"
								/>
							</Box>
							{isInvalid && (
								<Box textWrap="wrap" marginLeft={2}>
									<Color red>{figures.cross} Invalid Segment API token.</Color>
								</Box>
							)}
						</Box>
					)}
				</>
			</Box>
		</Box>
	)
}

interface TrackingPlanPromptProps {
	path: string
	token: string
	trackingPlan?: SegmentAPI.TrackingPlan
	onSubmit: (trackingPlan: SegmentAPI.TrackingPlan) => void
}

/** A prompt to identify which Segment programming language a user wants to use. */
const TrackingPlanPrompt: React.FC<TrackingPlanPromptProps> = ({
	path,
	token,
	trackingPlan,
	onSubmit,
}) => {
	const [trackingPlans, setTrackingPlans] = useState<SegmentAPI.TrackingPlan[]>([])
	const trackingPlanPath = join(path, 'plan.json')

	const [isLoading, setIsLoading] = useState(true)

	// Load all Tracking Plans accessible by this API token.
	useEffect(() => {
		;(async () => {
			setTrackingPlans(await fetchAllTrackingPlans({ token }))
			setIsLoading(false)
		})()
	}, [])

	const onSelect = (item: Item) => {
		const trackingPlan = trackingPlans.find(tp => tp.name === item.value)!
		onSubmit(trackingPlan)
	}

	// Sort the Tracking Plan alphabetically by display name.
	const choices = orderBy(
		trackingPlans.map(tp => ({
			label: tp.display_name,
			value: tp.name,
		})),
		'label',
		'asc'
	)
	let initialIndex = choices.findIndex(c => !!trackingPlan && c.value === trackingPlan.name)
	initialIndex = initialIndex === -1 ? 0 : initialIndex

	return (
		<Box flexDirection="column">
			<Color white>Tracking Plan:</Color>
			<Color grey>
				{figures.arrowRight} Typewriter will generate a client from this Tracking Plan.
			</Color>
			<Color grey>
				{figures.arrowRight} This Tracking Plan will be copied to{' '}
				<Color yellow>{trackingPlanPath}</Color>.
			</Color>
			<Box marginTop={1} flexDirection="column">
				{isLoading && (
					<Color grey>
						<Spinner type="dots" /> Loading...
					</Color>
				)}
				{!isLoading && <SelectInput items={choices} onSelect={onSelect} limit={10} />}
			</Box>
		</Box>
	)
}

interface SummaryPromptProps {
	sdk: SDK
	language: Language
	path: string
	trackingPlan: SegmentAPI.TrackingPlan
	onConfirm: () => void
	onRestart: () => void
}

/** A prompt to confirm all of the configured settings with the user. */
const SummaryPrompt: React.FC<SummaryPromptProps> = ({
	sdk,
	language,
	path,
	trackingPlan,
	onConfirm,
	onRestart,
}) => {
	const [isLoading, setIsLoading] = useState(false)

	const onSelect = async (item: Item) => {
		if (item.value === 'lgtm') {
			// Write the updated typewriter.yml config.
			setIsLoading(false)

			let client = ({
				sdk,
				language,
			} as any) as Options
			// Default to ES5 syntax for analytics-node in JS, since node doesn't support things
			// like ES6 modules. TypeScript transpiles for you, so we don't need it there.
			// See https://node.green
			if (sdk === SDK.NODE && language === Language.JAVASCRIPT) {
				client = client as JavaScriptOptions
				client.moduleTarget = 'CommonJS'
				client.scriptTarget = 'ES5'
			}
			const tp = parseTrackingPlanName(trackingPlan.name)
			await setConfig({
				client,
				trackingPlans: [
					{
						name: trackingPlan.display_name,
						id: tp.id,
						workspaceSlug: tp.workspaceSlug,
						path,
					},
				],
			})

			setIsLoading(true)

			onConfirm()
		} else {
			onRestart()
		}
	}

	return (
		<Box flexDirection="column">
			<Color white>Summary:</Color>
			<Box marginLeft={2} flexDirection="column">
				<Box>
					<Box width="40%">
						<Color grey>SDK:</Color>
					</Box>
					<Color yellow>{sdk}</Color>
				</Box>
				<Box>
					<Box width="40%">
						<Color grey>Language;</Color>
					</Box>
					<Color yellow>{language}</Color>
				</Box>
				<Box>
					<Box width="40%">
						<Color grey>Client Path:</Color>
					</Box>
					<Color yellow>{path}</Color>
				</Box>
				<Box>
					<Box width="40%">
						<Color grey>Tracking Plan:</Color>
					</Box>
					<Color yellow>
						<Link url={parseTrackingPlanName(trackingPlan.name).url}>
							{trackingPlan.display_name}
						</Link>
					</Color>
				</Box>
			</Box>
			<Box marginTop={1}>
				{isLoading && (
					<Color grey>
						<Spinner type="dots" /> Loading...
					</Color>
				)}
				{!isLoading && (
					<SelectInput
						items={[{ label: 'Looks good!', value: 'lgtm' }, { label: 'Edit', value: 'edit' }]}
						onSelect={onSelect}
					/>
				)}
			</Box>
		</Box>
	)
}
