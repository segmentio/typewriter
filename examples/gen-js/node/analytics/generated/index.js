"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genOptions = (context = {}) => ({
  context: Object.assign({}, context, {
    typewriter: {
      name: "gen-js",
      version: "4.0.0"
    }
  })
});
class Analytics {
  /**
   * Instantiate a wrapper around an analytics library instance
   * @param {Analytics} analytics - The analytics-node library to wrap
   * @param {Object} config - A configuration object to customize runtime behavior
   */
  constructor(analytics, options = {}) {
    const { propertyValidation = true } = options;
    if (!analytics) {
      throw new Error("An instance of analytics-node must be provided");
    }
    this.analytics = analytics;
    this.propertyValidation = propertyValidation;
  }
  orderCompleted(message, callback) {
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
              if (data1.affiliation !== undefined) {
                var errs_2 = errors;
                if (typeof data1.affiliation !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.affiliation",
                    schemaPath:
                      "#/properties/properties/properties/affiliation/type",
                    params: { type: "string" },
                    message: "should be string"
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid2 = errors === errs_2;
              }
              if (data1.checkout_id !== undefined) {
                var errs_2 = errors;
                if (typeof data1.checkout_id !== "string") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + ".properties.checkout_id",
                    schemaPath:
                      "#/properties/properties/properties/checkout_id/type",
                    params: { type: "string" },
                    message: "should be string"
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
                      if (data3.brand !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.brand !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].brand",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/brand/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.category !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.category !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].category",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/category/type",
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
                      if (data3.image_url !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.image_url !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].image_url",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/image_url/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.name !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.name !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].name",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/name/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      var data4 = data3.position;
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
                              "].position",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/position/type",
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
                      if (data3.product_id !== undefined) {
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
                      if (data3.quantity !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.quantity !== "number") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].quantity",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/quantity/type",
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
                      if (data3.url !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.url !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].url",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/url/type",
                            params: { type: "string" },
                            message: "should be string"
                          };
                          if (vErrors === null) vErrors = [err];
                          else vErrors.push(err);
                          errors++;
                        }
                        var valid4 = errors === errs_4;
                      }
                      if (data3.variant !== undefined) {
                        var errs_4 = errors;
                        if (typeof data3.variant !== "string") {
                          var err = {
                            keyword: "type",
                            dataPath:
                              (dataPath || "") +
                              ".properties.products[" +
                              i2 +
                              "].variant",
                            schemaPath:
                              "#/properties/properties/properties/products/items/properties/variant/type",
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
              if (data1.revenue !== undefined) {
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
      var valid = validate(message);
      if (!valid) {
        throw new Error(JSON.stringify(validate.errors, null, 2));
      }
    }
    message = Object.assign({}, message, genOptions(message.context), {
      event: "Order Completed"
    });
    this.analytics.track(message, callback);
  }
}
exports.default = Analytics;
