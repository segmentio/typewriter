import { getTypedTrackHandler, TrackedEvent } from '../lib'
import { transpileModule, ModuleKind, ScriptTarget } from 'typescript'
import { builder as defaultBuilder, Params as DefaultParams } from '../lib'
import { camelCase } from 'lodash'
import * as prettier from 'prettier'
import * as util from 'util'
import * as fs from 'fs'
import * as Ajv from 'ajv'
import * as omitDeep from 'omit-deep-lodash'
const writeFile = util.promisify(fs.writeFile)

export const command = 'gen-js'
export const desc = 'Generate a strongly typed JavaScript analytics.js client'

interface CompilerParams {
  target?: ScriptTarget
  module?: ModuleKind
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
  }
}

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
      /**
       * Instantiate a wrapper around an analytics library instance
       * @param {Analytics} analytics - The ajs or analytics-node library to wrap
       * @param {Object} config - A configuration object to customize runtime behavior
       */
      constructor(analytics, options = {}) {
        const { propertyValidation = true } = options
        if (!analytics) {
          throw new Error('An instance of analytics.js or analytics-node must be provided')
        }
        this.analytics = analytics
        this.propertyValidation = propertyValidation
      }
  `
  const trackCalls =
    events.reduce((code, { name, rules }) => {
      const sanitizedFnName = getFnName(name)
      const compiledValidationFn = ajv.compile(omitDeep(rules, 'id'))

      return `
      ${code}
      ${sanitizedFnName}(props, context) {
        if (this.propertyValidation) {
          const validate = ${compiledValidationFn}
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

export const handler = getTypedTrackHandler(
  async (params: DefaultParams & CompilerParams, { events }) => {
    const codeContent = await genJS(events, params.target, params.module)
    return writeFile(`${params.outputPath}/index.js`, codeContent)
  }
)
