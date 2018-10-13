import {
  quicktype,
  InputData,
  JSONSchemaInput,
  GoRenderer,
  GoTargetLanguage,
  RenderContext
} from 'quicktype-core'

import { getTypedTrackHandler, TrackedEvent, Params } from '../lib'
import * as fs from 'fs'
import * as util from 'util'
const writeFile = util.promisify(fs.writeFile)

export const command = 'gen-go'
export const desc = `Generate a strongly typed Go client from a Tracking Plan`
export { builder } from '../lib'

class AJSTargetLanguage extends GoTargetLanguage {
  constructor() {
    super()
  }

  protected makeRenderer(renderContext: RenderContext, _: { [name: string]: any }): GoRenderer {
    return new AJSWrapperRenderer(this, renderContext, {
      justTypes: false,
      packageName: 'segment'
    })
  }
  protected get defaultIndentation(): string {
    return '  '
  }
}

/**
 * TODO: Implement this renderer
 */
class AJSWrapperRenderer extends GoRenderer {}

export async function genGo(events: TrackedEvent[]) {
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
  const codeContent = await genGo(events)
  return writeFile(`${params.outputPath}/index.go`, codeContent)
})
