export default class Analytics {
  /**
   * Instantiate a wrapper around an analytics library instance
   * @param {Analytics} analytics - The analytics.js library to wrap
   */
  constructor(analytics) {
    this.analytics = analytics || { track: () => null };
  }
  addTypewriterContext(context = {}) {
    return {
      ...context,
      typewriter: {
        name: "gen-js",
        version: "5.1.7"
      }
    };
  }
  terribleEventName3(props = {}, options) {
    this.analytics.track("42_--terrible==event++name~!3", props, {
      ...options,
      context: this.addTypewriterContext(options.context)
    });
  }
  emptyEvent(props = {}, options) {
    this.analytics.track("Empty Event", props, {
      ...options,
      context: this.addTypewriterContext(options.context)
    });
  }
  exampleEvent(props = {}, options) {
    this.analytics.track("Example Event", props, {
      ...options,
      context: this.addTypewriterContext(options.context)
    });
  }
  draft04Event(props = {}, options) {
    this.analytics.track("Draft-04 Event", props, {
      ...options,
      context: this.addTypewriterContext(options.context)
    });
  }
  draft06Event(props = {}, options) {
    this.analytics.track("Draft-06 Event", props, {
      ...options,
      context: this.addTypewriterContext(options.context)
    });
  }
}
