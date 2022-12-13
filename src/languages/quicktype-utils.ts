import { debug as debugRegister } from "debug";
import * as fs from "fs";
import Handlebars from "handlebars";
import { DistinctQuestion } from "inquirer";
import { EOL } from "os";
import { resolve } from "path";
import {
  ConvenienceRenderer,
  getTargetLanguage,
  InputData,
  JSONSchema,
  JSONSchemaAttributes,
  JSONSchemaInput,
  JSONSchemaType,
  modifySource,
  Name,
  OptionDefinition,
  quicktypeMultiFile,
  Ref,
  RendererOptions,
  TargetLanguage,
  Type,
  TypeAttributeKind,
} from "quicktype-core";
import { originalWord } from "quicktype-core/dist/support/Strings";
import { isNamedType } from "quicktype-core/dist/TypeUtils";
import { SegmentAPI } from "../api";
import {
  CodeGenerator,
  FileGenerateResult,
  GeneratorOptions,
  LanguageGenerator,
  QuicktypeTypewriterSettings,
  TemplateContext,
} from "./types";

const debug = debugRegister("typewriter:quicktype-utils");

const INDENT_SIZE = 4;

function addPrefixAndSuffix(name: string, prefix?: string, suffix?: string) {
  return `${prefix ?? ""} ${name} ${suffix ?? ""}`;
}

/**
 * Wraps a name modifier with a prefixer and suffixer
 */
const modWithPrefixAndSuffix = (
  prefix?: string,
  suffix?: string,
  modifier?: (name: string) => string
): ((name: string) => string) => {
  return (name: string) => {
    const modName = addPrefixAndSuffix(name, prefix, suffix);
    if (modifier !== undefined) {
      return modifier(modName);
    }
    return modName;
  };
};

/**
 * This is an override for makeNameForTopLevel for our quicktype language renderers
 */
export function makeNameForTopLevelWithPrefixAndSuffix(
  namer: (t: Type, givenName: string, maybeNamedType: Type | undefined) => Name,
  typewriterSettings: QuicktypeTypewriterSettings,
  t: Type,
  givenName: string,
  maybeNamedType?: Type
): Name {
  const { prefix, suffix } = typewriterSettings.typeNameModifiers ?? {};
  const modName = addPrefixAndSuffix(givenName, prefix, suffix);
  return namer(t, modName, maybeNamedType);
}

export interface LanguageMetadata {
  id: string;
  name: string;
  extension: string;
  requiredOptions?: ReadonlyArray<DistinctQuestion>;
  advancedOptions?: ReadonlyArray<DistinctQuestion>;
}

function toInquirerQuestion(option: OptionDefinition): DistinctQuestion {
  // Option setting
  if (option.legalValues !== undefined && option.legalValues.length > 0) {
    return {
      type: option.multiple ? "checkbox" : "list",
      name: option.name,
      message: option.description,
      choices: option.legalValues,
      default: option.defaultValue,
    };
  }

  // String setting
  if (option.type === String) {
    return {
      type: "input",
      name: option.name,
      message: option.description,
      default: option.defaultValue,
    };
  }

  // Boolean Option
  return {
    type: "confirm",
    name: option.name,
    message: option.description,
    default: option.defaultValue,
  };
}

/**
 * Gets the language options from Quicktype and returns a Inquirer Prompt friendly object for use within the wizard of the init command
 * @param language the quicktype language name
 * @param unsupportedOptions (optional) array of quicktype options that are not supported to remove from the options
 * @returns LanguageMetadata object with all data required for a LanguageGenerator
 */
export function getLanguageMetadata(
  language: string,
  unsupportedOptions: string[] = [],
  requiredOptions: string[] = []
): LanguageMetadata {
  const lang = getTargetLanguage(language);

  const advancedOpts: DistinctQuestion[] = [];
  const requiredOpts: DistinctQuestion[] = [];

  for (const opt of lang.optionDefinitions) {
    if (unsupportedOptions.includes(opt.name as string)) {
      continue;
    }

    const question = toInquirerQuestion(opt);
    if (requiredOptions.includes(opt.name)) {
      requiredOpts.push(question);
    } else {
      advancedOpts.push(question);
    }
  }

  return {
    id: lang.name,
    name: lang.displayName,
    extension: lang.extension,
    requiredOptions: requiredOpts,
    advancedOptions: advancedOpts,
  };
}

