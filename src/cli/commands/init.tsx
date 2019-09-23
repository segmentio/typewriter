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
import { orderBy } from 'lodash'
import { Build } from './build'
import Fuse from 'fuse.js'
import { StandardProps } from '../index'
import { ErrorProps } from './error'

interface Props extends StandardProps, ErrorProps {}

const readir = promisify(fs.readdir)

export const Init: React.FC<Props> = props => {
	const { configPath, config } = props

	const [step, setStep] = useState(0)
	const [sdk, setSDK] = useState(SDK.WEB)
	const [language, setLanguage] = useState(Language.JAVASCRIPT)
	const [path, setPath] = useState('')
	const [tokenMetadata, setTokenMetadata] = useState({
		token: '',
		workspace: undefined as SegmentAPI.Workspace | undefined,
	})
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
		<Box
			minHeight={20}
			marginLeft={2}
			marginRight={2}
			marginTop={1}
			marginBottom={1}
			flexDirection="column"
		>
			<Header />
			{step === 0 && <ConfirmationPrompt onSubmit={onNext} />}
			{step === 1 && <SDKPrompt step={step} sdk={sdk} onSubmit={withNextStep(setSDK)} />}
			{step === 2 && (
				<LanguagePrompt
					step={step}
					sdk={sdk}
					language={language}
					onSubmit={withNextStep(setLanguage)}
				/>
			)}
			{step === 3 && (
				<APITokenPrompt step={step} config={config} onSubmit={withNextStep(setTokenMetadata)} />
			)}
			{step === 4 && (
				<TrackingPlanPrompt
					step={step}
					token={tokenMetadata.token}
					trackingPlan={trackingPlan}
					onSubmit={withNextStep(setTrackingPlan)}
				/>
			)}
			{step === 5 && <PathPrompt step={step} path={path} onSubmit={withNextStep(setPath)} />}
			{step === 6 && (
				<SummaryPrompt
					step={step}
					sdk={sdk}
					language={language}
					path={path}
					token={tokenMetadata.token}
					workspace={tokenMetadata.workspace!}
					trackingPlan={trackingPlan!}
					onConfirm={onNext}
					onRestart={onRestart}
				/>
			)}
			{step === 7 && <Build {...props} production={false} update={true} />}
			{/* TODO: step 8 where we show an example script showing how to import typewriter */}
		</Box>
	)
}

const Header: React.FC = () => {
	return (
		<Box flexDirection="column">
			<Box width={80} textWrap="wrap" marginBottom={4}>
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

	const tips = ['Hit return to continue.']

	return (
		<Step name={text || 'Ready'} question={true} tips={tips}>
			<SelectInput items={items} onSelect={onSubmit} />
		</Step>
	)
}

interface SDKPromptProps {
	step: number
	sdk: SDK
	onSubmit: (sdk: SDK) => void
}

/** A prompt to identify which Segment SDK a user wants to use. */
const SDKPrompt: React.FC<SDKPromptProps> = ({ step, sdk, onSubmit }) => {
	const items: Item[] = [
		{ label: 'Web (analytics.js)', value: SDK.WEB },
		{ label: 'Node.js (analytics-node)', value: SDK.NODE },
		{ label: 'iOS (analytics-ios)', value: SDK.IOS },
	]
	const initialIndex = items.findIndex(i => i.value === sdk)

	const onSelect = (item: Item) => {
		onSubmit(item.value as SDK)
	}

	const tips = [
		'Use your arrow keys to select.',
		'Typewriter clients are strongly-typed wrappers around a Segment analytics SDK.',
		<Text key="sdk-docs">
			To learn more about {"Segment's"} SDKs, see the{' '}
			<Link url="https://segment.com/docs/sources">documentation</Link>.
		</Text>,
	]

	return (
		<Step name="Choose a SDK" step={step} tips={tips}>
			<SelectInput items={items} initialIndex={initialIndex} onSelect={onSelect} />
		</Step>
	)
}

interface LanguagePromptProps {
	step: number
	sdk: SDK
	language: Language
	onSubmit: (language: Language) => void
}

/** A prompt to identify which Segment programming language a user wants to use. */
const LanguagePrompt: React.FC<LanguagePromptProps> = ({ step, sdk, language, onSubmit }) => {
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
		<Step name="Choose a language" step={step}>
			<SelectInput items={items} initialIndex={initialIndex} onSelect={onSelect} />
		</Step>
	)
}

