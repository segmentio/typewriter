const genOptions = (context = { library: {} }) => ({
  context: {
    ...context,
    library: {
      ...context.library,
      typewriter: {
        name: "gen-js",
        version: "3.2.1"
      }
    }
  }
});
export default class Analytics {
  /**
   * Instantiate a wrapper around an analytics library instance
   * @param {Analytics} analytics - The ajs or analytics-node library to wrap
   * @param {Object} config - A configuration object to customize runtime behavior
   */
  constructor(analytics, options = {}) {
    const { propertyValidation = true } = options;
    if (!analytics) {
      throw new Error(
        "An instance of analytics.js or analytics-node must be provided"
      );
    }
    this.analytics = analytics;
    this.propertyValidation = propertyValidation;
  }
  cartViewed(props, context) {
    if (this.propertyValidation) {
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
              var errs__1 = errors;
              var valid2 = true;
              if (data1.currency !== undefined) {
                var errs_2 = errors;
                if (typeof data1.currency !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.currency",
                    schemaPath:
                      "#/properties/properties/properties/currency/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1.products;
              if (data2 === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "products" },
                  message: "should have required property 'products'"
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
                      if (data3.coupon !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.coupon !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].coupon",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/coupon/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.grape !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.grape !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].grape",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/grape/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.wine_type !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.wine_type !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].wine_type",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/wine_type/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.sku !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.sku !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].sku",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/sku/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.maturity === undefined) {
                        valid4 = false;
                        var err = {
                          keyword: "required",
                          dataPath:
                            (dataPath || "") +
                            ".properties.products[" +
                            i2 +
                            "]",
                          schemaPath:
                            "#/properties/properties/properties/products/items/required",
                          params: { missingProperty: "maturity" },
                          message: "should have required property 'maturity'"
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      } else {
                        var errs_4 = errors;
                        if (typeof data3.maturity !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].maturity",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/maturity/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.producer !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.producer !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].producer",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/producer/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.color !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.color !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].color",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/color/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      var data4 = data3.quantity;
                      if (data4 !== undefined) {
                        var errs_4 = errors;
                        if (
                          typeof data4 !== "number" ||
                          data4 % 1 ||
                          data4 !== data4
                        ) {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].quantity",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/quantity/type",
                            params: { type: "integer" },
                            message: "should be integer"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.price !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.price !== "number") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].price",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/price/type",
                            params: { type: "number" },
                            message: "should be number"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.product_id === undefined) {
                        valid4 = false;
                        var err = {
                          keyword: "required",
                          dataPath:
                            (dataPath || "") +
                            ".properties.products[" +
                            i2 +
                            "]",
                          schemaPath:
                            "#/properties/properties/properties/products/items/required",
                          params: { missingProperty: "product_id" },
                          message: "should have required property 'product_id'"
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      } else {
                        var errs_4 = errors;
                        if (typeof data3.product_id !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].product_id",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/product_id/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.region !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.region !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].region",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/region/type",
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
                          (dataPath || "") + ".properties.products[" + i2 + "]",
                        schemaPath:
                          "#/properties/properties/properties/products/items/type",
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
                    dataPath: (dataPath || "") + ".properties.products",
                    schemaPath:
                      "#/properties/properties/properties/products/type",
                    params: { type: "array" },
                    message: "should be array"
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
      var valid = validate(props);
      if (!valid) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }
    }
    this.analytics.track("Cart Viewed", props, genOptions(ctx));
  }
  checkoutStarted(props, context) {
    if (this.propertyValidation) {
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
              var errs__1 = errors;
              var valid2 = true;
              if (data1.currency !== undefined) {
                var errs_2 = errors;
                if (typeof data1.currency !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.currency",
                    schemaPath:
                      "#/properties/properties/properties/currency/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1.products;
              if (data2 === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "products" },
                  message: "should have required property 'products'"
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
                      if (data3.price !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.price !== "number") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].price",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/price/type",
                            params: { type: "number" },
                            message: "should be number"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.producer !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.producer !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].producer",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/producer/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.sku !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.sku !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].sku",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/sku/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.coupon !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.coupon !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].coupon",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/coupon/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.grape !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.grape !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].grape",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/grape/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      var data4 = data3.quantity;
                      if (data4 !== undefined) {
                        var errs_4 = errors;
                        if (
                          typeof data4 !== "number" ||
                          data4 % 1 ||
                          data4 !== data4
                        ) {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].quantity",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/quantity/type",
                            params: { type: "integer" },
                            message: "should be integer"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.region !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.region !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].region",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/region/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.wine_type !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.wine_type !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].wine_type",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/wine_type/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.product_id === undefined) {
                        valid4 = false;
                        var err = {
                          keyword: "required",
                          dataPath:
                            (dataPath || "") +
                            ".properties.products[" +
                            i2 +
                            "]",
                          schemaPath:
                            "#/properties/properties/properties/products/items/required",
                          params: { missingProperty: "product_id" },
                          message: "should have required property 'product_id'"
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      } else {
                        var errs_4 = errors;
                        if (typeof data3.product_id !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].product_id",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/product_id/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.color !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.color !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].color",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/color/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.maturity === undefined) {
                        valid4 = false;
                        var err = {
                          keyword: "required",
                          dataPath:
                            (dataPath || "") +
                            ".properties.products[" +
                            i2 +
                            "]",
                          schemaPath:
                            "#/properties/properties/properties/products/items/required",
                          params: { missingProperty: "maturity" },
                          message: "should have required property 'maturity'"
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      } else {
                        var errs_4 = errors;
                        if (typeof data3.maturity !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].maturity",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/maturity/type",
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
                          (dataPath || "") + ".properties.products[" + i2 + "]",
                        schemaPath:
                          "#/properties/properties/properties/products/items/type",
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
                    dataPath: (dataPath || "") + ".properties.products",
                    schemaPath:
                      "#/properties/properties/properties/products/type",
                    params: { type: "array" },
                    message: "should be array"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.total !== undefined) {
                var errs_2 = errors;
                if (typeof data1.total !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.total",
                    schemaPath: "#/properties/properties/properties/total/type",
                    params: { type: "number" },
                    message: "should be number"
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
      var valid = validate(props);
      if (!valid) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }
    }
    this.analytics.track("Checkout Started", props, genOptions(ctx));
  }
  couponApplied(props, context) {
    if (this.propertyValidation) {
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
              var errs__1 = errors;
              var valid2 = true;
              if (data1.coupon_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "coupon_id" },
                  message: "should have required property 'coupon_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.coupon_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.coupon_id",
                    schemaPath:
                      "#/properties/properties/properties/coupon_id/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.coupon_name !== undefined) {
                var errs_2 = errors;
                if (typeof data1.coupon_name !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.coupon_name",
                    schemaPath:
                      "#/properties/properties/properties/coupon_name/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.discount !== undefined) {
                var errs_2 = errors;
                if (typeof data1.discount !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.discount",
                    schemaPath:
                      "#/properties/properties/properties/discount/type",
                    params: { type: "number" },
                    message: "should be number"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.order_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "order_id" },
                  message: "should have required property 'order_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.order_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.order_id",
                    schemaPath:
                      "#/properties/properties/properties/order_id/type",
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
      var valid = validate(props);
      if (!valid) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }
    }
    this.analytics.track("Coupon Applied", props, genOptions(ctx));
  }
  couponDenied(props, context) {
    if (this.propertyValidation) {
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
              var errs__1 = errors;
              var valid2 = true;
              if (data1.coupon_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "coupon_id" },
                  message: "should have required property 'coupon_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.coupon_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.coupon_id",
                    schemaPath:
                      "#/properties/properties/properties/coupon_id/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.coupon_name !== undefined) {
                var errs_2 = errors;
                if (typeof data1.coupon_name !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.coupon_name",
                    schemaPath:
                      "#/properties/properties/properties/coupon_name/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.order_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "order_id" },
                  message: "should have required property 'order_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.order_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.order_id",
                    schemaPath:
                      "#/properties/properties/properties/order_id/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.reason !== undefined) {
                var errs_2 = errors;
                if (typeof data1.reason !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.reason",
                    schemaPath:
                      "#/properties/properties/properties/reason/type",
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
      var valid = validate(props);
      if (!valid) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }
    }
    this.analytics.track("Coupon Denied", props, genOptions(ctx));
  }
  couponEntered(props, context) {
    if (this.propertyValidation) {
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
              var errs__1 = errors;
              var valid2 = true;
              if (data1.coupon_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "coupon_id" },
                  message: "should have required property 'coupon_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.coupon_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.coupon_id",
                    schemaPath:
                      "#/properties/properties/properties/coupon_id/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.coupon_name !== undefined) {
                var errs_2 = errors;
                if (typeof data1.coupon_name !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.coupon_name",
                    schemaPath:
                      "#/properties/properties/properties/coupon_name/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.order_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "order_id" },
                  message: "should have required property 'order_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.order_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.order_id",
                    schemaPath:
                      "#/properties/properties/properties/order_id/type",
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
      var valid = validate(props);
      if (!valid) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }
    }
    this.analytics.track("Coupon Entered", props, genOptions(ctx));
  }
  couponRemoved(props, context) {
    if (this.propertyValidation) {
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
              var errs__1 = errors;
              var valid2 = true;
              if (data1.coupon_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "coupon_id" },
                  message: "should have required property 'coupon_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.coupon_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.coupon_id",
                    schemaPath:
                      "#/properties/properties/properties/coupon_id/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.coupon_name !== undefined) {
                var errs_2 = errors;
                if (typeof data1.coupon_name !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.coupon_name",
                    schemaPath:
                      "#/properties/properties/properties/coupon_name/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.discount !== undefined) {
                var errs_2 = errors;
                if (typeof data1.discount !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.discount",
                    schemaPath:
                      "#/properties/properties/properties/discount/type",
                    params: { type: "number" },
                    message: "should be number"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.order_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "order_id" },
                  message: "should have required property 'order_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.order_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.order_id",
                    schemaPath:
                      "#/properties/properties/properties/order_id/type",
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
      var valid = validate(props);
      if (!valid) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }
    }
    this.analytics.track("Coupon Removed", props, genOptions(ctx));
  }
  orderCompleted(props, context) {
    if (this.propertyValidation) {
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
              var errs__1 = errors;
              var valid2 = true;
              if (data1.revenue === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "revenue" },
                  message: "should have required property 'revenue'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.revenue !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.revenue",
                    schemaPath:
                      "#/properties/properties/properties/revenue/type",
                    params: { type: "number" },
                    message: "should be number"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.shipping !== undefined) {
                var errs_2 = errors;
                if (typeof data1.shipping !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.shipping",
                    schemaPath:
                      "#/properties/properties/properties/shipping/type",
                    params: { type: "number" },
                    message: "should be number"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.tax !== undefined) {
                var errs_2 = errors;
                if (typeof data1.tax !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.tax",
                    schemaPath: "#/properties/properties/properties/tax/type",
                    params: { type: "number" },
                    message: "should be number"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.total !== undefined) {
                var errs_2 = errors;
                if (typeof data1.total !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.total",
                    schemaPath: "#/properties/properties/properties/total/type",
                    params: { type: "number" },
                    message: "should be number"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.coupon !== undefined) {
                var errs_2 = errors;
                if (typeof data1.coupon !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.coupon",
                    schemaPath:
                      "#/properties/properties/properties/coupon/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.discount !== undefined) {
                var errs_2 = errors;
                if (typeof data1.discount !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.discount",
                    schemaPath:
                      "#/properties/properties/properties/discount/type",
                    params: { type: "number" },
                    message: "should be number"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.order_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "order_id" },
                  message: "should have required property 'order_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.order_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.order_id",
                    schemaPath:
                      "#/properties/properties/properties/order_id/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              var data2 = data1.products;
              if (data2 === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "products" },
                  message: "should have required property 'products'"
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
                      if (data3.color !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.color !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].color",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/color/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.producer !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.producer !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].producer",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/producer/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      var data4 = data3.quantity;
                      if (data4 !== undefined) {
                        var errs_4 = errors;
                        if (
                          typeof data4 !== "number" ||
                          data4 % 1 ||
                          data4 !== data4
                        ) {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].quantity",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/quantity/type",
                            params: { type: "integer" },
                            message: "should be integer"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.region !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.region !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].region",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/region/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.coupon !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.coupon !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].coupon",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/coupon/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.grape !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.grape !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].grape",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/grape/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.price !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.price !== "number") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].price",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/price/type",
                            params: { type: "number" },
                            message: "should be number"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.sku !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.sku !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].sku",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/sku/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.maturity === undefined) {
                        valid4 = false;
                        var err = {
                          keyword: "required",
                          dataPath:
                            (dataPath || "") +
                            ".properties.products[" +
                            i2 +
                            "]",
                          schemaPath:
                            "#/properties/properties/properties/products/items/required",
                          params: { missingProperty: "maturity" },
                          message: "should have required property 'maturity'"
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      } else {
                        var errs_4 = errors;
                        if (typeof data3.maturity !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].maturity",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/maturity/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.product_id === undefined) {
                        valid4 = false;
                        var err = {
                          keyword: "required",
                          dataPath:
                            (dataPath || "") +
                            ".properties.products[" +
                            i2 +
                            "]",
                          schemaPath:
                            "#/properties/properties/properties/products/items/required",
                          params: { missingProperty: "product_id" },
                          message: "should have required property 'product_id'"
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      } else {
                        var errs_4 = errors;
                        if (typeof data3.product_id !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].product_id",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/product_id/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.wine_type !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.wine_type !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].wine_type",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/wine_type/type",
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
                          (dataPath || "") + ".properties.products[" + i2 + "]",
                        schemaPath:
                          "#/properties/properties/properties/products/items/type",
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
                    dataPath: (dataPath || "") + ".properties.products",
                    schemaPath:
                      "#/properties/properties/properties/products/type",
                    params: { type: "array" },
                    message: "should be array"
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
      var valid = validate(props);
      if (!valid) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }
    }
    this.analytics.track("Order Completed", props, genOptions(ctx));
  }
  productAdded(props, context) {
    if (this.propertyValidation) {
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
              var errs__1 = errors;
              var valid2 = true;
              var data2 = data1.quantity;
              if (data2 !== undefined) {
                var errs_2 = errors;
                if (typeof data2 !== "number" || data2 % 1 || data2 !== data2) {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.quantity",
                    schemaPath:
                      "#/properties/properties/properties/quantity/type",
                    params: { type: "integer" },
                    message: "should be integer"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.region !== undefined) {
                var errs_2 = errors;
                if (typeof data1.region !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.region",
                    schemaPath:
                      "#/properties/properties/properties/region/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.product_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "product_id" },
                  message: "should have required property 'product_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.product_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.product_id",
                    schemaPath:
                      "#/properties/properties/properties/product_id/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.sku !== undefined) {
                var errs_2 = errors;
                if (typeof data1.sku !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.sku",
                    schemaPath: "#/properties/properties/properties/sku/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.grape !== undefined) {
                var errs_2 = errors;
                if (typeof data1.grape !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.grape",
                    schemaPath: "#/properties/properties/properties/grape/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.maturity === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "maturity" },
                  message: "should have required property 'maturity'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.maturity !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.maturity",
                    schemaPath:
                      "#/properties/properties/properties/maturity/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.wine_type !== undefined) {
                var errs_2 = errors;
                if (typeof data1.wine_type !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.wine_type",
                    schemaPath:
                      "#/properties/properties/properties/wine_type/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.color !== undefined) {
                var errs_2 = errors;
                if (typeof data1.color !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.color",
                    schemaPath: "#/properties/properties/properties/color/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.producer !== undefined) {
                var errs_2 = errors;
                if (typeof data1.producer !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.producer",
                    schemaPath:
                      "#/properties/properties/properties/producer/type",
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
      var valid = validate(props);
      if (!valid) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }
    }
    this.analytics.track("Product Added", props, genOptions(ctx));
  }
  productRemoved(props, context) {
    if (this.propertyValidation) {
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
              var errs__1 = errors;
              var valid2 = true;
              var data2 = data1.quantity;
              if (data2 !== undefined) {
                var errs_2 = errors;
                if (typeof data2 !== "number" || data2 % 1 || data2 !== data2) {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.quantity",
                    schemaPath:
                      "#/properties/properties/properties/quantity/type",
                    params: { type: "integer" },
                    message: "should be integer"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.region !== undefined) {
                var errs_2 = errors;
                if (typeof data1.region !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.region",
                    schemaPath:
                      "#/properties/properties/properties/region/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.product_id === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "product_id" },
                  message: "should have required property 'product_id'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.product_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.product_id",
                    schemaPath:
                      "#/properties/properties/properties/product_id/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.sku !== undefined) {
                var errs_2 = errors;
                if (typeof data1.sku !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.sku",
                    schemaPath: "#/properties/properties/properties/sku/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.grape !== undefined) {
                var errs_2 = errors;
                if (typeof data1.grape !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.grape",
                    schemaPath: "#/properties/properties/properties/grape/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.maturity === undefined) {
                valid2 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + ".properties",
                  schemaPath: "#/properties/properties/required",
                  params: { missingProperty: "maturity" },
                  message: "should have required property 'maturity'"
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_2 = errors;
                if (typeof data1.maturity !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.maturity",
                    schemaPath:
                      "#/properties/properties/properties/maturity/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.wine_type !== undefined) {
                var errs_2 = errors;
                if (typeof data1.wine_type !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.wine_type",
                    schemaPath:
                      "#/properties/properties/properties/wine_type/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.color !== undefined) {
                var errs_2 = errors;
                if (typeof data1.color !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.color",
                    schemaPath: "#/properties/properties/properties/color/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.producer !== undefined) {
                var errs_2 = errors;
                if (typeof data1.producer !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.producer",
                    schemaPath:
                      "#/properties/properties/properties/producer/type",
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
      var valid = validate(props);
      if (!valid) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }
    }
    this.analytics.track("Product Removed", props, genOptions(ctx));
  }
}
