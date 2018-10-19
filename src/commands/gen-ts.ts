import { getTypedTrackHandler, TrackedEvent, Params } from '../lib'
import { camelCase } from 'lodash'
import {
  quicktype,
  InputData,
  JSONSchemaInput,
  TypeScriptTargetLanguage,
  TypeScriptRenderer,
  RenderContext
} from 'quicktype-core'

import * as fs from 'fs'
import * as util from 'util'
const writeFile = util.promisify(fs.writeFile)

import { modifySource } from 'quicktype-core/dist/Source'
export const command = 'gen-ts'
export const desc = 'Generate a strongly typed TypeScript analytics.js client'
export { builder } from '../lib'

class AJSTargetLanguage extends TypeScriptTargetLanguage {
  constructor() {
    super()
  }
  protected makeRenderer(
    renderContext: RenderContext,
    _: { [name: string]: any }
  ): TypeScriptRenderer {
    return new AJSWrapperRenderer(this, renderContext, {
      nicePropertyNames: true,
      runtimeTypecheck: true,
      justTypes: false,
      declareUnions: true
    })
  }
  protected get defaultIndentation(): string {
    return '  '
  }
}

class AJSWrapperRenderer extends TypeScriptRenderer {
  protected emitConvertModule(): void {
    this.ensureBlankLine()
    this.emitConvertModuleBody()
  }

  protected emitSourceStructure() {
    this.emitRuntimeTransformAndValidate()
    this.emitTypes()
    this.emitConvertModuleBody()
  }

  protected emitConvertModuleBody(): void {
    this.forEachTopLevel('leading-and-interposing', (t, name) => {
      const camelCaseName = modifySource(camelCase, name)
      const typeMap = this.typeMapTypeFor(t)
      this.emitBlock(
        [
          'export function ',
          camelCaseName,
          '(props: ',
          this.sourceFor(t).source,
          ', context?: any): void'
        ],
        '',
        () => {
          this.emitLine('const payload = transform(props, ', typeMap, ', jsToJSONProps, typeMap);')

          this.emitLine(
            "if (context) { window.analytics.track('",
            name,
            "', payload, { context }) } else { window.analytics.track('",
            name,
            "', payload) }"
          )
        }
      )
    })
  }

  private emitRuntimeTransformAndValidate() {
    this.emitMultiline(`declare global {
    interface Window {
        analytics: any;
    }
}

function invalidValue(typ, val) {
    throw Error(\`Invalid value \${JSON.stringify(val)} for type \${JSON.stringify(typ)}\`);
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
${this.castFunctionLines[0]} {
    return transform(val, typ, jsonToJSProps);
}
${this.castFunctionLines[1]} {
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
}`)
    this.emitTypeMap()
  }
}

export async function genTS(events: TrackedEvent[]) {
  const inputData = new InputData()

  events.forEach(({ name, rules }) => {
    const schema = {
      $schema: 'http://json-schema.org/draft-04/schema#',
      title: rules.title,
      description: rules.description,
      ...rules.properties.properties
    }

    inputData.addSource(
      'schema',
      { name, uris: [name], schema: JSON.stringify(schema) },
      () => new JSONSchemaInput(undefined)
    )
  })

  const lang = new AJSTargetLanguage()

  const { lines } = await quicktype({
    lang,
    inputData,
    rendererOptions: { 'nice-property-names': 'true' }
  })
  return lines.join('\n')
}

export const handler = getTypedTrackHandler(async (params: Params, { events }) => {
  const codeContent = await genTS(events)
  return writeFile(`${params.outputPath}/index.ts`, codeContent)
})