interface PathPromptProps {
	step: number
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
		const directoryBlocklist = ['node_modules']
		return files
			.filter(f => f.isDirectory())
			.filter(f => !f.name.startsWith('.'))
			.filter(f => !directoryBlocklist.some(b => f.name.startsWith(b)))
			.map(f => join(path, f.name))
			.filter(f => normalize(f).startsWith(normalize(path).replace(/^\.\/?/, '')))
	}

	const isPathEmpty = ['', '.', './'].includes(path)
	const directories = new Set()

	// First look for all directories in the same directory as the current query path.
	const parentPath = join(path, isPathEmpty || path.endsWith('/') ? '.' : '..')
	const parentDirectories = await listDirectories(parentPath)
	parentDirectories.forEach(f => directories.add(f))

	const queryPath = join(parentPath, path)
	// Next, if the current query IS a directory, then we want to prioritize results from inside that directory.
	if (directories.has(queryPath)) {
		const queryDirectories = await listDirectories(queryPath)
		queryDirectories.forEach(f => directories.add(f))
	}

	// Otherwise, show results from inside any other directories at the level of the current query path.
	for (const dirPath of parentDirectories) {
		if (directories.size >= 10) {
			break
		}

		const otherDirectories = await listDirectories(dirPath)
		otherDirectories.forEach(f => directories.add(f))
	}

	// Now sort these directories by the query path.
	var fuse = new Fuse([...directories].map(d => ({ name: d })), { keys: ['name'] })
	return isPathEmpty ? [...directories] : fuse.search(path).map(d => d.name)
}

/** A prompt to identify where to store the new client on the user's filesystem. */
const PathPrompt: React.FC<PathPromptProps> = ({ step, path: initialPath, onSubmit }) => {
	const [path, setPath] = useState(initialPath)
	const [directories, setDirectories] = useState<string[]>([])

	// Fetch a list of directories, filtering by the supplied path.
	useEffect(() => {
		;(async () => {
			let directories: string[] = []
			try {
				directories = await filterDirectories(path)
			} catch (err) {
				console.error(err)
			}

			setDirectories(directories)
		})()
	}, [path])

	const tips = [
		'The generated client will be stored in this directory.',
		'Start typing to filter existing directories. Hit return to submit.',
		'Directories will be automatically created, if needed.',
	]

	const onSubmitPath = () => {
		onSubmit(normalize(path))
	}

	const isNewDirectory =
		!['', '.', './'].includes(normalize(path)) && !directories.includes(normalize(path))
	const directoryRows: (string | JSX.Element)[] = isNewDirectory
		? [
				<Text key="new-directory">
					{path} <Color blue>(new)</Color>
				</Text>,
		  ]
		: []
	directoryRows.push(...directories.slice(0, 10 - directoryRows.length))

	return (
		<Step name="Enter a directory" step={step} tips={tips}>
			<Box>
				<Text>{figures.pointer}</Text>{' '}
				<TextInput value={path} showCursor={true} onChange={setPath} onSubmit={onSubmitPath} />
			</Box>
			<Box height={10} marginLeft={2} flexDirection="column">
				{directoryRows.map((d, i) => (
					<Color key={i} grey>
						{d}
					</Color>
				))}
			</Box>
		</Step>
	)
}

interface APITokenPromptProps {
	step: number
	config?: Config
	onSubmit: (tokenMetadata: { token: string; workspace: SegmentAPI.Workspace }) => void
}

