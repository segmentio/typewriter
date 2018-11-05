import { getTypedTrackHandler } from '../../lib'
import { ModuleKind, ScriptTarget } from 'typescript'
import { builder as defaultBuilder, Params as DefaultParams } from '../../lib'
import * as util from 'util'
import * as fs from 'fs'
const writeFile = util.promisify(fs.writeFile)

import { genJS } from './library'
import { genTSDeclarations } from './typescript'
import { genReasonMLDeclarations } from './reasonml'

export const command = 'gen-js'
export const desc = 'Generate a strongly typed JavaScript analytics.js client'

export enum Client {
  js = 0,
  node = 1
}

export enum Declarations {
  none = 0,
  ts = 1,
  reasonml = 2
}

interface CompilerParams {
  target?: ScriptTarget
  module?: ModuleKind
  client?: string
  declarations?: string
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
    default: 'js',
    choices: Object.keys(Client).filter(k => typeof Client[k as any] === 'number'),
    description: 'Segment analytics library to generate for'
  },
  declarations: {
    type: 'string',
    required: false,
    default: 'none',
    choices: Object.keys(Declarations).filter(k => typeof Declarations[k as any] === 'number'),
    description: 'Type declarations to generate alongside the JS library'
  }
}

export const handler = getTypedTrackHandler(
  async (params: DefaultParams & CompilerParams, { events }) => {
    const files = []

    const jsLibrary = await genJS(events, params.target, params.module, Client[params.client])
    files.push(writeFile(`${params.outputPath}/index.js`, jsLibrary))

    if (Declarations[params.declarations] === Declarations.ts) {
      const declarations = await genTSDeclarations(events, Client[params.client])
      files.push(writeFile(`${params.outputPath}/index.d.ts`, declarations))
    }

    if (Declarations[params.declarations] === Declarations.reasonml) {
      const declarations = await genReasonMLDeclarations(events, Client[params.client])
      files.push(writeFile(`${params.outputPath}/index.re`, declarations))
    }

    return Promise.all(files)
  }
)
