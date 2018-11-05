import { TrackedEvent } from '../../lib'
import { camelCase } from 'lodash'
import * as prettier from 'prettier'

import {
  quicktype,
  InputData,
  JSONSchemaInput,
  TypeScriptTargetLanguage,
  TypeScriptRenderer,
  RenderContext,
  TargetLanguage
} from 'quicktype-core'
import { modifySource } from 'quicktype-core/dist/Source'
import { OptionValues } from 'quicktype-core/dist/RendererOptions'
import { tsFlowOptions } from 'quicktype-core/dist/language/TypeScriptFlow'

import { Client } from '.'

declare interface Options {
  trackingPlan: string
  client: Client
}

const nodeTopLevels = `export interface Message {
  type: string;
  context: {
    library: {
      name: string;
      version: string;
    },
    [key: string]: any
  };
  _metadata: {
    nodeVersion: string;
    [key: string]: any;
  },
  timestamp?: Date;
  messageId?: string;
  anonymousId: string | number;
  userId: string | number;
}

export interface Data {
  batch: Message[];
  timestamp: Date;
  sentAt: Date;
}

export type AnalyticsNodeCallback = (err: Error, data: Data) => void

export interface TrackMessage<PropertiesType> {
  /** The ID for this user in your database. */
  userId: string | number;
  /** An ID to associated with the user when you don’t know who they are. */
  anonymousId?: string | number;
  /** A dictionary of properties for the event. */
  properties?: PropertiesType;
  /**
   * A Javascript date object representing when the track took place.
   * If the track just happened, leave it out and we’ll use the server’s
   * time. If you’re importing data from the past make sure you to send
   * a timestamp.
   */
  timestamp?: Date;
  /**
   * A dictionary of extra context to attach to the call.
   * https://segment.com/docs/spec/common/#context
   */
  context?: Object;
}`

const ajsTopLevels = `export type AnalyticsJSCallback = () => void

/** A dictionary of options. For example, enable or disable specific destinations for the call. */
export interface SegmentOptions {
  /**
   * Selectivly filter destinations. By default all destinations are enabled.
   * https://segment.com/docs/sources/website/analytics.js/#selecting-destinations
   */
  integrations: { [key: string]: boolean }
}`

const topLevels = `export interface AnalyticsOptions {
  propertyValidation: boolean
}`

/** Target language for a.js TypeScript Declarations */
class AJSTSDeclarationsTargetLanguage extends TypeScriptTargetLanguage {
  private client: Client

  constructor(client: Client) {
    super()

    this.client = client
  }

  protected makeRenderer(
    renderContext: RenderContext,
    _: { [name: string]: any }
  ): TypeScriptRenderer {
    return new AJSTSDeclarationsRenderer(
      this,
      renderContext,
      {
        nicePropertyNames: true,
        runtimeTypecheck: true,
        justTypes: false,
        declareUnions: true
      },
      {
        trackingPlan: 'FooBar',
        client: this.client
      }
    )
  }

  protected get defaultIndentation(): string {
    return '  '
  }
}

/** Renderer for a.js TypeScript declarations. */
class AJSTSDeclarationsRenderer extends TypeScriptRenderer {
  constructor(
    targetLanguage: TargetLanguage,
    renderContext: RenderContext,
    protected readonly options: OptionValues<typeof tsFlowOptions>,
    readonly ajsOptions: Options
  ) {
    super(targetLanguage, renderContext, options)
  }

  protected emitSourceStructure() {
    this.emitAnalyticsCallbackTypes()
    this.ensureBlankLine()

    this.emitTypes()
    this.ensureBlankLine()

    this.emitAnalyticsClass()
  }

  protected emitAnalyticsCallbackTypes() {
    this.emitLine(topLevels)
    this.ensureBlankLine()

    if (this.ajsOptions.client === Client.js) {
      this.emitLine(ajsTopLevels)
    } else if (this.ajsOptions.client === Client.node) {
      this.emitLine(nodeTopLevels)
    }
  }

  protected emitAnalyticsClass() {
    this.emitDescriptionBlock([
      'Analytics provides a strongly-typed wrapper around Segment Analytics',
      'based on your Tracking Plan.'
    ])
    this.emitBlock('export default class Analytics', '', () => {
      this.emitLine('constructor(analytics: any, options?: AnalyticsOptions)')
      this.ensureBlankLine()

      this.emitAnalyticsFunctions()
    })
  }

  protected emitAnalyticsFunctions() {
    this.forEachTopLevel('leading-and-interposing', (t, name) => {
      const camelCaseName = modifySource(camelCase, name)
      this.emitDescription(this.descriptionForType(t))
      if (this.ajsOptions.client === Client.js) {
        this.emitLine([
          camelCaseName,
          '(message: ',
          this.sourceFor(t).source,
          ', options?: SegmentOptions, callback?: AnalyticsJSCallback): void'
        ])
      } else if (this.ajsOptions.client === Client.node) {
        this.emitLine([
          camelCaseName,
          '(message: TrackMessage<',
          this.sourceFor(t).source,
          '>, callback?: AnalyticsNodeCallback): void'
        ])
      }
    })
  }
}

export async function genTSDeclarations(
  events: TrackedEvent[],
  client = Client.js
): Promise<string> {
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

  const lang = new AJSTSDeclarationsTargetLanguage(client)

  const { lines } = await quicktype({
    lang,
    inputData,
    rendererOptions: { 'nice-property-names': 'true' }
  })

  return prettier.format(lines.join('\n'), { parser: 'typescript' })
}
