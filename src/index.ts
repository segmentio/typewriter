#!/usr/bin/env node

import * as yargs from 'yargs';
import { Params } from './lib';

// tslint:disable-next-line:no-unused-expression
yargs
  .commandDir('commands')
  .demandCommand(1)
  .help()
  .version()
  .check((argv: yargs.Arguments & Params): boolean => {
    // You must provide a JSON Schema, either locally or via the Segment API.
    return Boolean((argv.inputPath) || (argv.token && argv.trackingPlanId && argv.workspaceSlug))
  })
  .argv;
