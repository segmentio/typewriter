import { getTypedTrackHandler, TrackedEvent, Params } from '../lib'
import { camelCase } from 'lodash'
const omitDeep = require('omit-deep-lodash')

import * as prettier from 'prettier'
import * as Ajv from 'ajv'

import * as fs from 'fs'
import * as util from 'util'
const writeFile = util.promisify(fs.writeFile)

export const command = 'gen-js'
export const desc = `Generate an analytics.js wrapper from a Tracking Plan`
export { builder } from '../lib'

function getFnName(eventName: string) {
  return camelCase(eventName).replace(/^\d+/, '')
}

export async function genJS(events: TrackedEvent[]) {
  // Force draft-04 compatibility mode for Ajv (defaults to 06)
  const ajv = new Ajv({ schemaId: 'id', allErrors: true })
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

  const trackCalls = events.reduce((code, { name, rules }) => {
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
      export function ${getFnName(name)}(props, context) {
        if (process.env.NODE_ENV !== 'production') {
          const validate = ${ajv.compile(schema)}
          var valid = validate(props);
          if (!valid) {
            throw new Error(JSON.stringify(validate.errors, null, 2));
          }
        }

        if (context) {
          window.analytics.track('${name}', payload, { context })
        } else {
          window.analytics.track('${name}', payload)
        }
      }
    `
  }, '')

  return Promise.resolve(prettier.format(trackCalls, { parser: 'babylon' }))
}

export const handler = getTypedTrackHandler(async (params: Params, { events }) => {
  const codeContent = await genJS(events)
  return writeFile(`${params.outputPath}/index.js`, codeContent)
})
