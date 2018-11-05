import { TrackedEvent } from '../../lib'

import { Client } from '.'
import { genTSDeclarations } from './typescript'
import * as ReasonablyTyped from 'reasonably-typed'

/**
 * Performs transformations on the generated TS declarations
 * to make them compatible with ReasonablyTyped.
 */
function transformTS(declarations: string): string {
  // Swap export -> declare
  declarations = declarations.replace(/export /g, 'declare ')
  // Remove optional function parameters
  declarations = declarations.replace(/options\?/g, 'options')
  declarations = declarations.replace(/callback\?/g, 'callback')
  // Remove indexers
  declarations = declarations.replace(/^\s*\[key: string\]: any;\n/gm, '')
  // Remove unions
  declarations = declarations.replace(/string \| number/g, 'string')
  // Remove default class
  declarations = declarations.replace(/default class/g, 'export class')

  return declarations
}

export async function genReasonMLDeclarations(
  events: TrackedEvent[],
  client = Client.js
): Promise<string> {
  const declarations = await genTSDeclarations(events, client)
  // Necessary for telling ReasonablyTyped this is a TypeScript declaration file.
  const fileName = 'index.d.ts'
  const bsInterface = ReasonablyTyped.compile(transformTS(declarations), fileName)
  return bsInterface
}
