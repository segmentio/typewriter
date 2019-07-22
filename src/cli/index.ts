#!/usr/bin/env node

import * as yargs from 'yargs'
import { init, prod, update, token, build } from './commands'
import { version } from '../../package.json'
import { withAnalytics } from './analytics'

const args = {
	config: {
		type: 'string' as 'string',
		describe: 'optional path to a typewriter.yml config',
		default: './',
	},
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
