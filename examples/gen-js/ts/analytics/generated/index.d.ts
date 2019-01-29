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

export interface FeedViewed {
  /**
   * The id of the user this feed belongs to
   */
  profile_id: string;
}

export interface PhotoViewed {
  /**
   * The id of the viewed photo
   */
  photo_id: string;
}

export interface ProfileViewed {
  /**
   * The id of the user the profile belongs to
   */
  profile_id: string;
}

/**
 * Analytics provides a strongly-typed wrapper around Segment Analytics
 * based on your Tracking Plan.
 */
export default class Analytics {
  constructor(analytics: any);

  feedViewed(
    props?: FeedViewed,
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;

  photoViewed(
    props?: PhotoViewed,
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;

  profileViewed(
    props?: ProfileViewed,
    options?: SegmentOptions,
    callback?: AnalyticsJSCallback
  ): void;
}
