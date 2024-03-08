import {
  getOptionValues,
  kotlinOptions,
  KotlinTargetLanguage,
  Name,
  RenderContext,
  TargetLanguage,
  Type,
} from 'quicktype-core';
import { KotlinXRenderer } from 'quicktype-core/dist/language/Kotlin';
import { OptionValues } from 'quicktype-core/dist/RendererOptions';
import { camelCase } from 'quicktype-core/dist/support/Strings';

import {
  createQuicktypeLanguageGenerator,
  emitMultiline,
  executeRenderPlan,
  makeNameForTopLevelWithPrefixAndSuffix,
} from './quicktype-utils';
import { QuicktypeTypewriterSettings } from './types';

class TypewriterKotlinRenderer extends KotlinXRenderer {
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

  // We add our import for Analytics here, Kotlin is more strict about import order so we have to do it outside the templates
  override emitHeader(): void {
    super.emitHeader();
    this.emitLine('import com.segment.analytics.kotlin.core.Analytics');
  }

  override emitSource(givenOutputFilename: string): void {
    super.emitSource(givenOutputFilename);
    executeRenderPlan(this, this.typewriterOptions.generators);
  }

  override makeNameForTopLevel(t: Type, givenName: string, maybeNamedType: Type | undefined): Name {
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

class TypewriterKotlinLanguage extends KotlinTargetLanguage {
  constructor(protected readonly typewriterOptions: QuicktypeTypewriterSettings) {
    super();
  }

  protected makeRenderer(
    renderContext: RenderContext,
    untypedOptionValues: { [name: string]: any },
  ): TypewriterKotlinRenderer {
    return new TypewriterKotlinRenderer(
      this,
      renderContext,
      getOptionValues(kotlinOptions, untypedOptionValues),
      this.typewriterOptions,
    );
  }
}

export const kotlin = createQuicktypeLanguageGenerator({
  name: 'kotlin',
  quicktypeLanguage: TypewriterKotlinLanguage,
  supportedSDKs: [
    {
      name: 'Analytics.Kotlin',
      id: 'kotlin',
      templatePath: 'templates/kotlin/kotlin.hbs',
    },
    {
      name: 'None (Types and validation only)',
      id: 'none',
    },
  ],
  defaultOptions: {
    framework: 'kotlinx',
    package: 'typewriter',
    'just-types': true,
  },
  requiredOptions: ['package'],
  unsupportedOptions: ['framework'],
  nameModifiers: {
    functionName: camelCase,
  },
});
