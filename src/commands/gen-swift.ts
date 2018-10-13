import {
  quicktype,
  InputData,
  JSONSchemaInput,
  SwiftRenderer,
  SwiftTargetLanguage,
  RenderContext
} from 'quicktype-core'

import { getTypedTrackHandler, TrackedEvent, Params } from '../lib'
import * as fs from 'fs'
import * as util from 'util'
const writeFile = util.promisify(fs.writeFile)

export const command = 'gen-swift'
export const desc = `Generate a strongly typed Swift client from a Tracking Plan`
export { builder } from '../lib'

class AJSTargetLanguage extends SwiftTargetLanguage {
  constructor() {
    super()
  }

  protected makeRenderer(renderContext: RenderContext, _: { [name: string]: any }): SwiftRenderer {
    return new AJSWrapperRenderer(this, renderContext, {
      justTypes: false,
      convenienceInitializers: true,
      urlSession: false,
      alamofire: false,
      namedTypePrefix: 'segment',
      useClasses: false,
      dense: false,
      linux: true,
      accessLevel: 'public',
      protocol: { equatable: false, hashable: false }
    })
  }
  protected get defaultIndentation(): string {
    return '  '
  }
}

/**
 * TODO: Implement this renderer
 */
class AJSWrapperRenderer extends SwiftRenderer {}

export async function genSwift(events: TrackedEvent[]) {
  const inputData = new InputData()

  events.forEach(({ name, rules }) => {
    const schema = {
      $schema: 'http://json-schema.org/draft-04/schema#',
      title: rules.title,
      description: rules.description,
      ...rules.properties.properties
    }

    inputData.addSource(
      'schema',
      { name, uris: [name], schema: JSON.stringify(schema) },
      () => new JSONSchemaInput(undefined)
    )
  })

  const lang = new AJSTargetLanguage()

  const { lines } = await quicktype({
    lang,
    inputData,
    debugPrintGraph: true
  })
  return lines.join('\n')
}

export const handler = getTypedTrackHandler(async (params: Params, { events }) => {
  const codeContent = await genSwift(events)
  return writeFile(`${params.outputPath}/index.swift`, codeContent)
})
