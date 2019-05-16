#!/usr/bin/env node

import yargs from 'yargs'
import * as commands from './commands'

yargs
	.scriptName('typewriter')
	.epilog(
		'Further Typewriter documentation is available at: https://segment.com/docs/protocols/'
	)
	.command('*', 're-generates your clients', {}, commands.generate)
	.command('init', 'initializes a new typewriter project', {}, commands.init)
	.command(
		'prod',
		'generates production builds for your clients',
		{},
		commands.prod
	)
	.command(
		'update',
		'update events from your Tracking Plan',
		{},
		commands.update
	)
	.command('token', 'prints the current Segment API token', {}, commands.token)
	.help()
	.version().argv
