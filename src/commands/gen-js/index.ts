import { getTypedTrackHandler } from '../../lib/cli'
import { ModuleKind, ScriptTarget } from 'typescript'
import { builder as defaultBuilder, Params as DefaultParams } from '../../lib/cli'
import * as util from 'util'
import * as fs from 'fs'
const writeFile = util.promisify(fs.writeFile)

import { genJS } from './library'
import { genTSDeclarations } from './typescript'

export const command = 'gen-js'
export const desc = 'Generate a strongly typed JavaScript analytics.js client'

export enum Client {
  js = 'js',
  node = 'node'
}

export enum Declarations {
  none = 'none',
  ts = 'ts'
}

interface Params extends DefaultParams {
  target?: ScriptTarget
  module?: ModuleKind
  client: keyof typeof Client
  declarations: keyof typeof Declarations
  runtimeValidation: boolean
}

export const builder = {
  ...defaultBuilder,
  target: {
    type: 'string',
    required: false,
    default: 'ESNext',
    choices: Object.keys(ScriptTarget).filter(k => typeof ScriptTarget[k as any] === 'number'),
    description: 'JS Language target'
  },
  module: {
    type: 'string',
    required: false,
    default: 'ESNext',
    choices: Object.keys(ModuleKind).filter(k => typeof ModuleKind[k as any] === 'number'),
    description: 'Module format'
  },
  client: {
    type: 'string',
    required: false,
    default: Client.js,
    choices: Object.keys(Client),
    description: 'Segment analytics library to generate for'
  },
  declarations: {
    type: 'string',
    required: false,
    default: Declarations.none,
    choices: Object.keys(Declarations),
    description: 'Type declarations to generate alongside the JS library'
  },
  runtimeValidation: {
    type: 'boolean',
    default: true,
    required: false,
    description: 'Whether to output runtime validation code'
  }
}

export const handler = getTypedTrackHandler(async (params: Params, { events }) => {
  const files = []

  const jsLibrary = await genJS(
    events,
    params.target,
    params.module,
    Client[params.client],
    params.runtimeValidation
  )
  files.push(writeFile(`${params.outputPath}/index.js`, jsLibrary))

  if (Declarations[params.declarations] === Declarations.ts) {
    const declarations = await genTSDeclarations(events, Client[params.client])
    files.push(writeFile(`${params.outputPath}/index.d.ts`, declarations))
  }

  return Promise.all(files)
})
