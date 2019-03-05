import * as omitDeep from 'omit-deep-lodash'
import * as sortKeys from 'sort-keys'
import { flow } from 'lodash'

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
