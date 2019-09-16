import { CLIArguments } from './index'
import Analytics from 'analytics-node'
import typewriter from '../analytics'
import { Config, getConfig, getTokenMethod } from './config'
import { machineId } from 'node-machine-id'

/**
 * Decorator for CLI command handlers, in order to fire off standard analytics.
 */
export async function reportAnalytics(
	args: CLIArguments,
	f: (cfg: Config | undefined) => void | Promise<void>
) {
	const startTime = process.hrtime()

	// Attempt to read a config, if one is available.
	let cfg: Config | undefined
	try {
		cfg = await getConfig(args.config)
	} catch (err) {
		await reportError(
			'Failed to open typewriter.yml config',
			err,
			await getAnonymousId(args, cfg),
			args,
			cfg
		)
		throw err
	}

	// Run the command itself.
	try {
		await f(cfg)
	} catch (err) {
		await reportError(
			`Failed to call ${getCommand(args)} command handler`,
			err,
			await getAnonymousId(args, cfg),
			args,
			cfg
		)
		throw err
	}

	// Record how long this command took.
	const [sec, nsec] = process.hrtime(startTime)
	const ms = sec * 1000 + nsec / 1000000

	// Fire analytics to Segment on typewriter usage.
	typewriter.commandRun({
		properties: {
			...(await typewriterLibraryProperties(args, cfg)),
			duration: Math.round(ms),
		},
		anonymousId: await getAnonymousId(args, cfg),
	})
}

// Initialize analytics-node + typewriter's typewriter client.
const writeKey = process.env.IS_DEVELOPMENT
	? // Development: https://app.segment.com/segment_prod/sources/typewriter_dev/overview
	  'NwUMoJltCrmiW5gQZyiyvKpESDcwsj1r'
	: // Production: https://app.segment.com/segment_prod/sources/typewriter/overview
	  'ahPefUgNCh3w1BdkWX68vOpVgR2Blm5e'

typewriter.setTypewriterOptions({
	analytics: new Analytics(writeKey, {
		flushAt: 1,
	}),
})

/** Helper to fetch the name of the current yargs CLI command. */
function getCommand(args: CLIArguments) {
	return args._.length === 0 ? 'update' : args._.join(' ')
}

/**
 * Helper to generate the shared library properties shared by all analytics calls.
 * See: https://app.segment.com/segment_prod/protocols/libraries/rs_1OL4GFYCh62cOIRi3PJuIOdN7uM
 */
async function typewriterLibraryProperties(args: CLIArguments, cfg: Config | undefined) {
	return {
		/* eslint-disable @typescript-eslint/camelcase */
		client: cfg && {
			language: cfg.client.language,
			sdk: cfg.client.sdk,
		},
		command: getCommand(args),
		is_ci: Boolean(process.env.CI),
		token_method: await getTokenMethod(cfg),
		tracking_plan:
			cfg && cfg.trackingPlans && cfg.trackingPlans.length > 0
				? {
						id: cfg.trackingPlans[0].id,
						workspace_slug: cfg.trackingPlans[0].workspaceSlug,
				  }
				: undefined,
	}
}

/**
 * Helper to fire an `Error Fired` analytics call. Async so that consumers
 * can await this analytics call before re-throwing any errors.
 */
async function reportError(
	errorString: string,
	error: Error,
	anonymousId: string,
	args: CLIArguments,
	cfg: Config | undefined
) {
	await new Promise(async resolve => {
		typewriter.errorFired(
			{
				/* eslint-disable @typescript-eslint/camelcase */
				properties: {
					...(await typewriterLibraryProperties(args, cfg)),
					error_string: errorString,
					// TODO:
					unexpected: true,
					error,
				},
				anonymousId,
			},
			resolve
		)
	})
}

/**
 * We generate an anonymous ID that is unique per user, s.t. we can group analytics from
 * the same user together.
 */
async function getAnonymousId(args: CLIArguments, cfg: Config | undefined) {
	try {
		return await machineId(false)
	} catch (err) {
		await reportError('Failed to get anonymous id.', err, 'unknown', args, cfg)
	}

	return 'unknown'
}