/** A prompt to walk a user through getting a new Segment API token. */
const APITokenPrompt: React.FC<APITokenPromptProps> = ({ step, config, onSubmit }) => {
	const [token, setToken] = useState('')
	const [canBeSet, setCanBeSet] = useState(true)
	const [workspace, setWorkspace] = useState<SegmentAPI.Workspace>()
	const [isLoading, setIsLoading] = useState(true)
	const [isInvalid, setIsInvalid] = useState(false)
	const [foundCachedToken, setFoundCachedToken] = useState(false)

	useEffect(() => {
		;(async () => {
			const tokens = await listTokens(config)
			const method = await getTokenMethod(config)
			const token = method === tokens.script.method ? tokens.script : tokens.file

			setToken(token.token || '')
			setIsInvalid(false)
			if (token.workspace) {
				setWorkspace(token.workspace)
			}
			setFoundCachedToken(!!token.token)
			setIsLoading(false)
			// If the user already has a typewriter.yml with a valid token,
			// then let the user know that they can't overwrite it.
			setCanBeSet(method === 'file')
		})()
	}, [])

	// Fired after a user enters a token.
	const onConfirm = async () => {
		// Validate whether the entered token is a valid Segment API token.
		setIsLoading(true)

		const result = await validateToken(token)
		if (result.isValid) {
			await storeToken(token)
			onSubmit({ token, workspace: workspace! })
		} else {
			setToken('')
			setIsInvalid(true)
			setIsLoading(false)
		}
	}

	// Fired if a user confirms a cached token.
	const onConfirmCachedToken = async (item: Item) => {
		if (item.value === 'no') {
			// Clear the selected token so they can enter their own.
			setFoundCachedToken(false)
			setToken('')
			setIsInvalid(false)
		} else {
			// Otherwise submit this token.
			await onConfirm()
		}
	}

	const tips = [
		'An API token is used to download Tracking Plans from Segment.',
		<Text key="api-token-docs">
			Documentation on generating an API token can be found{' '}
			<Link url="https://segment.com/docs/protocols/typewriter/#api-token-configuration">here</Link>
			.
		</Text>,
	]

	if (foundCachedToken) {
		tips.push(
			<Color yellow>A cached token for {workspace!.name} is already in your environment.</Color>
		)
	}

	return (
		<Step name="Enter a Segment API token" step={step} isLoading={isLoading} tips={tips}>
			{/* We found a token from a typewriter.yml token script. To let the user change token
			 * in this init command, we'd have to remove their token script. Instead, just tell
			 * the user this and don't let them change their token. */}
			{!canBeSet && <SelectInput items={[{ label: 'Ok!', value: 'ok' }]} onSelect={onConfirm} />}
			{/* We found a token in a ~/.typewriter. Confirm that the user wants to use this token
			 * before continuing. */}
			{canBeSet && foundCachedToken && (
				<SelectInput
					items={[
						{ label: 'Use this token', value: 'yes' },
						{ label: 'No, provide a different token.', value: 'no' },
					]}
					onSelect={onConfirmCachedToken}
				/>
			)}
			{/* We didn't find a token anywhere that they wanted to use, so just prompt the user for one. */}
			{canBeSet && !foundCachedToken && (
				<Box flexDirection="column">
					<Box>
						<Text>{figures.pointer}</Text>{' '}
						<TextInput
							value={token}
							// See: https://github.com/vadimdemedes/ink-text-input/issues/41
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
		</Step>
	)
}

interface TrackingPlanPromptProps {
	step: number
	token: string
	trackingPlan?: SegmentAPI.TrackingPlan
	onSubmit: (trackingPlan: SegmentAPI.TrackingPlan) => void
}

/** A prompt to identify which Segment Tracking Plan a user wants to use. */
// Needs an empty state — allows users to create a Tracking Plan, then a reload button to refetch
const TrackingPlanPrompt: React.FC<TrackingPlanPromptProps> = ({
	step,
	token,
	trackingPlan,
	onSubmit,
}) => {
	const [trackingPlans, setTrackingPlans] = useState<SegmentAPI.TrackingPlan[]>([])
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

	const tips = [
		'Typewriter will generate a client from this Tracking Plan.',
		<Text key="plan-path">
			This Tracking Plan is saved locally in a <Color yellow>plan.json</Color> file.
		</Text>,
	]

	return (
		<Step name="Tracking Plan" tips={tips} step={step} isLoading={isLoading}>
			<SelectInput items={choices} onSelect={onSelect} initialIndex={initialIndex} limit={10} />
		</Step>
	)
}

interface SummaryPromptProps {
	step: number
	sdk: SDK
	language: Language
	path: string
	token: string
	workspace: SegmentAPI.Workspace
	trackingPlan: SegmentAPI.TrackingPlan
	onConfirm: () => void
	onRestart: () => void
}

/** A prompt to confirm all of the configured settings with the user. */
const SummaryPrompt: React.FC<SummaryPromptProps> = ({
	step,
	sdk,
	language,
	path,
	token,
	workspace,
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
			} as unknown) as Options
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

	const summaryRows = [
		{ label: 'SDK', value: sdk },
		{ label: 'Language', value: language },
		{ label: 'Directory', value: path },
		{ label: 'API Token', value: `${workspace.name} (${token.slice(0, 10)}...)` },
		{
			label: 'Tracking Plan',
			value: (
				<Link url={parseTrackingPlanName(trackingPlan.name).url}>{trackingPlan.display_name}</Link>
			),
		},
	]

	const summary = (
		<Box flexDirection="column">
			{summaryRows.map(r => (
				<Box key={r.label}>
					<Box width={20}>
						<Color grey>{r.label}:</Color>
					</Box>
					<Color yellow>{r.value}</Color>
				</Box>
			))}
		</Box>
	)

	return (
		<Step name="Summary" step={step} description={summary} isLoading={isLoading}>
			<SelectInput
				items={[{ label: 'Looks good!', value: 'lgtm' }, { label: 'Edit', value: 'edit' }]}
				onSelect={onSelect}
			/>
		</Step>
	)
}

interface StepProps {
	name: string
	step?: number
	question?: boolean
	isLoading?: boolean
	description?: JSX.Element
	tips?: (string | JSX.Element)[]
}

const Step: React.FC<StepProps> = ({
	step,
	name,
	isLoading = false,
	question = false,
	description,
	tips,
	children,
}) => {
	return (
		<Box flexDirection="column">
			<Box flexDirection="row" width={80} justifyContent="space-between">
				<Box>
					<Color white>
						{name}
						{question ? '?' : ':'}
					</Color>
				</Box>
				{step && (
					<Box>
						<Color yellow>[{step}/6]</Color>
					</Box>
				)}
			</Box>
			<Box marginLeft={1} flexDirection="column">
				{tips &&
					tips.map((t, i) => (
						<Color grey key={i}>
							{figures.arrowRight} {t}
						</Color>
					))}
				{description}
				<Box marginTop={1} flexDirection="column">
					{isLoading && (
						<Color grey>
							<Spinner type="dots" /> Loading...
						</Color>
					)}
					{!isLoading && children}
				</Box>
			</Box>
		</Box>
	)
}