/**
 * Calculates the correct indentation level for the generated code from a template file line and an input indentation size
 * @param line template file line
 * @param indentSize indent size on the template file
 * @returns an object containing indentation level and the text to output to the generated code
 */
export function calculateLineIndentationLevel(
  line: string,
  indentSize: number = INDENT_SIZE
): { indent: number; text: string | null } {
  const len = line.length;
  let indent = 0;
  for (let i = 0; i < len; i++) {
    const c = line.charAt(i);
    if (c === " ") {
      indent += 1;
    } else if (c === "\t") {
      indent = (indent / indentSize + 1) * indentSize;
    } else {
      return { indent, text: line.substring(i) };
    }
  }
  return { indent: 0, text: null };
}

interface NameModifiers {
  functionName?: (serialized: string) => string;
}

/**
 * Creates a set of code generators from multiple paths to HandleBars templates
 *
 * @param paths paths to Handlebars templates
 * @returns a set of CodeGenerators
 */
export function createCodeGeneratorsFromTemplates(
  context: TemplateContext,
  nameModifiers?: NameModifiers,
  ...paths: string[]
): CodeGenerator[] {
  return paths.map((path) =>
    createCodeGeneratorFromTemplate(path, context, nameModifiers)
  );
}

/**
 * Creates a CodeGenerator from a Handlebars template
 *
 * @param path path to handlebars template
 * @returns a CodeGenerator
 */
function createCodeGeneratorFromTemplate(
  path: string,
  context: TemplateContext,
  nameModifiers?: NameModifiers
): CodeGenerator {
  const absolutePath = resolve(__dirname, path);
  try {
    const template = fs.readFileSync(absolutePath);
    Handlebars.registerHelper("eq", (a, b) => a === b);
    const generator = Handlebars.compile(template.toString());

    return (renderer) => {
      const tags: Record<string, any> = {
        type: [],
        version: context.version,
        isDevelopment: context.isDevelopment,
      };

      // @ts-ignore this is a protected method but we need it to access the particulars of each type
      renderer.forEachTopLevel(
        "none",
        (type, name) => {
          const metadata: EventMetadata = type
            .getAttributes()
            .get(eventMetadataAttributeKind);

          tags.type.push({
            eventName: metadata.name,
            eventType: metadata.type,
            // @ts-ignore
            description: renderer.descriptionForType(type)?.join(" "),
            // @ts-ignore
            functionName: renderer.sourcelikeToString(
              modifySource(nameModifiers?.functionName ?? originalWord, name)
            ),
            // @ts-ignore
            typeName: renderer.sourcelikeToString(name),
            rawJSONSchema: JSON.stringify(metadata.raw),
          });
        },
        isNamedType
      );

      return renderer.emitMultiline(generator(tags));
    };
  } catch (error) {
    throw new Error(
      `Error while reading template at ${absolutePath}: ${JSON.stringify(
        error
      )}`
    );
  }
}

/**
 * Overrides the emitMultiline in a Renderer with an option for variable indent sizes
 * @param renderer Quicktype Renderer
 * @param linesString contents to output
 * @param indentSize indent size in spaces number
 * @returns
 */
export function emitMultiline(
  renderer: ConvenienceRenderer,
  linesString: string,
  indentSize: number = 4
): void {
  const lines = linesString.split("\n");
  const numLines = lines.length;
  if (numLines === 0) return;
  renderer.emitLine(lines[0]);
  let currentIndent = 0;
  for (let i = 1; i < numLines; i++) {
    const line = lines[i];
    const { indent, text } = calculateLineIndentationLevel(line, indentSize);
    if (text !== null) {
      const newIndent = Math.floor(indent / indentSize);
      const leadSpaces = indent % indentSize;
      renderer.changeIndent(newIndent - currentIndent);
      currentIndent = newIndent;
      renderer.emitLine(" ".repeat(leadSpaces), text);
    } else {
      renderer.emitLine();
    }
  }
  if (currentIndent !== 0) {
    renderer.changeIndent(-currentIndent);
  }
}

