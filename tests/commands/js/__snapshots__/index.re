type analyticsJSCallback = unit => unit;
type analyticsOptions = {. "propertyValidation": Js.boolean};

type segmentOptions = {. "integrations": Js.Dict.t(Js.boolean)};
type the42_TerribleEventName3 = {
  .
  "the0000TerriblePropertyName3": Js.Nullable.t('any),
};
type exampleEvent = {
  .
  "optionalAny": Js.Nullable.t('any),
  "optionalArray": Js.Nullable.t(array(optionalArray)),
  "optionalArrayEmpty": Js.Nullable.t(array('any)),
  "optionalBoolean": Js.Nullable.t(Js.boolean),
  "optionalInt": Js.Nullable.t(float),
  "optionalNumber": Js.Nullable.t(float),
  "optionalObject": Js.Nullable.t(optionalObject),
  "optionalObjectEmpty": Js.Nullable.t(Js.Dict.t('any)),
  "optionalString": Js.Nullable.t(string),
  "optionalStringRegex": Js.Nullable.t(string),
  "requiredAny": 'any,
  "requiredArray": array(requiredArray),
  "requiredArrayEmpty": array('any),
  "requiredBoolean": Js.boolean,
  "requiredInt": float,
  "requiredNumber": float,
  "requiredObject": requiredObject,
  "requiredObjectEmpty": Js.Dict.t('any),
  "requiredString": string,
  "requiredStringRegex": string,
};
type optionalArray = {
  .
  "optionalSubProperty": Js.Nullable.t(string),
  "requiredSubProperty": string,
};
type optionalObject = {
  .
  "optionalSubProperty": Js.Nullable.t(string),
  "requiredSubProperty": string,
};
type requiredArray = {
  .
  "optionalSubProperty": Js.Nullable.t(string),
  "requiredSubProperty": string,
};
type requiredObject = {
  .
  "optionalSubProperty": Js.Nullable.t(string),
  "requiredSubProperty": string,
};
module Analytics = {
  type t = {
    .
    "the42TerribleEventName3":
      [@bs.meth] (
        (the42_TerribleEventName3, segmentOptions, analyticsJSCallback) => unit
      ),
    "emptyEvent":
      [@bs.meth] (
        (Js.Dict.t('any), segmentOptions, analyticsJSCallback) => unit
      ),
    "exampleEvent":
      [@bs.meth] ((exampleEvent, segmentOptions, analyticsJSCallback) => unit),
  };
  [@bs.new] [@bs.module "index"]
  external make: ('any, analyticsOptions) => t = "Analytics";
};
