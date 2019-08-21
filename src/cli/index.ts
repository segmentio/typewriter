#!/usr/bin/env node

import { init, prod, update, token, build } from './commands'
import { version } from '../../package.json'
import { withAnalytics } from './analytics'
import { Arguments, Config } from './types'

const args = {
	config: {
		type: 'string' as 'string',
		describe: 'Optional path to a typewriter.yml config ',
		default: './',
	},
}

// The '*' command is a catch-all. We want to fail the CLI if an unknown command is
// supplied ('yarn typewriter footothebar'), instead of just running the default command.
const withVerifyIsDefault = (f: (args: Arguments, cfg: Config | undefined) => Promise<void>) => {
	return async (args: Arguments, cfg: Config | undefined) => {
		if (args._.length === 0 || ['update', 'u'].includes(args._[0])) {
			return f(args, cfg)
		} else {
			throw new Error(`Unknown command: '${args._[0]}'`)
		}
	}
}

require('yargs')
	.showHelpOnFail(false)
	.scriptName('npx typewriter')
	.usage(
		'Usage: `$0 [<cmd>] [args]`\n\nA compiler for generating strongly-typed analytics clients using a Segment Tracking Plan. Docs are available at: https://segment.com/docs/typewriter\n\nTo get started, just run `npx typewriter init`.'
	)
	.command(
		['init', 'initialize'],
		'Initializes a new typewriter project',
		args,
		withAnalytics(init)
	)
	.command(
		['update', 'u', '*'],
		'Syncs your tracking plans and re-generates a development build of your client',
		args,
		withAnalytics(withVerifyIsDefault(update))
	)
	.command(
		['build', 'b', 'd', 'dev', 'development'],
		'Generates a development build of your client',
		args,
		withAnalytics(build)
	)
	.command(
		['prod', 'p', 'production'],
		'Generates a production build of your client',
		args,
		withAnalytics(prod)
	)
	.command(['token', 't'], 'Prints your Segment API token', args, withAnalytics(token))
	.command({
		command: 'version',
		describe: false,
		handler: withAnalytics(() => console.log(version)),
	})
	.strict(true)
	.help()
	.version().argv
