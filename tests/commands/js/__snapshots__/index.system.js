System.register([], function(exports_1, context_1) {
  "use strict";
  var Analytics;
  var __moduleName = context_1 && context_1.id;
  return {
    setters: [],
    execute: function() {
      Analytics = class Analytics {
        constructor(analytics) {
          this.analytics = analytics;
        }
        terribleEventName3(props, context) {
          if (process.env.NODE_ENV !== "production") {
            const validate = function(
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
            var valid = validate(props);
            if (!valid) {
              throw new Error(JSON.stringify(validate.errors, null, 2));
            }
          }
          if (context) {
            this.analytics.track("42_--terrible==event++name~!3", props, {
              context
            });
          } else {
            this.analytics.track("42_--terrible==event++name~!3", props);
          }
        }
        emptyEvent(props, context) {
          if (process.env.NODE_ENV !== "production") {
            const validate = function(
              data,
              dataPath,
              parentData,
              parentDataProperty,
              rootData
            ) {
              "use strict";
              var vErrors = null;
              var errors = 0;
              if (!data || typeof data !== "object" || Array.isArray(data)) {
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
            var valid = validate(props);
            if (!valid) {
              throw new Error(JSON.stringify(validate.errors, null, 2));
            }
          }
          if (context) {
            this.analytics.track("Empty Event", props, { context });
          } else {
            this.analytics.track("Empty Event", props);
          }
        }
        exampleEvent(props, context) {
          if (process.env.NODE_ENV !== "production") {
            const validate = function(
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
                if (data["required any"] === undefined) {
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "",
                    schemaPath: "#/required",
                    params: { missingProperty: "required any" },
                    message: "should have required property 'required any'"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var errs__0 = errors;
                var valid1 = true;
                var data1 = data["optional array"];
                if (data1 !== undefined) {
                  var errs_1 = errors;
                  if (Array.isArray(data1)) {
                    var errs__1 = errors;
                    var valid1;
                    for (var i1 = 0; i1 < data1.length; i1++) {
                      var data2 = data1[i1];
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
                          if (
                            typeof data2["optional sub-property"] !== "string"
                          ) {
                            var err = {
                              keyword: "type",
                              dataPath:
                                (dataPath || "") +
                                "['optional array'][" +
                                i1 +
                                "]['optional sub-property']",
                              schemaPath:
                                "#/properties/optional%20array/items/properties/optional%20sub-property/type",
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
                              (dataPath || "") +
                              "['optional array'][" +
                              i1 +
                              "]",
                            schemaPath:
                              "#/properties/optional%20array/items/required",
                            params: {
                              missingProperty: "required sub-property"
                            },
                            message:
                              "should have required property 'required sub-property'"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        } else {
                          var errs_3 = errors;
                          if (
                            typeof data2["required sub-property"] !== "string"
                          ) {
                            var err = {
                              keyword: "type",
                              dataPath:
                                (dataPath || "") +
                                "['optional array'][" +
                                i1 +
                                "]['required sub-property']",
                              schemaPath:
                                "#/properties/optional%20array/items/properties/required%20sub-property/type",
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
                            (dataPath || "") + "['optional array'][" + i1 + "]",
                          schemaPath:
                            "#/properties/optional%20array/items/type",
                          params: { type: "object" },
                          message: "should be object"
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
                      dataPath: (dataPath || "") + "['optional array']",
                      schemaPath: "#/properties/optional%20array/type",
                      params: { type: "array" },
                      message: "should be array"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                if (data["optional array (empty)"] !== undefined) {
                  var errs_1 = errors;
                  if (!Array.isArray(data["optional array (empty)"])) {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "['optional array (empty)']",
                      schemaPath:
                        "#/properties/optional%20array%20(empty)/type",
                      params: { type: "array" },
                      message: "should be array"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                if (data["optional boolean"] !== undefined) {
                  var errs_1 = errors;
                  if (typeof data["optional boolean"] !== "boolean") {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "['optional boolean']",
                      schemaPath: "#/properties/optional%20boolean/type",
                      params: { type: "boolean" },
                      message: "should be boolean"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                var data1 = data["optional int"];
                if (data1 !== undefined) {
                  var errs_1 = errors;
                  if (
                    typeof data1 !== "number" ||
                    data1 % 1 ||
                    data1 !== data1
                  ) {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "['optional int']",
                      schemaPath: "#/properties/optional%20int/type",
                      params: { type: "integer" },
                      message: "should be integer"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                if (data["optional number"] !== undefined) {
                  var errs_1 = errors;
                  if (typeof data["optional number"] !== "number") {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "['optional number']",
                      schemaPath: "#/properties/optional%20number/type",
                      params: { type: "number" },
                      message: "should be number"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                var data1 = data["optional object"];
                if (data1 !== undefined) {
                  var errs_1 = errors;
                  if (
                    data1 &&
                    typeof data1 === "object" &&
                    !Array.isArray(data1)
                  ) {
                    var errs__1 = errors;
                    var valid2 = true;
                    if (data1["optional sub-property"] !== undefined) {
                      var errs_2 = errors;
                      if (typeof data1["optional sub-property"] !== "string") {
                        var err = {
                          keyword: "type",
                          dataPath:
                            (dataPath || "") +
                            "['optional object']['optional sub-property']",
                          schemaPath:
                            "#/properties/optional%20object/properties/optional%20sub-property/type",
                          params: { type: "string" },
                          message: "should be string"
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      }
                      var valid2 = errors === errs_2;
                    }
                    if (data1["required sub-property"] === undefined) {
                      valid2 = false;
                      var err = {
                        keyword: "required",
                        dataPath: (dataPath || "") + "['optional object']",
                        schemaPath: "#/properties/optional%20object/required",
                        params: { missingProperty: "required sub-property" },
                        message:
                          "should have required property 'required sub-property'"
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    } else {
                      var errs_2 = errors;
                      if (typeof data1["required sub-property"] !== "string") {
                        var err = {
                          keyword: "type",
                          dataPath:
                            (dataPath || "") +
                            "['optional object']['required sub-property']",
                          schemaPath:
                            "#/properties/optional%20object/properties/required%20sub-property/type",
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
                      dataPath: (dataPath || "") + "['optional object']",
                      schemaPath: "#/properties/optional%20object/type",
                      params: { type: "object" },
                      message: "should be object"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                var data1 = data["optional object (empty)"];
                if (data1 !== undefined) {
                  var errs_1 = errors;
                  if (
                    !data1 ||
                    typeof data1 !== "object" ||
                    Array.isArray(data1)
                  ) {
                    var err = {
                      keyword: "type",
                      dataPath:
                        (dataPath || "") + "['optional object (empty)']",
                      schemaPath:
                        "#/properties/optional%20object%20(empty)/type",
                      params: { type: "object" },
                      message: "should be object"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                if (data["optional string"] !== undefined) {
                  var errs_1 = errors;
                  if (typeof data["optional string"] !== "string") {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "['optional string']",
                      schemaPath: "#/properties/optional%20string/type",
                      params: { type: "string" },
                      message: "should be string"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                var data1 = data["optional string regex"];
                if (data1 !== undefined) {
                  var errs_1 = errors;
                  if (typeof data1 === "string") {
                    if (!pattern0.test(data1)) {
                      var err = {
                        keyword: "pattern",
                        dataPath:
                          (dataPath || "") + "['optional string regex']",
                        schemaPath:
                          "#/properties/optional%20string%20regex/pattern",
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
                      dataPath: (dataPath || "") + "['optional string regex']",
                      schemaPath: "#/properties/optional%20string%20regex/type",
                      params: { type: "string" },
                      message: "should be string"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                var data1 = data["required array"];
                if (data1 === undefined) {
                  valid1 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "",
                    schemaPath: "#/required",
                    params: { missingProperty: "required array" },
                    message: "should have required property 'required array'"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_1 = errors;
                  if (Array.isArray(data1)) {
                    var errs__1 = errors;
                    var valid1;
                    for (var i1 = 0; i1 < data1.length; i1++) {
                      var data2 = data1[i1];
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
                          if (
                            typeof data2["optional sub-property"] !== "string"
                          ) {
                            var err = {
                              keyword: "type",
                              dataPath:
                                (dataPath || "") +
                                "['required array'][" +
                                i1 +
                                "]['optional sub-property']",
                              schemaPath:
                                "#/properties/required%20array/items/properties/optional%20sub-property/type",
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
                              (dataPath || "") +
                              "['required array'][" +
                              i1 +
                              "]",
                            schemaPath:
                              "#/properties/required%20array/items/required",
                            params: {
                              missingProperty: "required sub-property"
                            },
                            message:
                              "should have required property 'required sub-property'"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        } else {
                          var errs_3 = errors;
                          if (
                            typeof data2["required sub-property"] !== "string"
                          ) {
                            var err = {
                              keyword: "type",
                              dataPath:
                                (dataPath || "") +
                                "['required array'][" +
                                i1 +
                                "]['required sub-property']",
                              schemaPath:
                                "#/properties/required%20array/items/properties/required%20sub-property/type",
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
                            (dataPath || "") + "['required array'][" + i1 + "]",
                          schemaPath:
                            "#/properties/required%20array/items/type",
                          params: { type: "object" },
                          message: "should be object"
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
                      dataPath: (dataPath || "") + "['required array']",
                      schemaPath: "#/properties/required%20array/type",
                      params: { type: "array" },
                      message: "should be array"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                if (data["required array (empty)"] === undefined) {
                  valid1 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "",
                    schemaPath: "#/required",
                    params: { missingProperty: "required array (empty)" },
                    message:
                      "should have required property 'required array (empty)'"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_1 = errors;
                  if (!Array.isArray(data["required array (empty)"])) {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "['required array (empty)']",
                      schemaPath:
                        "#/properties/required%20array%20(empty)/type",
                      params: { type: "array" },
                      message: "should be array"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                if (data["required boolean"] === undefined) {
                  valid1 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "",
                    schemaPath: "#/required",
                    params: { missingProperty: "required boolean" },
                    message: "should have required property 'required boolean'"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_1 = errors;
                  if (typeof data["required boolean"] !== "boolean") {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "['required boolean']",
                      schemaPath: "#/properties/required%20boolean/type",
                      params: { type: "boolean" },
                      message: "should be boolean"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                var data1 = data["required int"];
                if (data1 === undefined) {
                  valid1 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "",
                    schemaPath: "#/required",
                    params: { missingProperty: "required int" },
                    message: "should have required property 'required int'"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_1 = errors;
                  if (
                    typeof data1 !== "number" ||
                    data1 % 1 ||
                    data1 !== data1
                  ) {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "['required int']",
                      schemaPath: "#/properties/required%20int/type",
                      params: { type: "integer" },
                      message: "should be integer"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                if (data["required number"] === undefined) {
                  valid1 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "",
                    schemaPath: "#/required",
                    params: { missingProperty: "required number" },
                    message: "should have required property 'required number'"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_1 = errors;
                  if (typeof data["required number"] !== "number") {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "['required number']",
                      schemaPath: "#/properties/required%20number/type",
                      params: { type: "number" },
                      message: "should be number"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                var data1 = data["required object"];
                if (data1 === undefined) {
                  valid1 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "",
                    schemaPath: "#/required",
                    params: { missingProperty: "required object" },
                    message: "should have required property 'required object'"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_1 = errors;
                  if (
                    data1 &&
                    typeof data1 === "object" &&
                    !Array.isArray(data1)
                  ) {
                    var errs__1 = errors;
                    var valid2 = true;
                    if (data1["optional sub-property"] !== undefined) {
                      var errs_2 = errors;
                      if (typeof data1["optional sub-property"] !== "string") {
                        var err = {
                          keyword: "type",
                          dataPath:
                            (dataPath || "") +
                            "['required object']['optional sub-property']",
                          schemaPath:
                            "#/properties/required%20object/properties/optional%20sub-property/type",
                          params: { type: "string" },
                          message: "should be string"
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      }
                      var valid2 = errors === errs_2;
                    }
                    if (data1["required sub-property"] === undefined) {
                      valid2 = false;
                      var err = {
                        keyword: "required",
                        dataPath: (dataPath || "") + "['required object']",
                        schemaPath: "#/properties/required%20object/required",
                        params: { missingProperty: "required sub-property" },
                        message:
                          "should have required property 'required sub-property'"
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    } else {
                      var errs_2 = errors;
                      if (typeof data1["required sub-property"] !== "string") {
                        var err = {
                          keyword: "type",
                          dataPath:
                            (dataPath || "") +
                            "['required object']['required sub-property']",
                          schemaPath:
                            "#/properties/required%20object/properties/required%20sub-property/type",
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
                      dataPath: (dataPath || "") + "['required object']",
                      schemaPath: "#/properties/required%20object/type",
                      params: { type: "object" },
                      message: "should be object"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                var data1 = data["required object (empty)"];
                if (data1 === undefined) {
                  valid1 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "",
                    schemaPath: "#/required",
                    params: { missingProperty: "required object (empty)" },
                    message:
                      "should have required property 'required object (empty)'"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_1 = errors;
                  if (
                    !data1 ||
                    typeof data1 !== "object" ||
                    Array.isArray(data1)
                  ) {
                    var err = {
                      keyword: "type",
                      dataPath:
                        (dataPath || "") + "['required object (empty)']",
                      schemaPath:
                        "#/properties/required%20object%20(empty)/type",
                      params: { type: "object" },
                      message: "should be object"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                if (data["required string"] === undefined) {
                  valid1 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "",
                    schemaPath: "#/required",
                    params: { missingProperty: "required string" },
                    message: "should have required property 'required string'"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_1 = errors;
                  if (typeof data["required string"] !== "string") {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "['required string']",
                      schemaPath: "#/properties/required%20string/type",
                      params: { type: "string" },
                      message: "should be string"
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid1 = errors === errs_1;
                }
                var data1 = data["required string regex"];
                if (data1 === undefined) {
                  valid1 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "",
                    schemaPath: "#/required",
                    params: { missingProperty: "required string regex" },
                    message:
                      "should have required property 'required string regex'"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_1 = errors;
                  if (typeof data1 === "string") {
                    if (!pattern0.test(data1)) {
                      var err = {
                        keyword: "pattern",
                        dataPath:
                          (dataPath || "") + "['required string regex']",
                        schemaPath:
                          "#/properties/required%20string%20regex/pattern",
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
                      dataPath: (dataPath || "") + "['required string regex']",
                      schemaPath: "#/properties/required%20string%20regex/type",
                      params: { type: "string" },
                      message: "should be string"
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
            var valid = validate(props);
            if (!valid) {
              throw new Error(JSON.stringify(validate.errors, null, 2));
            }
          }
          if (context) {
            this.analytics.track("Example Event", props, { context });
          } else {
            this.analytics.track("Example Event", props);
          }
        }
      };
      exports_1("default", Analytics);
    }
  };
});
