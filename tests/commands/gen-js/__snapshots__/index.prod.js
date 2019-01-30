export default class Analytics {
  /**
   * Instantiate a wrapper around an analytics library instance
   * @param {Analytics} analytics The analytics.js library to wrap
   * @param {Object} [options] Optional configuration of the Typewriter client
   * @param {function} [options.onError] Error handler fired when run-time validation errors
   *     are raised.
   */
  constructor(analytics, options = {}) {
    this.analytics = analytics || { track: () => null };
    this.onError =
      options.onError ||
      (() => {
        throw new Error(JSON.stringify(errors, null, 2));
      });
  }
  addTypewriterContext(context = {}) {
    return {
      ...context,
      typewriter: {
        name: "gen-js",
        version: "6.0.0"
      }
    };
  }
  terribleEventName3(props = {}, options = {}, callback) {
    this.analytics.track(
      "42_--terrible==event++name~!3",
      props,
      {
        ...options,
        context: this.addTypewriterContext(options.context)
      },
      callback
    );
  }
  emptyEvent(props = {}, options = {}, callback) {
    this.analytics.track(
      "Empty Event",
      props,
      {
        ...options,
        context: this.addTypewriterContext(options.context)
      },
      callback
    );
  }
  exampleEvent(props = {}, options = {}, callback) {
    this.analytics.track(
      "Example Event",
      props,
      {
        ...options,
        context: this.addTypewriterContext(options.context)
      },
      callback
    );
  }
  draft04Event(props = {}, options = {}, callback) {
    this.analytics.track(
      "Draft-04 Event",
      props,
      {
        ...options,
        context: this.addTypewriterContext(options.context)
      },
      callback
    );
  }
  draft06Event(props = {}, options = {}, callback) {
    this.analytics.track(
      "Draft-06 Event",
      props,
      {
        ...options,
        context: this.addTypewriterContext(options.context)
      },
      callback
    );
  }
}
