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
  client = Client.js
) {
  // Force draft-04 compatibility mode for Ajv (defaults to 06)
  const ajv = new Ajv({ schemaId: 'auto', allErrors: true, sourceCode: true })
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

  const clientName = client === Client.js ? 'analytics.js' : 'analytics-node'
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
       * @param {Object} config - A configuration object to customize runtime behavior
       */
      constructor(analytics, options = {}) {
        const { propertyValidation = true } = options
        if (!analytics) {
          throw new Error('An instance of ${clientName} must be provided')
        }
        this.analytics = analytics
        this.propertyValidation = propertyValidation
      }
  `

  const trackCalls =
    events.reduce((code, { name, rules }) => {
      const sanitizedFnName = getFnName(name)
      // source is just an object; TODO: an upstream PR to specify the type of `source`
      const compiledValidationSource: any = ajv.compile(preprocessRules(rules)).source
      const compiledValidationFn = compiledValidationSource.code.replace(/return validate;/, '')

      let parameters: string
      let trackCall: string
      let validateCall: string
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

      return `
      ${code}
      ${sanitizedFnName}(${parameters}) {
        if (this.propertyValidation) {
          ${compiledValidationFn}
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

  return prettier.format(outputText, { parser: 'babylon' })
}
