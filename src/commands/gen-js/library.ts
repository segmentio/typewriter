import { TrackedEvent } from '../../lib'
import { transpileModule, ModuleKind, ScriptTarget } from 'typescript'
import { version } from '../../../package.json'
import { camelCase } from 'lodash'
import * as prettier from 'prettier'
import * as Ajv from 'ajv'
import { command, Client } from '.'
import { preprocessRules } from '../../lib/utils'

function getFnName(eventName: string) {
  return camelCase(eventName.replace(/^\d+/, ''))
}

export function genJS(
  events: TrackedEvent[],
  scriptTarget = ScriptTarget.ESNext,
  moduleKind = ModuleKind.ESNext,
  client = Client.js,
  runtimeValidation = true
) {
  // AJV defaults to JSON Schema draft-07
  const ajv = new Ajv({ schemaId: 'auto', allErrors: true, sourceCode: true })
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

  const clientName = client === Client.js ? 'analytics.js' : 'analytics-node'
  const analyticsValidation = `
  if (!analytics) {
    throw new Error('An instance of ${clientName} must be provided')
  }`
  const fileHeader = `
    const genOptions = (context = {}) => ({
      context: {
        ...context,
        typewriter: {
          name: "${command}",
          version: "${version}"
        }
      }
    })

    export default class Analytics {
      /**
       * Instantiate a wrapper around an analytics library instance
       * @param {Analytics} analytics - The ${clientName} library to wrap
       */
      constructor(analytics) {
        ${runtimeValidation ? analyticsValidation : ''}
        this.analytics = analytics || { track: () => null }
      }
  `

  const trackCalls =
    events.reduce((code, { name, rules }) => {
      const sanitizedFnName = getFnName(name)
      // source is just an object; TODO: an upstream PR to specify the type of `source`
      const compiledValidationSource: any = ajv.compile(preprocessRules(rules)).source
      const compiledValidationFn = compiledValidationSource.code.replace(/return validate;/, '')

      let parameters = ''
      let trackCall = ''
      let validateCall = ''
      if (client === Client.js) {
        parameters = 'props, context'
        trackCall = `this.analytics.track('${name}', props, genOptions(context))`
        validateCall = 'validate({ properties: props })'
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

      const validationCode = `
      ${compiledValidationFn}
      if (!${validateCall}) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }`

      return `
      ${code}
      ${sanitizedFnName}(${parameters}) {
        ${runtimeValidation ? validationCode : ''}
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

  return prettier.format(outputText, { parser: 'babylon' })
}
