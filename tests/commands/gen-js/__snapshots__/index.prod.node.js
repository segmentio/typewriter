"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Analytics {
  /**
   * Instantiate a wrapper around an analytics library instance
   * @param {Analytics} analytics The analytics-node library to wrap
   * @param {Object} [options] Optional configuration of the Typewriter client
   * @param {function} [options.onError] Error handler fired when run-time validation errors
   *     are raised.
   */
  constructor(analytics, options = {}) {
    this.analytics = analytics || { track: () => null };
  }
  addTypewriterContext(context = {}) {
    return Object.assign({}, context, {
      typewriter: {
        name: "gen-js",
        version: "6.1.1"
      }
    });
  }
  terribleEventName3(message = {}, callback) {
    message = Object.assign({}, message, {
      context: this.addTypewriterContext(message.context),
      event: "42_--terrible==event++name~!3"
    });
    this.analytics.track(message, callback);
  }
  emptyEvent(message = {}, callback) {
    message = Object.assign({}, message, {
      context: this.addTypewriterContext(message.context),
      event: "Empty Event"
    });
    this.analytics.track(message, callback);
  }
  exampleEvent(message = {}, callback) {
    message = Object.assign({}, message, {
      context: this.addTypewriterContext(message.context),
      event: "Example Event"
    });
    this.analytics.track(message, callback);
  }
  draft04Event(message = {}, callback) {
    message = Object.assign({}, message, {
      context: this.addTypewriterContext(message.context),
      event: "Draft-04 Event"
    });
    this.analytics.track(message, callback);
  }
  draft06Event(message = {}, callback) {
    message = Object.assign({}, message, {
      context: this.addTypewriterContext(message.context),
      event: "Draft-06 Event"
    });
    this.analytics.track(message, callback);
  }
}
exports.default = Analytics;
