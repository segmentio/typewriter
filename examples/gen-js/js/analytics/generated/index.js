export default class Analytics {
  /**
   * Instantiate a wrapper around an analytics library instance
   * @param {Analytics} analytics The analytics.js library to wrap
   * @param {Object} [options] Optional configuration of the Typewriter client
   * @param {function} [options.onError] Error handler fired when run-time validation errors
   *     are raised.
   */
  constructor(analytics, options = {}) {
    if (!analytics) {
      throw new Error("An instance of analytics.js must be provided");
    }
    this.analytics = analytics || { track: () => null };
    this.onError =
      options.onError ||
      (error => {
        throw new Error(JSON.stringify(error, null, 2));
      });
  }
  addTypewriterContext(context = {}) {
    return {
      ...context,
      typewriter: {
        name: "gen-js",
        version: "6.1.8"
      }
    };
  }
  feedViewed(props = {}, options = {}, callback) {
    var validate = function(
      data,
      dataPath,
      parentData,
      parentDataProperty,
      rootData
    ) {
      "use strict";
      var vErrors = null;
      var errors = 0;
      if (data && typeof data === "object" && !Array.isArray(data)) {
        var errs__0 = errors;
        var valid1 = true;
        var data1 = data.properties;
        if (data1 !== undefined) {
          var errs_1 = errors;
          if (data1 && typeof data1 === "object" && !Array.isArray(data1)) {
            var errs__1 = errors;
            var valid2 = true;
            if (data1.profile_id === undefined) {
              valid2 = false;
              var err = {
                keyword: "required",
                dataPath: (dataPath || "") + ".properties",
                schemaPath: "#/properties/properties/required",
                params: { missingProperty: "profile_id" },
                message: "should have required property 'profile_id'"
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            } else {
              var errs_2 = errors;
              if (typeof data1.profile_id !== "string") {
                var err = {
                  keyword: "type",
                  dataPath: (dataPath || "") + ".properties.profile_id",
                  schemaPath:
                    "#/properties/properties/properties/profile_id/type",
                  params: { type: "string" },
                  message: "should be string"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid2 = errors === errs_2;
            }
          } else {
            var err = {
              keyword: "type",
              dataPath: (dataPath || "") + ".properties",
              schemaPath: "#/properties/properties/type",
              params: { type: "object" },
              message: "should be object"
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var valid1 = errors === errs_1;
        }
      } else {
        var err = {
          keyword: "type",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/type",
          params: { type: "object" },
          message: "should be object"
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      }
      validate.errors = vErrors;
      return errors === 0;
    };
    if (!validate({ properties: props })) {
      this.onError({
        eventName: "Feed Viewed",
        validationErrors: validate.errors
      });
      return;
    }
    this.analytics.track(
      "Feed Viewed",
      props,
      {
        ...options,
        context: this.addTypewriterContext(options.context)
      },
      callback
    );
  }
  photoViewed(props = {}, options = {}, callback) {
    var validate = function(
      data,
      dataPath,
      parentData,
      parentDataProperty,
      rootData
    ) {
      "use strict";
      var vErrors = null;
      var errors = 0;
      if (data && typeof data === "object" && !Array.isArray(data)) {
        var errs__0 = errors;
        var valid1 = true;
        var data1 = data.properties;
        if (data1 !== undefined) {
          var errs_1 = errors;
          if (data1 && typeof data1 === "object" && !Array.isArray(data1)) {
            var errs__1 = errors;
            var valid2 = true;
            if (data1.photo_id === undefined) {
              valid2 = false;
              var err = {
                keyword: "required",
                dataPath: (dataPath || "") + ".properties",
                schemaPath: "#/properties/properties/required",
                params: { missingProperty: "photo_id" },
                message: "should have required property 'photo_id'"
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            } else {
              var errs_2 = errors;
              if (typeof data1.photo_id !== "string") {
                var err = {
                  keyword: "type",
                  dataPath: (dataPath || "") + ".properties.photo_id",
                  schemaPath:
                    "#/properties/properties/properties/photo_id/type",
                  params: { type: "string" },
                  message: "should be string"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid2 = errors === errs_2;
            }
          } else {
            var err = {
              keyword: "type",
              dataPath: (dataPath || "") + ".properties",
              schemaPath: "#/properties/properties/type",
              params: { type: "object" },
              message: "should be object"
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var valid1 = errors === errs_1;
        }
      } else {
        var err = {
          keyword: "type",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/type",
          params: { type: "object" },
          message: "should be object"
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      }
      validate.errors = vErrors;
      return errors === 0;
    };
    if (!validate({ properties: props })) {
      this.onError({
        eventName: "Photo Viewed",
        validationErrors: validate.errors
      });
      return;
    }
    this.analytics.track(
      "Photo Viewed",
      props,
      {
        ...options,
        context: this.addTypewriterContext(options.context)
      },
      callback
    );
  }
  profileViewed(props = {}, options = {}, callback) {
    var validate = function(
      data,
      dataPath,
      parentData,
      parentDataProperty,
      rootData
    ) {
      "use strict";
      var vErrors = null;
      var errors = 0;
      if (data && typeof data === "object" && !Array.isArray(data)) {
        var errs__0 = errors;
        var valid1 = true;
        var data1 = data.properties;
        if (data1 !== undefined) {
          var errs_1 = errors;
          if (data1 && typeof data1 === "object" && !Array.isArray(data1)) {
            var errs__1 = errors;
            var valid2 = true;
            if (data1.profile_id === undefined) {
              valid2 = false;
              var err = {
                keyword: "required",
                dataPath: (dataPath || "") + ".properties",
                schemaPath: "#/properties/properties/required",
                params: { missingProperty: "profile_id" },
                message: "should have required property 'profile_id'"
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            } else {
              var errs_2 = errors;
              if (typeof data1.profile_id !== "string") {
                var err = {
                  keyword: "type",
                  dataPath: (dataPath || "") + ".properties.profile_id",
                  schemaPath:
                    "#/properties/properties/properties/profile_id/type",
                  params: { type: "string" },
                  message: "should be string"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid2 = errors === errs_2;
            }
          } else {
            var err = {
              keyword: "type",
              dataPath: (dataPath || "") + ".properties",
              schemaPath: "#/properties/properties/type",
              params: { type: "object" },
              message: "should be object"
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var valid1 = errors === errs_1;
        }
      } else {
        var err = {
          keyword: "type",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/type",
          params: { type: "object" },
          message: "should be object"
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      }
      validate.errors = vErrors;
      return errors === 0;
    };
    if (!validate({ properties: props })) {
      this.onError({
        eventName: "Profile Viewed",
        validationErrors: validate.errors
      });
      return;
    }
    this.analytics.track(
      "Profile Viewed",
      props,
      {
        ...options,
        context: this.addTypewriterContext(options.context)
      },
      callback
    );
  }
}
