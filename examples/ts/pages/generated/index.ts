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
  "FeedViewed": o([
    { json: "profile_id", js: "profileID", typ: "" },
  ], "any"),
  "PhotoViewed": o([
    { json: "photo_id", js: "photoID", typ: "" },
  ], "any"),
  "ProfileViewed": o([
    { json: "profile_id", js: "profileID", typ: "" },
  ], "any"),
};

export interface FeedViewed {
  /**
   * The id of the user this feed belongs to
   */
  profileID: string;
}

export interface PhotoViewed {
  /**
   * The id of the viewed photo
   */
  photoID: string;
}

export interface ProfileViewed {
  /**
   * The id of the user the profile belongs to
   */
  profileID: string;
}

export function feedViewed(props: FeedViewed, context?: any): void{
  const payload = transform(props, r("FeedViewed"), jsToJSONProps, typeMap);
  if (context) { window.analytics.track('Feed Viewed', payload, { context }) } else { window.analytics.track('Feed Viewed', payload) }
}

export function photoViewed(props: PhotoViewed, context?: any): void{
  const payload = transform(props, r("PhotoViewed"), jsToJSONProps, typeMap);
  if (context) { window.analytics.track('Photo Viewed', payload, { context }) } else { window.analytics.track('Photo Viewed', payload) }
}

export function profileViewed(props: ProfileViewed, context?: any): void{
  const payload = transform(props, r("ProfileViewed"), jsToJSONProps, typeMap);
  if (context) { window.analytics.track('Profile Viewed', payload, { context }) } else { window.analytics.track('Profile Viewed', payload) }
}
