import { QuestionCollection } from 'inquirer';
import { ConvenienceRenderer } from 'quicktype-core';
import { SegmentAPI } from '../api';

export interface TemplateContext {
  version: string;
  isDevelopment: boolean;
}

/**
 * A Code Generator is a function that emits code into the render step of Quicktype.
 *
 * We use this to emit analytics code for each plataform
 */
export type CodeGenerator = (renderer: ConvenienceRenderer) => void;

/**
 * Configuration for Typewriter Quicktype Renderers
 */
export interface QuicktypeTypewriterSettings {
  /**
   * Code Generators to execute for additional functions and code in the types output
   */
  generators: CodeGenerator[];
  typeNameModifiers?: {
    prefix?: string;
    suffix?: string;
  };
}

export type GeneratorOptions = {
  header?: string[];
  outputFilename: string;
  sdk: string;
  prefixes?: {
    functionName?: string;
    typeName?: string;
  };
  suffixes?: {
    functionName?: string;
    typeName?: string;
  };
} & Record<string, unknown>;

export type FileGenerateResult = ReadonlyMap<string, string>;

export interface LanguageGenerator {
  /**
   * Language ID
   */
  id: string;
  /**
   * Language User-Friendly Name
   */
  name: string;
  /**
   * File extension
   */
  extension: string;
  /**
   * Required settings for the language generation.
   * They are passed in an inquirer.js (https://github.com/SBoudrias/Inquirer.js) friendly version to be asked during configuration
   */
  requiredOptions?: QuestionCollection;
  /**
   * Advanced Options for the language generation.
   * They are passed in an inquirer.js (https://github.com/SBoudrias/Inquirer.js) friendly version to be asked during configuration
   */
  advancedOptions?: QuestionCollection;
  /**
   * Key-value pairs of supported SDKs by the language generator.
   * Key is the user friendly string
   * Value is used in the configuration
   */
  supportedSDKs: {
    [key: string]: string;
  };
  /**
   * Generates code from a set of Segment Protocol Rules
   * @param rules Segment PublicAPI rules object
   * @param options header, sdk and additional renderer options (optional)
   * @returns generated code as string
   */
  generate: (
    rules: SegmentAPI.RuleMetadata[],
    context: TemplateContext,
    options: GeneratorOptions,
  ) => Promise<FileGenerateResult>;
}
