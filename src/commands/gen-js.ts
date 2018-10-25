import { getTypedTrackHandler, TrackedEvent } from '../lib'
import { transpileModule, ModuleKind, ScriptTarget } from 'typescript'
import { builder as defaultBuilder, Params as DefaultParams } from '../lib'
import { camelCase } from 'lodash'
import * as prettier from 'prettier'
import * as util from 'util'
import * as fs from 'fs'
import * as Ajv from 'ajv'
import * as omitDeep from 'omit-deep-lodash'
import { removeEmptyRequireds } from '../lib/utils'
const writeFile = util.promisify(fs.writeFile)

export const command = 'gen-js'
export const desc = 'Generate a strongly typed JavaScript analytics.js client'

export enum Client {
  js = 0,
  node = 1
}

interface CompilerParams {
  target?: ScriptTarget
  module?: ModuleKind
  client?: string
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
  }
}

function getFnName(eventName: string) {
  return camelCase(eventName.replace(/^\d+/, ''))
}

export async function genJS(
  events: TrackedEvent[],
  scriptTarget = ScriptTarget.ESNext,
  moduleKind = ModuleKind.ESNext,
  client = Client.js
) {
  // Force draft-04 compatibility mode for Ajv (defaults to 06)
  const ajv = new Ajv({ schemaId: 'id', allErrors: true })
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

  const fileHeader = `
    const genOptions = (context = { library: {} }) => ({
      context: {
        ...context,
        library: {
          ...context.library,
          typewriter: {
            name: "${command}",
            version: "${process.env.npm_package_version}"
          }
        }
      }
    })

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
      // In JSON Schema Draft-04, required must have at least one element.
      // Therefore, we strip `required: []` from your rules so this error isn't surfaced.
      removeEmptyRequireds(rules)
      const compiledValidationFn = ajv.compile(omitDeep(rules, 'id'))

      let parameters: string
      let trackCall: string
      let validateCall: string
      if (client === Client.js) {
        parameters = 'props, context'
        trackCall = `this.analytics.track('${name}', props, genOptions(ctx))`
        validateCall = 'validate(props)'
      } else if (client === Client.node) {
        parameters = 'message, callback'
        trackCall = `
        message = {
          ...message,
          ...genOptions(message.context),
          event: '${name}'
        }
        this.analytics.track(message, callback)`
        validateCall = 'validate(message)'
      }

      return `
      ${code}
      ${sanitizedFnName}(${parameters}) {
        if (this.propertyValidation) {
          const validate = ${compiledValidationFn}
          var valid = ${validateCall};
          if (!valid) {
            throw new Error(JSON.stringify(validate.errors, null, 2));
          }
        }
        ${trackCall}
      }
    `
    }, fileHeader) + '} '

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
    const codeContent = await genJS(events, params.target, params.module, Client[params.client])
    return writeFile(`${params.outputPath}/index.js`, codeContent)
  }
)
