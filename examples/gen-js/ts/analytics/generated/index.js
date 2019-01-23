const genOptions = (context = {}) => ({
  context: {
    ...context,
    typewriter: {
      name: "gen-js",
      version: "5.1.3"
    }
  }
});
export default class Analytics {
  /**
   * Instantiate a wrapper around an analytics library instance
   * @param {Analytics} analytics - The analytics.js library to wrap
   */
  constructor(analytics) {
    if (!analytics) {
      throw new Error("An instance of analytics.js must be provided");
    }
    this.analytics = analytics || { track: () => null };
  }
  feedViewed(props, context) {
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
      throw new Error(JSON.stringify(validate.errors, null, 2));
    }
    this.analytics.track("Feed Viewed", props, genOptions(context));
  }
  photoViewed(props, context) {
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
      throw new Error(JSON.stringify(validate.errors, null, 2));
    }
    this.analytics.track("Photo Viewed", props, genOptions(context));
  }
  profileViewed(props, context) {
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
      throw new Error(JSON.stringify(validate.errors, null, 2));
    }
    this.analytics.track("Profile Viewed", props, genOptions(context));
  }
}
