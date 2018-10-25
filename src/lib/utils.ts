/**
 * Remove all instances of `required: []` from a JSON Schema.
 * These are considered invalid in JSON Schema Draft-04.
 *
 * Modifies object in-place.
 *
 * Inspired by: https://softwareengineering.stackexchange.com/a/323670
 */
export function removeEmptyRequireds(obj: object) {
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
