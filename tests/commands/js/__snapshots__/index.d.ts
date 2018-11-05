export interface AnalyticsOptions {
  propertyValidation: boolean;
}

export type AnalyticsJSCallback = () => void;

/** A dictionary of options. For example, enable or disable specific destinations for the call. */
export interface SegmentOptions {
  /**
   * Selectivly filter destinations. By default all destinations are enabled.
   * https://segment.com/docs/sources/website/analytics.js/#selecting-destinations
   */
  integrations: { [key: string]: boolean };
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
}
