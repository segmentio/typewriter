#!/usr/bin/env node
import React from 'react'
import { render } from 'ink'
import { token, version, build } from './commands'
import { reportAnalytics } from './reportAnalytics'
import { Config } from './config'

interface StandardProps {
	configPath: string
	config?: Config
}

export interface CLIArguments {
	/** Any commands passed in to a yargs CLI. */
	_: string[]
	/** An optional path to a typewriter.yml (or directory with a typewriter.yml). **/
	config: string
	/** An optional (hidden) flag for enabling Ink debug mode. */
	debug: boolean
	/** Standard --version flag to print the version of this CLI. */
	version: boolean
}

function toYargsHandler<Props = {}>(
	Command: React.FC<StandardProps & Props>,
	props: Props,
	cliOptions?: { validateDefault?: boolean }
) {
	// Return a closure which yargs will execute if this command is run.
	return async (args: CLIArguments) => {
		// The '*' command is a catch-all. We want to fail the CLI if an unknown command is
		// supplied ('yarn typewriter footothebar'), instead of just running the default command.
		if (
			cliOptions &&
			cliOptions.validateDefault &&
			args._.length !== 0 &&
			!['update', 'u'].includes(args._[0])
		) {
			// TODO: better error reporting here.
			throw new Error(`Unknown command: '${args._[0]}'`)
		}

		// reportAnalytics will report analytics to Segment, while handling any errors thrown by the command.
		await reportAnalytics(args, async (config: Config | undefined) => {
			let Component = Command
			// We override the --version flag from yargs with our own output. If it was supplied, print
			// the `version` component instead.
			if (!!args.version) {
				Component = version
			}

			const { waitUntilExit } = render(
				<Component configPath={args.config} config={config} {...props} />,
				{
					debug: !!args.debug,
				}
			)

			await waitUntilExit()
		})
	}
}

const commandDefaults = {
	builder: {
		config: {
			type: 'string',
			description: 'Path to a typewriter.yml config',
			default: './',
		},
		version: {
			type: 'boolean',
			description: 'Show version number',
			default: false,
		},
		// Don't surface the --debug flag unless testing locally.
		...(process.env.IS_DEVELOPMENT === 'true'
			? {
					debug: {
						type: 'boolean',
						description: "Enable Ink's debug mode",
						default: false,
					},
			  }
			: {}),
	},
}

require('yargs')
	.showHelpOnFail(false)
	.scriptName('npx typewriter')
	.usage(
		'Usage: `$0 [<cmd>] [args]`\n\nA compiler for generating strongly-typed analytics clients using a Segment Tracking Plan. Docs are available at: https://segment.com/docs/protocols/typewriter\n\nTo get started, just run `npx typewriter init`.'
	)
	// TODO!
	// .command(
	// 	['init', 'initialize'],
	// 	'Initializes a new typewriter project',
	// 	args,
	// 	withAnalytics(init)
	// )
	.command({
		...commandDefaults,
		command: ['update', 'u', '*'],
		description: 'Syncs your tracking plans and re-generates a development build of your client',
		handler: toYargsHandler(build, { production: false, update: true }, { validateDefault: true }),
	})
	.command({
		...commandDefaults,
		command: ['build', 'b', 'd', 'dev', 'development'],
		description: 'Generates a development build of your client',
		handler: toYargsHandler(build, { production: false, update: false }),
	})
	.command({
		...commandDefaults,
		command: ['prod', 'p', 'production'],
		description: 'Generates a production build of your client',
		handler: toYargsHandler(build, { production: true, update: false }),
	})
	.command({
		...commandDefaults,
		command: ['token', 'tokens', 't'],
		description: 'Prints your Segment API token',
		handler: toYargsHandler(token, {}),
	})
	.command({
		...commandDefaults,
		command: 'version',
		describe: false,
		handler: toYargsHandler(version, {}),
	})
	.strict(true)
	.help()
	.version(false).argv
