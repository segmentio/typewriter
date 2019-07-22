import { Arguments, Config } from './types'
import Analytics from 'analytics-node'
import { setTypewriterOptions, commandRun, errorFired } from '../analytics'
import { getConfig, getTokenWithReason } from './config'
import { machineId } from 'node-machine-id'

// Initialize analytics-node + typewriter's typewriter client.
const writeKey = process.env.IS_DEVELOPMENT
	? // Development: https://app.segment.com/segment_prod/sources/typewriter_dev/overview
	  'NwUMoJltCrmiW5gQZyiyvKpESDcwsj1r'
	: // Production: https://app.segment.com/segment_prod/sources/typewriter/overview
	  'ahPefUgNCh3w1BdkWX68vOpVgR2Blm5e'
setTypewriterOptions({
	analytics: new Analytics(writeKey, {
		flushAt: 1,
	}),
})

/** Helper to fetch the name of the current yargs CLI command. */
const getCommand = (args: Arguments) => (args._.length === 0 ? 'update' : args._.join(' '))

/**
 * Helper to generate the shared library properties shared by all analytics calls.
 * See: https://app.segment.com/segment_prod/protocols/libraries/rs_1OL4GFYCh62cOIRi3PJuIOdN7uM
 */
const typewriterLibraryProperties = async (args: Arguments, cfg: Config | undefined) => ({
	/* eslint-disable @typescript-eslint/camelcase */
	client: cfg && {
		language: cfg.client.language,
		sdk: cfg.client.sdk,
	},
	command: getCommand(args),
	is_ci: Boolean(process.env.CI),
	token_method: (await getTokenWithReason(cfg)).reason,
	tracking_plan:
		cfg && cfg.trackingPlans && cfg.trackingPlans.length > 0
			? {
					id: cfg.trackingPlans[0].id,
					workspace_slug: cfg.trackingPlans[0].workspaceSlug,
			  }
			: undefined,
})

/**
 * Helper to fire an `Error Fired` analytics call. Async so that consumers
 * can await this analytics call before re-throwing any errors.
 */
const errorAnalytics = async (
	errorString: string,
	error: Error,
	anonymousId: string,
	args: Arguments,
	cfg: Config | undefined
) => {
	await new Promise(async resolve => {
		errorFired(
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
const getAnonymousId = async (args: Arguments, cfg: Config | undefined) => {
	try {
		return await machineId(false)
	} catch (err) {
		await errorAnalytics('Failed to get anonymous id.', err, 'unknown', args, cfg)
	}

	return 'unknown'
}

/**
 * Decorator for CLI command handlers, in order to fire off standard analytics.
 */
export const withAnalytics = (
	f: (args: Arguments, cfg: Config | undefined) => void | Promise<void>
) => {
	return async (args: Arguments) => {
		const startTime = process.hrtime()

		// Attempt to read a config, if one is available.
		let cfg: Config | undefined
		try {
			cfg = await getConfig(args.config)
		} catch (err) {
			await errorAnalytics(
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
			await f(args, cfg)
		} catch (err) {
			await errorAnalytics(
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
		commandRun({
			properties: {
				...(await typewriterLibraryProperties(args, cfg)),
				duration: Math.round(ms),
			},
			anonymousId: await getAnonymousId(args, cfg),
		})
	}
}
