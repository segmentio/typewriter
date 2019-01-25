(function(factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports"], factory);
  }
})(function(require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  const genOptions = (context = {}) => ({
    context: {
      ...context,
      typewriter: {
        name: "gen-js",
        version: "5.1.4"
      }
    }
  });
  class Analytics {
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
    terribleEventName3(props, context) {
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
      this.analytics.track(
        "42_--terrible==event++name~!3",
        props,
        genOptions(context)
      );
    }
    emptyEvent(props, context) {
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
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: { missingProperty: "properties" },
              message: "should have required property 'properties'"
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (!data1 || typeof data1 !== "object" || Array.isArray(data1)) {
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
      this.analytics.track("Empty Event", props, genOptions(context));
    }
    exampleEvent(props, context) {
      var pattern0 = new RegExp("FOO|BAR");
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
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: { missingProperty: "properties" },
              message: "should have required property 'properties'"
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (data1 && typeof data1 === "object" && !Array.isArray(data1)) {
              if (data1["required any"] === undefined) {
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "required any" },
                  message: "should have required property 'required any'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var errs__1 = errors;
              var valid2 = true;
              var data2 = data1["optional array"];
              if (data2 !== undefined) {
                var errs_2 = errors;
                if (Array.isArray(data2)) {
                  var errs__2 = errors;
                  var valid2;
                  for (var i2 = 0; i2 < data2.length; i2++) {
                    var data3 = data2[i2];
                    var errs_3 = errors;
                    if (
                      data3 &&
                      typeof data3 === "object" &&
                      !Array.isArray(data3)
                    ) {
                      var errs__3 = errors;
                      var valid4 = true;
                      if (data3["optional sub-property"] !== undefined) {
                        var errs_4 = errors;
                        if (
                          typeof data3["optional sub-property"] !== "string"
                        ) {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties['optional array'][" +
                              i2 +
                              "]['optional sub-property']",
                            schemaPath:
                              "#/properties/properties/properties/optional%20array/items/properties/optional%20sub-property/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3["required sub-property"] === undefined) {
                        valid4 = false;
                        var err = {
                          keyword: "required",
                          dataPath:
                            (dataPath || "") +
                            ".properties['optional array'][" +
                            i2 +
                            "]",
                          schemaPath:
                            "#/properties/properties/properties/optional%20array/items/required",
                          params: { missingProperty: "required sub-property" },
                          message:
                            "should have required property 'required sub-property'"
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      } else {
                        var errs_4 = errors;
                        if (
                          typeof data3["required sub-property"] !== "string"
                        ) {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties['optional array'][" +
                              i2 +
                              "]['required sub-property']",
                            schemaPath:
                              "#/properties/properties/properties/optional%20array/items/properties/required%20sub-property/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                    } else {
                      var err = {
                        keyword: "type",
                        dataPath:
                          (dataPath || "") +
                          ".properties['optional array'][" +
                          i2 +
                          "]",
                        schemaPath:
                          "#/properties/properties/properties/optional%20array/items/type",
                        params: { type: "object" },
                        message: "should be object"
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid3 = errors === errs_3;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['optional array']",
                    schemaPath:
                      "#/properties/properties/properties/optional%20array/type",
                    params: { type: "array" },
                    message: "should be array"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1["optional array (empty)"] !== undefined) {
                var errs_2 = errors;
                if (!Array.isArray(data1["optional array (empty)"])) {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") +
                      ".properties['optional array (empty)']",
                    schemaPath:
                      "#/properties/properties/properties/optional%20array%20(empty)/type",
                    params: { type: "array" },
                    message: "should be array"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1["optional boolean"] !== undefined) {
                var errs_2 = errors;
                if (typeof data1["optional boolean"] !== "boolean") {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['optional boolean']",
                    schemaPath:
                      "#/properties/properties/properties/optional%20boolean/type",
                    params: { type: "boolean" },
                    message: "should be boolean"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1["optional int"];
              if (data2 !== undefined) {
                var errs_2 = errors;
                if (typeof data2 !== "number" || data2 % 1 || data2 !== data2) {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties['optional int']",
                    schemaPath:
                      "#/properties/properties/properties/optional%20int/type",
                    params: { type: "integer" },
                    message: "should be integer"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1["optional number"] !== undefined) {
                var errs_2 = errors;
                if (typeof data1["optional number"] !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['optional number']",
                    schemaPath:
                      "#/properties/properties/properties/optional%20number/type",
                    params: { type: "number" },
                    message: "should be number"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1["optional object"];
              if (data2 !== undefined) {
                var errs_2 = errors;
                if (
                  data2 &&
                  typeof data2 === "object" &&
                  !Array.isArray(data2)
                ) {
                  var errs__2 = errors;
                  var valid3 = true;
                  if (data2["optional sub-property"] !== undefined) {
                    var errs_3 = errors;
                    if (typeof data2["optional sub-property"] !== "string") {
                      var err = {
                        keyword: "type",
                        dataPath:
                          (dataPath || "") +
                          ".properties['optional object']['optional sub-property']",
                        schemaPath:
                          "#/properties/properties/properties/optional%20object/properties/optional%20sub-property/type",
                        params: { type: "string" },
                        message: "should be string"
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid3 = errors === errs_3;
                  }
                  if (data2["required sub-property"] === undefined) {
                    valid3 = false;
                    var err = {
                      keyword: "required",
                      dataPath:
                        (dataPath || "") + ".properties['optional object']",
                      schemaPath:
                        "#/properties/properties/properties/optional%20object/required",
                      params: { missingProperty: "required sub-property" },
                      message:
                        "should have required property 'required sub-property'"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  } else {
                    var errs_3 = errors;
                    if (typeof data2["required sub-property"] !== "string") {
                      var err = {
                        keyword: "type",
                        dataPath:
                          (dataPath || "") +
                          ".properties['optional object']['required sub-property']",
                        schemaPath:
                          "#/properties/properties/properties/optional%20object/properties/required%20sub-property/type",
                        params: { type: "string" },
                        message: "should be string"
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid3 = errors === errs_3;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['optional object']",
                    schemaPath:
                      "#/properties/properties/properties/optional%20object/type",
                    params: { type: "object" },
                    message: "should be object"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1["optional object (empty)"];
              if (data2 !== undefined) {
                var errs_2 = errors;
                if (
                  !data2 ||
                  typeof data2 !== "object" ||
                  Array.isArray(data2)
                ) {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") +
                      ".properties['optional object (empty)']",
                    schemaPath:
                      "#/properties/properties/properties/optional%20object%20(empty)/type",
                    params: { type: "object" },
                    message: "should be object"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1["optional string"] !== undefined) {
                var errs_2 = errors;
                if (typeof data1["optional string"] !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['optional string']",
                    schemaPath:
                      "#/properties/properties/properties/optional%20string/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1["optional string regex"];
              if (data2 !== undefined) {
                var errs_2 = errors;
                if (typeof data2 === "string") {
                  if (!pattern0.test(data2)) {
                    var err = {
                      keyword: "pattern",
                      dataPath:
                        (dataPath || "") +
                        ".properties['optional string regex']",
                      schemaPath:
                        "#/properties/properties/properties/optional%20string%20regex/pattern",
                      params: { pattern: "FOO|BAR" },
                      message: 'should match pattern "FOO|BAR"'
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['optional string regex']",
                    schemaPath:
                      "#/properties/properties/properties/optional%20string%20regex/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1["required array"];
              if (data2 === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "required array" },
                  message: "should have required property 'required array'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (Array.isArray(data2)) {
                  var errs__2 = errors;
                  var valid2;
                  for (var i2 = 0; i2 < data2.length; i2++) {
                    var data3 = data2[i2];
                    var errs_3 = errors;
                    if (
                      data3 &&
                      typeof data3 === "object" &&
                      !Array.isArray(data3)
                    ) {
                      var errs__3 = errors;
                      var valid4 = true;
                      if (data3["optional sub-property"] !== undefined) {
                        var errs_4 = errors;
                        if (
                          typeof data3["optional sub-property"] !== "string"
                        ) {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties['required array'][" +
                              i2 +
                              "]['optional sub-property']",
                            schemaPath:
                              "#/properties/properties/properties/required%20array/items/properties/optional%20sub-property/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3["required sub-property"] === undefined) {
                        valid4 = false;
                        var err = {
                          keyword: "required",
                          dataPath:
                            (dataPath || "") +
                            ".properties['required array'][" +
                            i2 +
                            "]",
                          schemaPath:
                            "#/properties/properties/properties/required%20array/items/required",
                          params: { missingProperty: "required sub-property" },
                          message:
                            "should have required property 'required sub-property'"
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      } else {
                        var errs_4 = errors;
                        if (
                          typeof data3["required sub-property"] !== "string"
                        ) {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties['required array'][" +
                              i2 +
                              "]['required sub-property']",
                            schemaPath:
                              "#/properties/properties/properties/required%20array/items/properties/required%20sub-property/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                    } else {
                      var err = {
                        keyword: "type",
                        dataPath:
                          (dataPath || "") +
                          ".properties['required array'][" +
                          i2 +
                          "]",
                        schemaPath:
                          "#/properties/properties/properties/required%20array/items/type",
                        params: { type: "object" },
                        message: "should be object"
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid3 = errors === errs_3;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['required array']",
                    schemaPath:
                      "#/properties/properties/properties/required%20array/type",
                    params: { type: "array" },
                    message: "should be array"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1["required array (empty)"] === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "required array (empty)" },
                  message:
                    "should have required property 'required array (empty)'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (!Array.isArray(data1["required array (empty)"])) {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") +
                      ".properties['required array (empty)']",
                    schemaPath:
                      "#/properties/properties/properties/required%20array%20(empty)/type",
                    params: { type: "array" },
                    message: "should be array"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1["required boolean"] === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "required boolean" },
                  message: "should have required property 'required boolean'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1["required boolean"] !== "boolean") {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['required boolean']",
                    schemaPath:
                      "#/properties/properties/properties/required%20boolean/type",
                    params: { type: "boolean" },
                    message: "should be boolean"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1["required int"];
              if (data2 === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "required int" },
                  message: "should have required property 'required int'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data2 !== "number" || data2 % 1 || data2 !== data2) {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties['required int']",
                    schemaPath:
                      "#/properties/properties/properties/required%20int/type",
                    params: { type: "integer" },
                    message: "should be integer"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1["required number"] === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "required number" },
                  message: "should have required property 'required number'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1["required number"] !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['required number']",
                    schemaPath:
                      "#/properties/properties/properties/required%20number/type",
                    params: { type: "number" },
                    message: "should be number"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1["required object"];
              if (data2 === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "required object" },
                  message: "should have required property 'required object'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (
                  data2 &&
                  typeof data2 === "object" &&
                  !Array.isArray(data2)
                ) {
                  var errs__2 = errors;
                  var valid3 = true;
                  if (data2["optional sub-property"] !== undefined) {
                    var errs_3 = errors;
                    if (typeof data2["optional sub-property"] !== "string") {
                      var err = {
                        keyword: "type",
                        dataPath:
                          (dataPath || "") +
                          ".properties['required object']['optional sub-property']",
                        schemaPath:
                          "#/properties/properties/properties/required%20object/properties/optional%20sub-property/type",
                        params: { type: "string" },
                        message: "should be string"
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid3 = errors === errs_3;
                  }
                  if (data2["required sub-property"] === undefined) {
                    valid3 = false;
                    var err = {
                      keyword: "required",
                      dataPath:
                        (dataPath || "") + ".properties['required object']",
                      schemaPath:
                        "#/properties/properties/properties/required%20object/required",
                      params: { missingProperty: "required sub-property" },
                      message:
                        "should have required property 'required sub-property'"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  } else {
                    var errs_3 = errors;
                    if (typeof data2["required sub-property"] !== "string") {
                      var err = {
                        keyword: "type",
                        dataPath:
                          (dataPath || "") +
                          ".properties['required object']['required sub-property']",
                        schemaPath:
                          "#/properties/properties/properties/required%20object/properties/required%20sub-property/type",
                        params: { type: "string" },
                        message: "should be string"
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid3 = errors === errs_3;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['required object']",
                    schemaPath:
                      "#/properties/properties/properties/required%20object/type",
                    params: { type: "object" },
                    message: "should be object"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1["required object (empty)"];
              if (data2 === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "required object (empty)" },
                  message:
                    "should have required property 'required object (empty)'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (
                  !data2 ||
                  typeof data2 !== "object" ||
                  Array.isArray(data2)
                ) {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") +
                      ".properties['required object (empty)']",
                    schemaPath:
                      "#/properties/properties/properties/required%20object%20(empty)/type",
                    params: { type: "object" },
                    message: "should be object"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1["required string"] === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "required string" },
                  message: "should have required property 'required string'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1["required string"] !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['required string']",
                    schemaPath:
                      "#/properties/properties/properties/required%20string/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1["required string regex"];
              if (data2 === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "required string regex" },
                  message:
                    "should have required property 'required string regex'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data2 === "string") {
                  if (!pattern0.test(data2)) {
                    var err = {
                      keyword: "pattern",
                      dataPath:
                        (dataPath || "") +
                        ".properties['required string regex']",
                      schemaPath:
                        "#/properties/properties/properties/required%20string%20regex/pattern",
                      params: { pattern: "FOO|BAR" },
                      message: 'should match pattern "FOO|BAR"'
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath:
                      (dataPath || "") + ".properties['required string regex']",
                    schemaPath:
                      "#/properties/properties/properties/required%20string%20regex/type",
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
      this.analytics.track("Example Event", props, genOptions(context));
    }
    draft04Event(props, context) {
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
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: { missingProperty: "properties" },
              message: "should have required property 'properties'"
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (!data1 || typeof data1 !== "object" || Array.isArray(data1)) {
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
      this.analytics.track("Draft-04 Event", props, genOptions(context));
    }
    draft06Event(props, context) {
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
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: { missingProperty: "properties" },
              message: "should have required property 'properties'"
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (!data1 || typeof data1 !== "object" || Array.isArray(data1)) {
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
      this.analytics.track("Draft-06 Event", props, genOptions(context));
    }
  }
  exports.default = Analytics;
});
