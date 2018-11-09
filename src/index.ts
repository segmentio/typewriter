#!/usr/bin/env node

import * as yargs from 'yargs'

// tslint:disable-next-line:no-unused-expression
yargs
  .scriptName('typewriter')
  .commandDir('commands', { recurse: true })
  .demandCommand(1)
  .help()
  .version().argv
