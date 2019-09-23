#!/usr/bin/env node
import React from 'react'
import { render } from 'ink'
import {
	Token,
	Version,
	Build,
	Help,
	Init,
	ErrorComponent,
	ErrorBoundary,
	ErrorProps,
} from './commands'
import { reportAnalytics } from './reportAnalytics'
import { Config } from './config'

export interface StandardProps {
	configPath: string
	config?: Config
	/** Helper for logging error messages when in Ink debug mode. Otherwise, errors are ignored. */
	logError: (log: any) => void
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
	/** Standard -v flag to print the version of this CLI. */
	v: boolean
	/** Standard --help flag to print help on a command. */
	help: boolean
	/** Standard -h flag to print help on a command. */
	h: boolean
}

function toYargsHandler<P = {}>(
	Command: React.FC<StandardProps & ErrorProps & P>,
	props: P,
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

		const logError = (log: any) => (args.debug ? console.trace(log) : null)
		const f = async (config: Config | undefined) => {
			let Component = Command
			// Certain flags (--version, --help) will overide whatever command was provided.
			if (!!args.version || !!args.v || Command.displayName === Version.displayName) {
				// We override the --version flag from yargs with our own output. If it was supplied, print
				// the `version` component instead.
				Component = Version as typeof Command
			} else if (
				!!args.help ||
				!!args.h ||
				args._.includes('help') ||
				Command.displayName === Help.displayName
			) {
				// Same goes for the --help flag.
				Component = Help as typeof Command
			}

			const { waitUntilExit } = render(
				<ErrorBoundary logError={logError}>
					<Component configPath={args.config} config={config} logError={logError} {...props} />
				</ErrorBoundary>,
				{ debug: !!args.debug }
			)
			await waitUntilExit()
		}

		try {
			// reportAnalytics will execute f() and report analytics to Segment.
			await reportAnalytics(args, f)
		} catch (err) {
			const { waitUntilExit } = render(<ErrorComponent error={err} logError={logError} />, {
				debug: !!args.debug,
			})
			await waitUntilExit()
		}
	}
}

const commandDefaults = {
	builder: {
		config: {
			type: 'string',
			default: './',
		},
		version: {
			type: 'boolean',
			default: false,
		},
		v: {
			type: 'boolean',
			default: false,
		},
		help: {
			type: 'boolean',
			default: false,
		},
		h: {
			type: 'boolean',
			default: false,
		},
		debug: {
			type: 'boolean',
			default: false,
		},
	},
}

require('yargs')
	.command({
		...commandDefaults,
		command: ['init', 'initialize', 'quickstart'],
		handler: toYargsHandler(Init, {}),
	})
	.command({
		...commandDefaults,
		command: ['update', 'u', '*'],
		handler: toYargsHandler(Build, { production: false, update: true }, { validateDefault: true }),
	})
	.command({
		...commandDefaults,
		command: ['build', 'b', 'd', 'dev', 'development'],
		handler: toYargsHandler(Build, { production: false, update: false }),
	})
	.command({
		...commandDefaults,
		command: ['prod', 'p', 'production'],
		handler: toYargsHandler(Build, { production: true, update: false }),
	})
	.command({
		...commandDefaults,
		command: ['token', 'tokens', 't'],
		handler: toYargsHandler(Token, {}),
	})
	.command({
		...commandDefaults,
		command: 'version',
		handler: toYargsHandler(Version, {}),
	})
	.command({
		...commandDefaults,
		command: 'help',
		handler: toYargsHandler(Help, {}),
	})
	.strict(true)
	// We override help + version ourselves.
	.help(false)
	.showHelpOnFail(false)
	.version(false).argv
