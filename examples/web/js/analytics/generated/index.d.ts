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

/**
 * This event is fired when a feed has been viewed
 */
export interface FeedViewed {
  /**
   * The id of the user this feed belongs to
   */
  profileID: string;
}

/**
 * This event is fired when a photo has been viewed
 */
export interface PhotoViewed {
  /**
   * The id of the viewed photo
   */
  photoID: string;
}

/**
 * A user profile has been viewed
 */
export interface ProfileViewed {
  /**
   * The id of the user the profile belongs to
   */
  profileID: string;
}

/**
 * Analytics provides a strongly-typed wrapper around Segment Analytics
 * based on your Tracking Plan.
 */
export default class Analytics {
  constructor(analytics, options?: AnalyticsOptions);

  /**
   * This event is fired when a feed has been viewed
   */
  feedViewed(
    message: FeedViewed,
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;

  /**
   * This event is fired when a photo has been viewed
   */
  photoViewed(
    message: PhotoViewed,
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;

  /**
   * A user profile has been viewed
   */
  profileViewed(
    message: ProfileViewed,
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;
}