/**
 * Executes all the CodeGenerators in a RenderPlan, for use in a LanguageRenderer
 * @param renderer A QuickType language Renderer
 * @param templatePlan an array of CodeGenerator functions to execute
 * @param nameModifiers Name Modifiers to apply for functions and types
 */
export function executeRenderPlan(
  renderer: ConvenienceRenderer,
  templatePlan: CodeGenerator[]
): void {
  if (templatePlan.length === 0) {
    return;
  }

  renderer.ensureBlankLine();
  for (const plan of templatePlan) {
    plan(renderer);
  }
}

/**
 * Returns the language options after filtering unsupported settings and
 * applying default values to missing settings
 * @param options Language Generator options
 * @param defaultValues Map of default values for the options
 * @param unsupportedOptions List of unsupported quicktype options
 * @returns A cleaned map of the settings with default values applied
 */
export function cleanOptions(
  options: GeneratorOptions,
  defaultValues: { [key: string]: any } = {},
  unsupportedOptions: string[] = []
): GeneratorOptions {
  const filteredOptions = Object.fromEntries(
    Object.entries(options).filter(
      ([key, _]) => !unsupportedOptions.includes(key as string)
    )
  );
  return {
    ...defaultValues,
    ...filteredOptions,
  } as GeneratorOptions;
}

interface EventMetadata {
  name: string;
  type: SegmentAPI.RuleType;
  raw: JSONSchema;
}

class EventMetadataAttributeKind extends TypeAttributeKind<EventMetadata> {
  constructor() {
    super("eventMetadata");
  }

  combine(attrs: EventMetadata[]): EventMetadata | undefined {
    return attrs[0];
  }

  makeInferred(_: EventMetadata): undefined {
    return undefined;
  }
}

const eventMetadataAttributeKind: TypeAttributeKind<EventMetadata> =
  new EventMetadataAttributeKind();

/**
 * Extracts and injects the event metadata into the attributes for the quicktype types
 */
function eventAttributesProducer(
  schema: JSONSchema,
  _canonicalRef: Ref | undefined,
  _types: Set<JSONSchemaType>
): JSONSchemaAttributes | undefined {
  if (typeof schema !== "object" || schema.eventMetadata === undefined)
    return undefined;

  // Remove the eventMetadata from the raw schema
  const { eventMetadata, ...rawSchema } = schema;
  const metadata = eventMetadataAttributeKind.makeAttributes({
    ...schema.eventMetadata,
    raw: rawSchema,
  });

  return { forType: metadata };
}

/**
 * Translates the Segment Protocol Rules into a JSONSchemaInput object for Quicktype
 * @param rules Segment PublicAPI Rules object
 * @returns InputData object for Quicktype to read as a JSON Schema
 */
async function getSchemaInputData(
  rules: SegmentAPI.RuleMetadata[]
): Promise<InputData> {
  const schemaInput = new JSONSchemaInput(undefined, [eventAttributesProducer]);
  for (const rule of rules ?? []) {
    await schemaInput.addSource({
      name: rule.key,
      schema: JSON.stringify(rule.jsonSchema),
    });
  }
  const inputData = new InputData();
  inputData.addInput(schemaInput);
  return inputData;
}

/**
 * Generates types using Quicktype. Convenience method for calling quicktype with Segment Rules.
 * @param language Quicktype Language
 * @param rules SegmentAPI Tracking Plan Rules
 * @param options Renderer options
 * @returns A File Map of filename : contents
 */
