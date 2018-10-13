import {
  quicktype,
  InputData,
  JSONSchemaInput,
  ObjectiveCTargetLanguage,
  ObjectiveCRenderer,
  RenderContext
} from 'quicktype-core'

import { getTypedTrackHandler, TrackedEvent, Params } from '../lib'
import * as fs from 'fs'
import * as util from 'util'
const writeFile = util.promisify(fs.writeFile)

export const command = 'gen-objc'
export const desc = `Generate a strongly typed Objective-C client from a Tracking Plan`
export { builder } from '../lib'

class AJSTargetLanguage extends ObjectiveCTargetLanguage {
  constructor() {
    super()
  }

  protected makeRenderer(
    renderContext: RenderContext,
    _: { [name: string]: any }
  ): ObjectiveCRenderer {
    return new AJSWrapperRenderer(this, renderContext, {
      extraComments: false,
      justTypes: false,
      marshallingFunctions: true,
      classPrefix: 'segment',
      features: { interface: false, implementation: true }
    })
  }
  protected get defaultIndentation(): string {
    return '  '
  }
}

/**
 * TODO: Implement this renderer
 */
class AJSWrapperRenderer extends ObjectiveCRenderer {}

async function getTS(events: TrackedEvent[]) {
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
  const codeContent = await getTS(events)
  return writeFile(`${params.outputPath}/index.m`, codeContent)
})
