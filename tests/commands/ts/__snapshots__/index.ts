declare global {
  interface Window {
    analytics: any;
  }
}

function invalidValue(typ, val) {
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}
function jsonToJSProps(typ) {
  if (typ.jsonToJS === undefined) {
    var map = {};
    typ.props.forEach((p) => map[p.json] = { key: p.js, typ: p.typ });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}
function jsToJSONProps(typ) {
  if (typ.jsToJSON === undefined) {
    var map = {};
    typ.props.forEach((p) => map[p.js] = { key: p.json, typ: p.typ });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}
function transform(val, typ, getProps) {
  function transformPrimitive(typ, val) {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val);
  }
  function transformUnion(typs, val) {
    // val must validate against one typ in typs
    var l = typs.length;
    for (var i = 0; i < l; i++) {
      var typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }
  function transformEnum(cases, val) {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }
  function transformArray(typ, val) {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map(el => transform(el, typ, getProps));
  }
  function transformObject(props, additional, val) {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    var result = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps);
      }
    });
    return result;
  }
  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  return transformPrimitive(typ, val);
}
function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}
function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}
function a(typ) {
  return { arrayItems: typ };
}
function u(...typs) {
  return { unionMembers: typs };
}
function o(props, additional) {
  return { props, additional };
}
function m(additional) {
  return { props: [], additional };
}
function r(name) {
  return { ref: name };
}
const typeMap: any = {
  "The42_TerribleEventName3": o([
    { json: "0000---terrible-property-name~!3", js: "the0000TerriblePropertyName3", typ: u(undefined, "any") },
  ], "any"),
  "ExampleEvent": o([
    { json: "optional any", js: "optionalAny", typ: u(undefined, "any") },
    { json: "optional array", js: "optionalArray", typ: u(undefined, a(r("OptionalArray"))) },
    { json: "optional array (empty)", js: "optionalArrayEmpty", typ: u(undefined, a("any")) },
    { json: "optional boolean", js: "optionalBoolean", typ: u(undefined, true) },
    { json: "optional int", js: "optionalInt", typ: u(undefined, 0) },
    { json: "optional number", js: "optionalNumber", typ: u(undefined, 3.14) },
    { json: "optional object", js: "optionalObject", typ: u(undefined, r("OptionalObject")) },
    { json: "optional object (empty)", js: "optionalObjectEmpty", typ: u(undefined, m("any")) },
    { json: "optional string", js: "optionalString", typ: u(undefined, "") },
    { json: "optional string regex", js: "optionalStringRegex", typ: u(undefined, "") },
    { json: "required any", js: "requiredAny", typ: "any" },
    { json: "required array", js: "requiredArray", typ: a(r("RequiredArray")) },
    { json: "required array (empty)", js: "requiredArrayEmpty", typ: a("any") },
    { json: "required boolean", js: "requiredBoolean", typ: true },
    { json: "required int", js: "requiredInt", typ: 0 },
    { json: "required number", js: "requiredNumber", typ: 3.14 },
    { json: "required object", js: "requiredObject", typ: r("RequiredObject") },
    { json: "required object (empty)", js: "requiredObjectEmpty", typ: m("any") },
    { json: "required string", js: "requiredString", typ: "" },
    { json: "required string regex", js: "requiredStringRegex", typ: "" },
  ], "any"),
  "OptionalArray": o([
    { json: "optional sub-property", js: "optionalSubProperty", typ: u(undefined, "") },
    { json: "required sub-property", js: "requiredSubProperty", typ: "" },
  ], "any"),
  "OptionalObject": o([
    { json: "optional sub-property", js: "optionalSubProperty", typ: u(undefined, "") },
    { json: "required sub-property", js: "requiredSubProperty", typ: "" },
  ], "any"),
  "RequiredArray": o([
    { json: "optional sub-property", js: "optionalSubProperty", typ: u(undefined, "") },
    { json: "required sub-property", js: "requiredSubProperty", typ: "" },
  ], "any"),
  "RequiredObject": o([
    { json: "optional sub-property", js: "optionalSubProperty", typ: u(undefined, "") },
    { json: "required sub-property", js: "requiredSubProperty", typ: "" },
  ], "any"),
};

export interface The42_TerribleEventName3 {
  /**
   * Really, don't do this.
   */
  the0000TerriblePropertyName3?: any;
}

export interface ExampleEvent {
  /**
   * Optional any property
   */
  optionalAny?: any;
  /**
   * Optional array property
   */
  optionalArray?: OptionalArray[];
  /**
   * Optional array (empty) property
   */
  optionalArrayEmpty?: any[];
  /**
   * Optional boolean property
   */
  optionalBoolean?: boolean;
  /**
   * Optional integer property
   */
  optionalInt?: number;
  /**
   * Optional number property
   */
  optionalNumber?: number;
  /**
   * Optional object property
   */
  optionalObject?: OptionalObject;
  /**
   * Optional object (empty) property
   */
  optionalObjectEmpty?: { [key: string]: any };
  /**
   * Optional string property
   */
  optionalString?: string;
  /**
   * Optional string regex property
   */
  optionalStringRegex?: string;
  /**
   * Required any property
   */
  requiredAny: any;
  /**
   * Required array property
   */
  requiredArray: RequiredArray[];
  /**
   * Required array (empty) property
   */
  requiredArrayEmpty: any[];
  /**
   * Required boolean property
   */
  requiredBoolean: boolean;
  /**
   * Required integer property
   */
  requiredInt: number;
  /**
   * Required number property
   */
  requiredNumber: number;
  /**
   * Required object property
   */
  requiredObject: RequiredObject;
  /**
   * Required object (empty) property
   */
  requiredObjectEmpty: { [key: string]: any };
  /**
   * Required string property
   */
  requiredString: string;
  /**
   * Required string regex property
   */
  requiredStringRegex: string;
}

export interface OptionalArray {
  /**
   * Optional sub-property
   */
  optionalSubProperty?: string;
  /**
   * Required sub-property
   */
  requiredSubProperty: string;
}

/**
 * Optional object property
 */
export interface OptionalObject {
  /**
   * Optional sub-property
   */
  optionalSubProperty?: string;
  /**
   * Required sub-property
   */
  requiredSubProperty: string;
}

export interface RequiredArray {
  /**
   * Optional sub-property
   */
  optionalSubProperty?: string;
  /**
   * Required sub-property
   */
  requiredSubProperty: string;
}

/**
 * Required object property
 */
export interface RequiredObject {
  /**
   * Optional sub-property
   */
  optionalSubProperty?: string;
  /**
   * Required sub-property
   */
  requiredSubProperty: string;
}

export function the42TerribleEventName3(props: The42_TerribleEventName3, context?: any): void{
  const payload = transform(props, r("The42_TerribleEventName3"), jsToJSONProps, typeMap);
  if (context) { window.analytics.track('The42_TerribleEventName3', payload, { context }) } else { window.analytics.track('The42_TerribleEventName3', payload) }
}

export function emptyEvent(props: { [key: string]: any }, context?: any): void{
  const payload = transform(props, m("any"), jsToJSONProps, typeMap);
  if (context) { window.analytics.track('EmptyEvent', payload, { context }) } else { window.analytics.track('EmptyEvent', payload) }
}

export function exampleEvent(props: ExampleEvent, context?: any): void{
  const payload = transform(props, r("ExampleEvent"), jsToJSONProps, typeMap);
  if (context) { window.analytics.track('ExampleEvent', payload, { context }) } else { window.analytics.track('ExampleEvent', payload) }
}
