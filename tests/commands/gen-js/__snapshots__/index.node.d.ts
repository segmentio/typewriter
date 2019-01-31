/**
 * Context is a dictionary of extra information that provides useful context about a datapoint.
 * @see {@link https://segment.com/docs/spec/common/#context}
 */
export interface Context {
  active?: boolean;
  app?: {
    name?: string;
    version?: string;
    build?: string;
  };
  campaign?: {
    name?: string;
    source?: string;
    medium?: string;
    term?: string;
    content?: string;
  };
  device?: {
    id?: string;
    manufacturer?: string;
    model?: string;
    name?: string;
    type?: string;
    version?: string;
  };
  ip?: string;
  locale?: string;
  location?: {
    city?: string;
    country?: string;
    latitude?: string;
    longitude?: string;
    region?: string;
    speed?: string;
  };
  network?: {
    bluetooth?: string;
    carrier?: string;
    cellular?: string;
    wifi?: string;
  };
  os?: {
    name?: string;
    version?: string;
  };
  page?: {
    hash?: string;
    path?: string;
    referrer?: string;
    search?: string;
    title?: string;
    url?: string;
  };
  referrer?: {
    type?: string;
    name?: string;
    url?: string;
    link?: string;
  };
  screen?: {
    density?: string;
    height?: string;
    width?: string;
  };
  timezone?: string;
  groupId?: string;
  traits?: {
    [key: string]: any;
  };
  userAgent?: string;
  [key: string]: any;
}
export interface Message {
  type: string;
  context: {
    library: {
      name: string;
      version: string;
    };
    [key: string]: any;
  };
  _metadata: {
    nodeVersion: string;
    [key: string]: any;
  };
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

export type AnalyticsNodeCallback = (err: Error, data: Data) => void;

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
    All?: boolean;
    AppsFlyer?: {
      appsFlyerId: string;
    };
    [key: string]: boolean | { [key: string]: string } | undefined;
  };
}

export interface The42_TerribleEventName3 {
  /**
   * Really, don't do this.
   */
  "0000---terrible-property-name~!3"?: any;
  /**
   * AcronymStyle bug fixed in v5.0.1
   */
  identifier_id?: any;
}

export interface ExampleEvent {
  /**
   * Optional any property
   */
  "optional any"?: any;
  /**
   * Optional array property
   */
  "optional array"?: OptionalArray[];
  /**
   * Optional array (empty) property
   */
  "optional array (empty)"?: any[];
  /**
   * Optional boolean property
   */
  "optional boolean"?: boolean;
  /**
   * Optional integer property
   */
  "optional int"?: number;
  /**
   * Optional number property
   */
  "optional number"?: number;
  /**
   * Optional object property
   */
  "optional object"?: OptionalObject;
  /**
   * Optional object (empty) property
   */
  "optional object (empty)"?: { [key: string]: any };
  /**
   * Optional string property
   */
  "optional string"?: string;
  /**
   * Optional string regex property
   */
  "optional string regex"?: string;
  /**
   * Required any property
   */
  "required any": any;
  /**
   * Required array property
   */
  "required array": RequiredArray[];
  /**
   * Required array (empty) property
   */
  "required array (empty)": any[];
  /**
   * Required boolean property
   */
  "required boolean": boolean;
  /**
   * Required integer property
   */
  "required int": number;
  /**
   * Required number property
   */
  "required number": number;
  /**
   * Required object property
   */
  "required object": RequiredObject;
  /**
   * Required object (empty) property
   */
  "required object (empty)": { [key: string]: any };
  /**
   * Required string property
   */
  "required string": string;
  /**
   * Required string regex property
   */
  "required string regex": string;
}

export interface OptionalArray {
  /**
   * Optional sub-property
   */
  "optional sub-property"?: string;
  /**
   * Required sub-property
   */
  "required sub-property": string;
}

/**
 * Optional object property
 */
export interface OptionalObject {
  /**
   * Optional sub-property
   */
  "optional sub-property"?: string;
  /**
   * Required sub-property
   */
  "required sub-property": string;
}

export interface RequiredArray {
  /**
   * Optional sub-property
   */
  "optional sub-property"?: string;
  /**
   * Required sub-property
   */
  "required sub-property": string;
}

/**
 * Required object property
 */
export interface RequiredObject {
  /**
   * Optional sub-property
   */
  "optional sub-property"?: string;
  /**
   * Required sub-property
   */
  "required sub-property": string;
}

/**
 * Analytics provides a strongly-typed wrapper around Segment Analytics
 * based on your Tracking Plan.
 */

// From https://github.com/epoberezkin/ajv/blob/0c31c1e2a81e315511c60a0dd7420a72cb181e61/lib/ajv.d.ts#L279
interface AjvErrorObject {
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
interface InvalidEvent {
  eventName: string;
  validationErrors: AjvErrorObject[];
}

// Options to customize the runtime behavior of a Typewriter client.
interface AnalyticsOptions {
  onError(event: InvalidEvent): void;
}

export default class Analytics {
  constructor(analytics: any, options?: AnalyticsOptions);

  the42TerribleEventName3(
    message?: TrackMessage<The42_TerribleEventName3>,
    callback?: AnalyticsNodeCallback
  ): void;

  /**
   * Optional object (empty) property
   *
   * Required object (empty) property
   */
  emptyEvent(
    message?: TrackMessage<{ [key: string]: any }>,
    callback?: AnalyticsNodeCallback
  ): void;

  exampleEvent(
    message?: TrackMessage<ExampleEvent>,
    callback?: AnalyticsNodeCallback
  ): void;

  /**
   * Optional object (empty) property
   *
   * Required object (empty) property
   */
  draft04Event(
    message?: TrackMessage<{ [key: string]: any }>,
    callback?: AnalyticsNodeCallback
  ): void;

  /**
   * Optional object (empty) property
   *
   * Required object (empty) property
   */
  draft06Event(
    message?: TrackMessage<{ [key: string]: any }>,
    callback?: AnalyticsNodeCallback
  ): void;
}
