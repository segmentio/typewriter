#!/usr/bin/env node

import * as yargs from 'yargs'
import { init, prod, update, token, generate } from './commands'

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
		'*',
		'A compiler for generating strongly typed analytics clients via Segment Protocols.',
		args,
		generate
	)
	.command('init', 'initializes a new typewriter project', args, init)
	.command('prod', 'generates production builds for your clients', args, prod)
	.command('update', 'update events from your Tracking Plan', args, update)
	.command('token', 'prints the current Segment API token', args, token)
	.help()
	.version().argv
