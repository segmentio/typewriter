import { TrackedEvent } from '../../lib/cli'
import { get, camelCase } from 'lodash'
import * as prettier from 'prettier'

import {
  quicktype,
  InputData,
  JSONSchemaInput,
  TypeScriptTargetLanguage,
  TypeScriptRenderer,
  RenderContext,
  TargetLanguage,
  ClassType,
  Type,
  MapType
} from 'quicktype-core'
import { modifySource, MultiWord, singleWord } from 'quicktype-core/dist/Source'
import { OptionValues } from 'quicktype-core/dist/RendererOptions'
import { tsFlowOptions } from 'quicktype-core/dist/language/TypeScriptFlow'
import { utf16StringEscape } from 'quicktype-core/dist/support/Strings'
import { legalizeName } from 'quicktype-core/dist/language/JavaScript'
import { isES3IdentifierStart } from 'quicktype-core/dist/language/JavaScriptUnicodeMaps'
import { AcronymStyleOptions } from 'quicktype-core/dist/support/Acronyms'

import { Client } from '.'
import { processEventsForQuickType } from '../../lib/rules'

declare interface Options {
  client: Client
}

const sharedTopLevels = `/**
 * Context is a dictionary of extra information that provides useful context about a datapoint.
 * @see {@link https://segment.com/docs/spec/common/#context}
 */
export interface Context {
  active?: boolean
  app?: {
    name?: string
    version?: string
    build?: string
  }
  campaign?: {
    name?: string
    source?: string
    medium?: string
    term?: string
    content?: string
  }
  device?: {
    id?: string
    manufacturer?: string
    model?: string
    name?: string
    type?: string
    version?: string
  }
  ip?: string
  locale?: string
  location?: {
    city?: string
    country?: string
    latitude?: string
    longitude?: string
    region?: string
    speed?: string
  }
  network?: {
    bluetooth?: string
    carrier?: string
    cellular?: string
    wifi?: string
  }
  os?: {
    name?: string
    version?: string
  }
  page?: {
    hash?: string
    path?: string
    referrer?: string
    search?: string
    title?: string
    url?: string
  }
  referrer?: {
    type?: string
    name?: string
    url?: string
    link?: string
  }
  screen?: {
    density?: string
    height?: string
    width?: string
  }
  timezone?: string
  groupId?: string
  traits?: {
    [key: string]: any
  }
  userAgent?: string
  [key: string]: any
}`

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
  context?: Context;
  /**
   * A dictionary of destination names that the message should be sent to.
   * By default all destinations are enabled. 'All' is a special key that
   * applies when no key for a specific destination is found.
   * https://segment.com/docs/spec/common/#integrations
   */
  integrations?: {
    All?: boolean
    AppsFlyer?: {
      appsFlyerId: string
    }
    [key: string]: boolean | { [key: string]: string } | undefined
  }
}`

const ajsTopLevels = `export type AnalyticsJSCallback = () => void

/** A dictionary of options. For example, enable or disable specific destinations for the call. */
export interface SegmentOptions {
  /**
   * Selectivly filter destinations. By default all destinations are enabled.
   * https://segment.com/docs/sources/website/analytics.js/#selecting-destinations
   */
  integrations?: {
    All?: boolean
    AppsFlyer?: {
      appsFlyerId: string
    }
    [key: string]: boolean | { [key: string]: string } | undefined
  }
  /**
   * A dictionary of extra context to attach to the call.
   * https://segment.com/docs/spec/common/#context
   */
  context?: Context
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
        declareUnions: true,
        acronymStyle: AcronymStyleOptions.Pascal
      },
      {
        client: this.client
      }
    )
  }

  protected get defaultIndentation(): string {
    return '  '
  }
}

// TODO: Upstream PR to quicktype to make this accessible
function quotePropertyName(original: string): string {
  const escaped = utf16StringEscape(original)
  const quoted = `"${escaped}"`

  if (original.length === 0) {
    return quoted
  } else if (!isES3IdentifierStart(original.codePointAt(0) as number)) {
    return quoted
  } else if (escaped !== original) {
    return quoted
  } else if (legalizeName(original) !== original) {
    return quoted
  } else {
    return original
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

  // Override emitClassBlockBody to emit jsonName instead of legalized name.
  protected emitClassBlockBody(c: ClassType): void {
    this.emitPropertyTable(c, (_, jsonName, p) => {
      const t = p.type
      return [
        [modifySource(quotePropertyName, jsonName), p.isOptional ? '?' : '', ': '],
        [this.sourceFor(t).source, ';']
      ]
    })
  }

  protected emitSourceStructure() {
    this.emitAnalyticsCallbackTypes()
    this.ensureBlankLine()

    this.emitTypes()
    this.ensureBlankLine()

    this.emitAnalyticsClass()
  }

  protected emitAnalyticsCallbackTypes() {
    this.emitLine(sharedTopLevels)

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
    this.emitLine(`
      // From https://github.com/epoberezkin/ajv/blob/0c31c1e2a81e315511c60a0dd7420a72cb181e61/lib/ajv.d.ts#L279
      export interface AjvErrorObject {
        keyword: string;
        dataPath: string;
        schemaPath: string;
        params: object;
        message: string;
        propertyName?: string;
        parentSchema?: object;
        data?: any;
      }

      // An invalid event with its associated collection of validation errors.
      export interface InvalidEvent {
        eventName: string;
        validationErrors: AjvErrorObject[];
      }

      // Options to customize the runtime behavior of a Typewriter client.
      export interface AnalyticsOptions {
        onError(event: InvalidEvent): void;
      }
    `)
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

      // Override sourceFor behavior to disable `{ [key: string]: any }`
      // if no properties are set for an event.
      let type = this.sourceFor(t).source
      if (t instanceof MapType) {
        type = '{}'
      }

      if (this.ajsOptions.client === Client.js) {
        this.emitLine([
          camelCaseName,
          '(props?: ',
          type,
          ', options?: SegmentOptions, callback?: AnalyticsJSCallback): void'
        ])
      } else if (this.ajsOptions.client === Client.node) {
        this.emitLine([
          camelCaseName,
          '(message?: TrackMessage<',
          type,
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
  const { lines } = await quicktype({
    lang: new AJSTSDeclarationsTargetLanguage(client),
    inputData: processEventsForQuickType(events),
    rendererOptions: { 'nice-property-names': 'true' }
  })

  return prettier.format(lines.join('\n'), { parser: 'typescript' })
}
