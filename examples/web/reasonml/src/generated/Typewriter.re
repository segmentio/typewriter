type analyticsJSCallback = unit => unit;
type analyticsOptions = {. "propertyValidation": bool };

type segmentOptions = {. "integrations": Js.Dict.t(bool)};
type feedViewed = {. "profileID": string};
type photoViewed = {. "photoID": string};
type profileViewed = {. "profileID": string};
module Typewriter = {
  type t = {
    .
    "feedViewed":
      [@bs.meth] ((feedViewed, segmentOptions, analyticsJSCallback) => unit),
    "photoViewed":
      [@bs.meth] ((photoViewed, segmentOptions, analyticsJSCallback) => unit),
    "profileViewed":
      [@bs.meth] (
        (profileViewed, segmentOptions, analyticsJSCallback) => unit
      ),
  };
  [@bs.new] [@bs.module "Typewriter"]
  external make: ('any, analyticsOptions) => t = "Analytics";
};
