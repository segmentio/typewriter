import { getTypedTrackHandler, TrackedEvent } from '../lib'
import { transpileModule, ModuleKind, ScriptTarget } from 'typescript'
import { builder as defaultBuilder, Params as DefaultParams } from '../lib'
import { camelCase } from 'lodash'
import * as prettier from 'prettier'
import * as util from 'util'
import * as fs from 'fs'
import * as Ajv from 'ajv'
const omitDeep = require('omit-deep-lodash')
const writeFile = util.promisify(fs.writeFile)

export const command = 'gen-js'
export const desc = `Generate an analytics.js wrapper from a Tracking Plan`

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
  }
}

interface CompilerOptions {
  target?: ScriptTarget
  module?: ModuleKind
}

type Params = DefaultParams & CompilerOptions

function getFnName(eventName: string) {
  return camelCase(eventName.replace(/^\d+/, ''))
}

export async function genJS(
  events: TrackedEvent[],
  scriptTarget = ScriptTarget.ESNext,
  moduleKind = ModuleKind.ESNext
) {
  // Force draft-04 compatibility mode for Ajv (defaults to 06)
  const ajv = new Ajv({ schemaId: 'id', allErrors: true })
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

  const classHeader = `
    export default class Analytics {
      constructor(analytics) {
        this.analytics = analytics
      }
  `

  const trackCalls =
    events.reduce((code, { name, rules }) => {
      const schema = omitDeep(
        {
          $schema: 'http://json-schema.org/draft-04/schema#',
          title: rules.title,
          description: rules.description,
          ...rules.properties.properties
        },
        'id'
      )

      return `
      ${code}
      ${getFnName(name)}(props, context) {
        if (process.env.NODE_ENV !== 'production') {
          const validate = ${ajv.compile(schema)}
          var valid = validate(props);
          if (!valid) {
            throw new Error(JSON.stringify(validate.errors, null, 2));
          }
        }
        if (context) {
          this.analytics.track('${name}', props, { context })
        } else {
          this.analytics.track('${name}', props)
        }
      }
    `
    }, classHeader) + '} '

  const { outputText } = transpileModule(trackCalls, {
    compilerOptions: {
      target: scriptTarget,
      module: moduleKind
    }
  })

  return Promise.resolve(prettier.format(outputText, { parser: 'babylon' }))
}

export const handler = getTypedTrackHandler(async (params: Params, { events }) => {
  const codeContent = await genJS(events, params.target, params.module)
  return writeFile(`${params.outputPath}/index.js`, codeContent)
})
