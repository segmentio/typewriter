type analyticsNodeCallback = (~err: error, ~data: data) => unit;
type analyticsOptions = {. "propertyValidation": Js.boolean};
type message = {
  .
  "_type": string,
  "context": {
    .
    "library": {
      .
      "name": string,
      "version": string,
    },
  },
  "_metadata": {. "nodeVersion": string},
  "timestamp": Js.Nullable.t(Js.Date.t),
  "messageId": Js.Nullable.t(string),
  "anonymousId": string,
  "userId": string,
};
type data = {
  .
  "batch": array(message),
  "timestamp": Js.Date.t,
  "sentAt": Js.Date.t,
};

type trackMessage('propertiesType) = {
  .
  "userId": string,
  "anonymousId": Js.Nullable.t(string),
  "properties": Js.Nullable.t('propertiesType),
  "timestamp": Js.Nullable.t(Js.Date.t),
  "context": Js.Nullable.t('any),
};
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
        (trackMessage(the42_TerribleEventName3), analyticsNodeCallback) =>
        unit
      ),
    "emptyEvent":
      [@bs.meth] (
        (trackMessage(Js.Dict.t('any)), analyticsNodeCallback) => unit
      ),
    "exampleEvent":
      [@bs.meth] (
        (trackMessage(exampleEvent), analyticsNodeCallback) => unit
      ),
  };
  [@bs.new] [@bs.module "index"]
  external make: ('any, analyticsOptions) => t = "Analytics";
};
