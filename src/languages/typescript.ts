import { string } from "joi";
import path from "path";
import {
  Name,
  RenderContext,
  TargetLanguage,
  tsFlowOptions,
  Type,
  TypeScriptRenderer,
  TypeScriptTargetLanguage,
} from "quicktype-core";
import {
  getOptionValues,
  OptionValues,
} from "quicktype-core/dist/RendererOptions";
import { camelCase } from "quicktype-core/dist/support/Strings";
import { SegmentAPI } from "../api";
import {
  createQuicktypeLanguageGenerator,
  emitMultiline,
  executeRenderPlan,
  makeNameForTopLevelWithPrefixAndSuffix,
} from "./quicktype-utils";
import {
  FileGenerateResult,
  GeneratorOptions,
  LanguageGenerator,
  QuicktypeTypewriterSettings,
  TemplateContext,
} from "./types";

// To add our own functions we need to extend the renderer for the language we are targeting
class TypewriterTypescriptRenderer extends TypeScriptRenderer {
  constructor(
    targetLanguage: TargetLanguage,
    renderContext: RenderContext,
    typescriptOptions: OptionValues<any>,
    protected readonly typewriterOptions: QuicktypeTypewriterSettings
  ) {
    super(targetLanguage, renderContext, typescriptOptions);
  }

  emitMultiline(linesString: string) {
    emitMultiline(this, linesString, 2);
  }

  emitSource(givenOutputFilename: string): void {
    super.emitSource(givenOutputFilename);
    executeRenderPlan(this, this.typewriterOptions.generators);
  }

  makeNameForTopLevel(
    t: Type,
    givenName: string,
    maybeNamedType: Type | undefined
  ): Name {
    return makeNameForTopLevelWithPrefixAndSuffix(
      (...args) => {
        return super.makeNameForTopLevel(...args);
      },
      this.typewriterOptions,
      t,
      givenName,
      maybeNamedType
    );
  }
}

// We extend one of the target languages in quicktype to add our own functions
// This is only necesary to make it use our own renderer
class TypewriterTSLanguage extends TypeScriptTargetLanguage {
  constructor(
    protected readonly typewriterOptions: QuicktypeTypewriterSettings
  ) {
    super();
  }

  protected makeRenderer(
    renderContext: RenderContext,
    untypedOptionValues: { [name: string]: any }
  ): TypewriterTypescriptRenderer {
    return new TypewriterTypescriptRenderer(
      this,
      renderContext,
      getOptionValues(tsFlowOptions, untypedOptionValues),
      this.typewriterOptions
    );
  }
}

const tsBase = createQuicktypeLanguageGenerator({
  name: "typescript",
  quicktypeLanguage: TypewriterTSLanguage,
  supportedSDKs: [
    {
      name: "Node.js (analytics-node)",
      id: "analytics-node",
      templatePath: "templates/typescript/node.hbs",
    },
    {
      name: "Web (analytics.js)",
      id: "analytics-js",
      templatePath: "templates/typescript/analytics-js.hbs",
    },
    {
      name: "React Native (analytics-react-native)",
      id: "analytics-react-native",
      templatePath: "templates/typescript/react-native.hbs",
    },
    {
      name: "None (Types and validation only)",
      id: "none",
    },
  ],
  defaultOptions: {
    "just-types": true,
  },
  nameModifiers: {
    functionName: camelCase,
  },
});

export const typescript: LanguageGenerator = {
  ...tsBase,
  generate: async (
    rules: SegmentAPI.RuleMetadata[],
    context: TemplateContext,
    options: GeneratorOptions
  ): Promise<FileGenerateResult> => {
    const { sdk, prefixes, suffixes } = options;
    const result = await tsBase.generate(rules, context, options);
    // We edit the RN output to include the TSX extension
    if (sdk === "analytics-react-native") {
      const tsxResult = new Map<string, string>();
      for (const [filename, contents] of result.entries()) {
        if (path.extname(filename) === ".ts") {
          tsxResult.set(`${filename}x`, contents);
        } else {
          tsxResult.set(`${filename}.tsx`, contents);
        }
      }
      return tsxResult;
    }
    return result;
  },
};
