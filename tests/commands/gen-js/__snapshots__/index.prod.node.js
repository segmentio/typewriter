"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genOptions = (context = {}) => ({
  context: Object.assign({}, context, {
    typewriter: {
      name: "gen-js",
      version: "5.0.0"
    }
  })
});
class Analytics {
  /**
   * Instantiate a wrapper around an analytics library instance
   * @param {Analytics} analytics - The analytics-node library to wrap
   */
  constructor(analytics) {
    this.analytics = analytics || { track: () => null };
  }
  terribleEventName3(message, callback) {
    message = Object.assign({}, message, genOptions(message.context), {
      event: "42_--terrible==event++name~!3"
    });
    this.analytics.track(message, callback);
  }
  emptyEvent(message, callback) {
    message = Object.assign({}, message, genOptions(message.context), {
      event: "Empty Event"
    });
    this.analytics.track(message, callback);
  }
  exampleEvent(message, callback) {
    message = Object.assign({}, message, genOptions(message.context), {
      event: "Example Event"
    });
    this.analytics.track(message, callback);
  }
}
exports.default = Analytics;
