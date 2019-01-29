const genOptions = (context = {}) => ({
  context: {
    ...context,
    typewriter: {
      name: "gen-js",
      version: "5.1.8"
    }
  }
});
export default class Analytics {
  /**
   * Instantiate a wrapper around an analytics library instance
   * @param {Analytics} analytics - The analytics.js library to wrap
   */
  constructor(analytics) {
    this.analytics = analytics || { track: () => null };
  }
  terribleEventName3(props = {}, context) {
    this.analytics.track(
      "42_--terrible==event++name~!3",
      props,
      genOptions(context)
    );
  }
  emptyEvent(props = {}, context) {
    this.analytics.track("Empty Event", props, genOptions(context));
  }
  exampleEvent(props = {}, context) {
    this.analytics.track("Example Event", props, genOptions(context));
  }
  draft04Event(props = {}, context) {
    this.analytics.track("Draft-04 Event", props, genOptions(context));
  }
  draft06Event(props = {}, context) {
    this.analytics.track("Draft-06 Event", props, genOptions(context));
  }
}