export async function generateWithQuicktype(
  language: string | TargetLanguage,
  rules: SegmentAPI.RuleMetadata[],
  options: GeneratorOptions
): Promise<FileGenerateResult> {
  const { header, sdk, outputFilename, ...rendererOptions } = options;
  const inputData = await getSchemaInputData(rules);

  const files = await quicktypeMultiFile({
    inputData,
    lang: language,
    leadingComments: header,
    fixedTopLevels: true,
    outputFilename,
    // debugPrintGraph: true,
    rendererOptions: rendererOptions as RendererOptions,
  });

  const output = new Map<string, string>();

  for (const [k, v] of files.entries()) {
    output.set(k, v.lines.join(EOL));
  }

  return output;
}

/**
 * Configuration for createQuicktypeLanguageGenerator.
 * Let's you create easily a new language from Quicktype's generator
 */
interface FactoryConfig<T extends TargetLanguage> {
  /**
   * QuickType Language Name (Must match Quicktype's language name)
   */
  name: string;
  /**
   * QuickType Language Class
   */
  quicktypeLanguage: new (typewriterOptions: QuicktypeTypewriterSettings) => T;
  /**
   * Supported SDKs for the Language to create
   */
  supportedSDKs: {
    /**
     * Unique ID for the SDk
     */
    id: string;
    /**
     * Name of the SDK (User Friendly)
     */
    name: string;
    /**
     * Template path relative to the languages module
     */
    templatePath?: string;
  }[];
  /**
   * Default option values
   */
  defaultOptions?: { [key: string]: any };
  /**
   * Quictype's unsupported options
   * These won't be visible or configurable by the user
   */
  unsupportedOptions?: string[];
  /**
   * Modifiers for Functions and Type names.
   */
  nameModifiers?: NameModifiers;
  /**
   * Keys for the Quicktype options that need to be set
   */
  requiredOptions?: string[];
}

/**
 * Creates a LanguageGenerator using Quicktype for the types and Handlebars for templates.
 * @param config a FactoryConfig object
 * @returns a LanguageGenerator object for Typewriter
 */
export function createQuicktypeLanguageGenerator<T extends TargetLanguage>(
  config: FactoryConfig<T>
): LanguageGenerator {
  const {
    name,
    quicktypeLanguage,
    supportedSDKs,
    defaultOptions,
    unsupportedOptions,
    nameModifiers,
    requiredOptions,
  } = config;
  const metadata = getLanguageMetadata(
    name,
    unsupportedOptions,
    requiredOptions
  );

  const sdks: { [key: string]: string } = {};
  const templates: { [key: string]: string | undefined } = {};

  for (const sdk of supportedSDKs) {
    const id = sdk.id.toLocaleLowerCase();
    sdks[sdk.name] = id;
    templates[id] = sdk.templatePath;
  }

  return {
    id: metadata.id,
    name: metadata.name,
    extension: metadata.extension,
    advancedOptions: metadata.advancedOptions,
    requiredOptions: metadata.requiredOptions,
    supportedSDKs: sdks,
    generate: async (
      rules: SegmentAPI.RuleMetadata[],
      context: TemplateContext,
      options: GeneratorOptions
    ): Promise<FileGenerateResult> => {
      const { sdk, prefixes, suffixes } = options;
      let codeGenerators: CodeGenerator[];
      const templatePath = templates[sdk.toLocaleLowerCase()];
      debug(
        "Starting Quicktype Generator for SDK:",
        sdk,
        "Language:",
        metadata.name,
        "Template Path:",
        templatePath,
        "Options",
        options
      );
      if (templatePath === undefined) {
        codeGenerators = [];
        debug(`Generate ${metadata.name} just types`);
      } else {
        const mods: NameModifiers = {
          functionName: modWithPrefixAndSuffix(
            prefixes?.functionName,
            suffixes?.functionName,
            nameModifiers?.functionName
          ),
        };
        codeGenerators = createCodeGeneratorsFromTemplates(
          context,
          mods,
          templatePath
        );
        debug(`Generate ${metadata.name} using template: ${templatePath}`);
      }

      return generateWithQuicktype(
        new quicktypeLanguage({
          generators: codeGenerators,
          typeNameModifiers: {
            prefix: prefixes?.typeName,
            suffix: suffixes?.typeName,
          },
        }),
        rules,
        cleanOptions(options, defaultOptions, unsupportedOptions)
      );
    },
  };
}
