#!/usr/bin/env node

import * as yargs from 'yargs'
import { init, prod, update, token, build } from './commands'
import { version } from '../../package.json'
import { Arguments, Config } from './types'
import Analytics from 'analytics-node'
import { setTypewriterOptions, commandRun } from '../analytics'
import { getConfig } from './config'

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

const args = {
	config: {
		type: 'string' as 'string',
		describe: 'optional path to a typewriter.yml config',
		default: './',
	},
}

const withAnalytics = (f: (args: Arguments, cfg: Config | undefined) => void | Promise<void>) => {
	return async (args: Arguments) => {
		const startTime = process.hrtime()

		// Attempt to read a config, if one is available.
		const cfg = await getConfig(args.config)

		// Run the command itself.
		await f(args, cfg)

		// Record how long this command took.
		const [sec, nsec] = process.hrtime(startTime)
		const ms = sec * 1000 + nsec / 1000000

		// Fire analytics to Segment on typewriter usage.
		const tps = cfg && cfg.trackingPlans.length > 0 ? cfg.trackingPlans : [undefined]
		for (var tp of tps) {
			commandRun({
				properties: {
					/* eslint-disable @typescript-eslint/camelcase */
					client: cfg && {
						language: cfg.client.language,
						sdk: cfg.client.sdk,
					},
					command: args._.length === 0 ? 'update' : args._.join(' '),
					is_ci: Boolean(process.env.CI),
					duration: Math.round(ms),
					tracking_plan: tp && {
						id: tp.id,
						workspace_slug: tp.workspaceSlug,
					},
				},
				anonymousId: 'TODO',
			})
		}
	}
}

yargs
	.scriptName('typewriter')
	.epilog('Further Typewriter documentation is available at: https://segment.com/docs/typewriter/')
	.command(
		['*', 'update'],
		'A compiler for generating strongly typed analytics clients via Segment Protocols.',
		args,
		withAnalytics(update)
	)
	.command(
		['init', 'initialize'],
		'initializes a new typewriter project',
		args,
		withAnalytics(init)
	)
	.command(
		['b', 'build', 'd', 'dev', 'development'],
		'generates a development build of your client',
		args,
		withAnalytics(build)
	)
	.command(
		['p', 'prod', 'production'],
		'generates a production build of your client',
		args,
		withAnalytics(prod)
	)
	.command(
		['u', 'update'],
		"update the event specs in your `plan.json`'s",
		args,
		withAnalytics(update)
	)
	.command(
		['t', 'token'],
		'prints the currently configured Segment API token',
		args,
		withAnalytics(token)
	)
	.command({
		command: 'version',
		describe: false,
		handler: withAnalytics(() => console.log(version)),
	})
	.help()
	.version().argv
