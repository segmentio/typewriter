import { Name } from 'quicktype-core'

/**
 * Generates a raw variant of a QuickType name that can be used
 * as a Segment event name.
 *
 * The name is properly escaped such that it can be placed in a
 * double-quoted string.
 */
export function getRawName(name: Name) {
  return name
    .proposeUnstyledNames(new Map())
    .values()
    .next()
    .value.replace(/"/g, '\\"') // Escape any double quotes.
}
