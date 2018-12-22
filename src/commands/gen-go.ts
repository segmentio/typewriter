import {
  InputData,
  JSONSchemaInput,
  GoRenderer,
  GoTargetLanguage,
  RenderContext,
  quicktype
} from 'quicktype-core'

import {
  getTypedTrackHandler,
  TrackedEvent,
  builder as defaultBuilder,
  Params as DefaultParams
} from '../lib'
import * as fs from 'fs'
import * as util from 'util'

const writeFile = util.promisify(fs.writeFile)

export const command = 'gen-go'
export const desc = 'Generate a strongly typed analytics-go client'
export const builder = defaultBuilder

export type Params = DefaultParams

class AnalyticsGoTargetLanguage extends GoTargetLanguage {
  protected makeRenderer(renderContext: RenderContext, _: { [name: string]: any }): GoRenderer {
    return new AnalyticsGoWrapperRenderer(this, renderContext, {
      justTypes: true,
      // TODO: Expose as configuration.
      packageName: 'typewriter'
    })
  }
  protected get defaultIndentation(): string {
    return '    '
  }

  get supportsOptionalClassProperties(): boolean {
    return true
  }
}

class AnalyticsGoWrapperRenderer extends GoRenderer {}

export async function genGo(events: TrackedEvent[]): Promise<string> {
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

  const lang = new AnalyticsGoTargetLanguage()

  const { lines } = await quicktype({ lang, inputData })

  return lines.join('\n')
}

export const handler = getTypedTrackHandler(async (params: Params, { events }) => {
  const file = await genGo(events)

  return writeFile(`${params.outputPath}/main.go`, file)
})
