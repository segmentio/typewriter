const genOptions = (context = {}) => ({
  context: {
    ...context,
    typewriter: {
      name: "gen-js",
      version: "5.0.0"
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
  terribleEventName3(props, context) {
    this.analytics.track(
      "42_--terrible==event++name~!3",
      props,
      genOptions(context)
    );
  }
  emptyEvent(props, context) {
    this.analytics.track("Empty Event", props, genOptions(context));
  }
  exampleEvent(props, context) {
    this.analytics.track("Example Event", props, genOptions(context));
  }
}
