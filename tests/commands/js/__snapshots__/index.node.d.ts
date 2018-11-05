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
  the0000TerriblePropertyName3?: any;
}

export interface ExampleEvent {
  /**
   * Optional any property
   */
  optionalAny?: any;
  /**
   * Optional array property
   */
  optionalArray?: OptionalArray[];
  /**
   * Optional array (empty) property
   */
  optionalArrayEmpty?: any[];
  /**
   * Optional boolean property
   */
  optionalBoolean?: boolean;
  /**
   * Optional integer property
   */
  optionalInt?: number;
  /**
   * Optional number property
   */
  optionalNumber?: number;
  /**
   * Optional object property
   */
  optionalObject?: OptionalObject;
  /**
   * Optional object (empty) property
   */
  optionalObjectEmpty?: { [key: string]: any };
  /**
   * Optional string property
   */
  optionalString?: string;
  /**
   * Optional string regex property
   */
  optionalStringRegex?: string;
  /**
   * Required any property
   */
  requiredAny: any;
  /**
   * Required array property
   */
  requiredArray: RequiredArray[];
  /**
   * Required array (empty) property
   */
  requiredArrayEmpty: any[];
  /**
   * Required boolean property
   */
  requiredBoolean: boolean;
  /**
   * Required integer property
   */
  requiredInt: number;
  /**
   * Required number property
   */
  requiredNumber: number;
  /**
   * Required object property
   */
  requiredObject: RequiredObject;
  /**
   * Required object (empty) property
   */
  requiredObjectEmpty: { [key: string]: any };
  /**
   * Required string property
   */
  requiredString: string;
  /**
   * Required string regex property
   */
  requiredStringRegex: string;
}

export interface OptionalArray {
  /**
   * Optional sub-property
   */
  optionalSubProperty?: string;
  /**
   * Required sub-property
   */
  requiredSubProperty: string;
}

/**
 * Optional object property
 */
export interface OptionalObject {
  /**
   * Optional sub-property
   */
  optionalSubProperty?: string;
  /**
   * Required sub-property
   */
  requiredSubProperty: string;
}

export interface RequiredArray {
  /**
   * Optional sub-property
   */
  optionalSubProperty?: string;
  /**
   * Required sub-property
   */
  requiredSubProperty: string;
}

/**
 * Required object property
 */
export interface RequiredObject {
  /**
   * Optional sub-property
   */
  optionalSubProperty?: string;
  /**
   * Required sub-property
   */
  requiredSubProperty: string;
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
