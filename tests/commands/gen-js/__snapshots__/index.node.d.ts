export interface AnalyticsOptions {
  propertyValidation: boolean;
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
  context?: Object;
}

export interface The42_TerribleEventName3 {
  /**
   * Really, don't do this.
   */
  "0000---terrible-property-name~!3"?: any;
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
export default class Analytics {
  constructor(analytics: any, options?: AnalyticsOptions);

  the42TerribleEventName3(
    message: TrackMessage<The42_TerribleEventName3>,
    callback?: AnalyticsNodeCallback
  ): void;

  /**
   * Optional object (empty) property
   *
   * Required object (empty) property
   */
  emptyEvent(
    message: TrackMessage<{ [key: string]: any }>,
    callback?: AnalyticsNodeCallback
  ): void;

  exampleEvent(
    message: TrackMessage<ExampleEvent>,
    callback?: AnalyticsNodeCallback
  ): void;
}
