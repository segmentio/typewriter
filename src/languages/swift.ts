import {
  getOptionValues,
  Name,
  RenderContext,
  swiftOptions,
  SwiftRenderer,
  SwiftTargetLanguage,
  TargetLanguage,
  Type,
} from 'quicktype-core';
import { OptionValues } from 'quicktype-core/dist/RendererOptions';
import { camelCase } from 'quicktype-core/dist/support/Strings';
import {
  createQuicktypeLanguageGenerator,
  emitMultiline,
  executeRenderPlan,
  makeNameForTopLevelWithPrefixAndSuffix,
} from './quicktype-utils';
import { QuicktypeTypewriterSettings } from './types';

class TypewriterSwiftRenderer extends SwiftRenderer {
  constructor(
    targetLanguage: TargetLanguage,
    renderContext: RenderContext,
    typescriptOptions: OptionValues<any>,
    protected readonly typewriterOptions: QuicktypeTypewriterSettings,
  ) {
    super(targetLanguage, renderContext, typescriptOptions);
  }

  emitMultiline(linesString: string) {
    emitMultiline(this, linesString, 4);
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

  protected override getProtocolsArray(t: Type, isClass: boolean): string[] {
    let protocols = super.getProtocolsArray(t, isClass);
    // We have to enforce all our classes to be Codable for compatibility with our calls so we enforce this here
    if (!protocols.includes('Codable')) {
      protocols.push('Codable');
    }
    return protocols;
  }
}

class TypewriterSwiftLanguage extends SwiftTargetLanguage {
  constructor(protected readonly typewriterOptions: QuicktypeTypewriterSettings) {
    super();
  }

  protected makeRenderer(
    renderContext: RenderContext,
    untypedOptionValues: { [name: string]: any },
  ): TypewriterSwiftRenderer {
    return new TypewriterSwiftRenderer(
      this,
      renderContext,
      getOptionValues(swiftOptions, untypedOptionValues),
      this.typewriterOptions,
    );
  }
}

export const swift = createQuicktypeLanguageGenerator({
  name: 'swift',
  quicktypeLanguage: TypewriterSwiftLanguage,
  supportedSDKs: [
    {
      name: 'Analytics.Swift',
      id: 'swift',
      templatePath: 'templates/swift/analytics.hbs',
    },
    {
      name: 'None (Types and validation only)',
      id: 'none',
    },
  ],
  // Note, we don't let people set just-types to false cause that will cause undefined arrays in their TrackingPlans to not be compatible with Codable,
  // if we enforce not to use types the generated code will contain a JSONAny class that is codable and compatible with any JSON valid object
  defaultOptions: {
    'just-types': false,
  },
  unsupportedOptions: ['just-types'],
  nameModifiers: {
    functionName: camelCase,
  },
});
