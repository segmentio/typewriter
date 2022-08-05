import {
  Name,
  RenderContext,
  TargetLanguage,
  tsFlowOptions,
  Type,
  TypeScriptRenderer,
  TypeScriptTargetLanguage,
} from 'quicktype-core';
import { getOptionValues, OptionValues } from 'quicktype-core/dist/RendererOptions';
import { camelCase } from 'quicktype-core/dist/support/Strings';
import {
  createQuicktypeLanguageGenerator,
  emitMultiline,
  executeRenderPlan,
  makeNameForTopLevelWithPrefixAndSuffix,
} from './quicktype-utils';
import { QuicktypeTypewriterSettings } from './types';

// To add our own functions we need to extend the renderer for the language we are targeting
class TypewriterTypescriptRenderer extends TypeScriptRenderer {
  constructor(
    targetLanguage: TargetLanguage,
    renderContext: RenderContext,
    typescriptOptions: OptionValues<any>,
    protected readonly typewriterOptions: QuicktypeTypewriterSettings,
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

  makeNameForTopLevel(t: Type, givenName: string, maybeNamedType: Type | undefined): Name {
    return makeNameForTopLevelWithPrefixAndSuffix(
      (...args) => {
        return super.makeNameForTopLevel(...args);
      },
      this.typewriterOptions,
      t,
      givenName,
      maybeNamedType,
    );
  }
}

// We extend one of the target languages in quicktype to add our own functions
// This is only necesary to make it use our own renderer
class TypewriterTSLanguage extends TypeScriptTargetLanguage {
  constructor(protected readonly typewriterOptions: QuicktypeTypewriterSettings) {
    super();
  }

  protected makeRenderer(
    renderContext: RenderContext,
    untypedOptionValues: { [name: string]: any },
  ): TypewriterTypescriptRenderer {
    return new TypewriterTypescriptRenderer(
      this,
      renderContext,
      getOptionValues(tsFlowOptions, untypedOptionValues),
      this.typewriterOptions,
    );
  }
}

export const typescript = createQuicktypeLanguageGenerator({
  name: 'typescript',
  quicktypeLanguage: TypewriterTSLanguage,
  supportedSDKs: [
    {
      name: 'Node.js (analytics-node)',
      id: 'analytics-node',
      templatePath: 'templates/typescript/node.hbs',
    },
    {
      name: 'Web (analytics.js)',
      id: 'analytics-js',
      templatePath: 'templates/typescript/analytics-js.hbs',
    },
    {
      name: 'React Native (analytics-react-native)',
      id: 'analytics-react-native',
      templatePath: 'templates/typescript/react-native.hbs',
    },
    {
      name: 'None (Types and validation only)',
      id: 'none',
    },
  ],
  defaultOptions: {
    'just-types': true,
  },
  nameModifiers: {
    functionName: camelCase,
  },
});
