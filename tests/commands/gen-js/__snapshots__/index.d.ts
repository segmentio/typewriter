export type AnalyticsJSCallback = () => void;

/** A dictionary of options. For example, enable or disable specific destinations for the call. */
export interface SegmentOptions {
  /**
   * Selectivly filter destinations. By default all destinations are enabled.
   * https://segment.com/docs/sources/website/analytics.js/#selecting-destinations
   */
  integrations: {
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
export default class Analytics {
  constructor(analytics: any);

  the42TerribleEventName3(
    message: The42_TerribleEventName3,
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;

  /**
   * Optional object (empty) property
   *
   * Required object (empty) property
   */
  emptyEvent(
    message: { [key: string]: any },
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;

  exampleEvent(
    message: ExampleEvent,
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;

  /**
   * Optional object (empty) property
   *
   * Required object (empty) property
   */
  draft04Event(
    message: { [key: string]: any },
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;

  /**
   * Optional object (empty) property
   *
   * Required object (empty) property
   */
  draft06Event(
    message: { [key: string]: any },
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;
}
