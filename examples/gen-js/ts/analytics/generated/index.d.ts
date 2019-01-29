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
  /**
   * A dictionary of extra context to attach to the call.
   * https://segment.com/docs/spec/common/#context
   */
  context: Context;
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
