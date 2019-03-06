import * as omitDeep from 'omit-deep-lodash'
import * as sortKeys from 'sort-keys'
import { flow, get } from 'lodash'
import { InputData, JSONSchemaInput } from 'quicktype-core'
import { TrackedEvent } from './api'

/**
 * Remove all instances of `required: []` from a JSON Schema.
 * These are considered invalid in JSON Schema Draft-04.
 *
 * Modifies object in-place.
 *
 * Inspired by: https://softwareengineering.stackexchange.com/a/323670
 */
function removeEmptyRequireds(obj: any) {
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      const value = obj[property]
      if (value instanceof Array) {
        if (property === 'required' && value instanceof Array && value.length === 0) {
          delete obj[property]
        } else {
          value.forEach(item => removeEmptyRequireds(item))
        }
      } else if (value instanceof Object) {
        removeEmptyRequireds(value)
      }
    }
  }
}

/**
 * Performs pre-processing on a set of JSON Schema rules to prepare
 * them for AJV compilation.
 *
 * @param rules JSON Schema rules
 */
export const preprocessRules = flow(
  // In JSON Schema Draft-04, required fields must have at least one element.
  // Therefore, we strip `required: []` from your rules so this error isn't surfaced.
  (rules: any) => {
    removeEmptyRequireds(rules)
    return rules
  },
  // Enforce a deterministic ordering to reduce verson control deltas.
  (rules: any) => sortKeys(rules, { deep: true }),
  (rules: any) => omitDeep(rules, 'id')
)

/**
 * Generates a QuickType InputData object that contains all JSON Schemas
 * from a set of Events.
 */
export const processEventsForQuickType = (events: TrackedEvent[]) => {
  const inputData = new InputData()

  events.forEach(({ name, rules }) => {
    const schema = {
      $schema: rules.$schema || 'http://json-schema.org/draft-07/schema#',
      title: rules.title,
      description: rules.description,
      ...get(rules, 'properties.properties', {})
    }

    inputData.addSource(
      'schema',
      { name, uris: [name], schema: JSON.stringify(schema) },
      () => new JSONSchemaInput(undefined)
    )
  })

  return inputData
}
