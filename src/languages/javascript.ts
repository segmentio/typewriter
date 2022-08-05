import { Answers, QuestionCollection } from 'inquirer';
import { ModuleKind, ScriptTarget, transpileModule } from 'typescript';
import { SegmentAPI } from '../api';
import { getLanguageMetadata } from './quicktype-utils';
import { FileGenerateResult, GeneratorOptions, LanguageGenerator, TemplateContext } from './types';
import { typescript } from './typescript';

class JavascriptGenerator implements LanguageGenerator {
  id: string;
  name: string;
  extension: string;
  advancedOptions?: QuestionCollection<Answers> | undefined;
  supportedSDKs = typescript.supportedSDKs;

  defaultQuicktypeOptions = {
    'just-types': true,
  };

  constructor() {
    const data = getLanguageMetadata('javascript');
    this.name = data.name;
    this.id = data.id;
    this.extension = data.extension;
    this.advancedOptions = [
      {
        type: 'list',
        name: 'target',
        message: 'Target',
        choices: [
          { name: 'ES3', value: ScriptTarget.ES3 },
          { name: 'ES5', value: ScriptTarget.ES5 },
          { name: 'ES2015', value: ScriptTarget.ES2015 },
          { name: 'ES2016', value: ScriptTarget.ES2016 },
          { name: 'ES2017', value: ScriptTarget.ES2017 },
          { name: 'ES2018', value: ScriptTarget.ES2018 },
          { name: 'ES2019', value: ScriptTarget.ES2019 },
          { name: 'ESNext', value: ScriptTarget.ESNext },
          { name: 'Latest', value: ScriptTarget.Latest },
        ],
        default: ScriptTarget.ESNext,
      },
      {
        type: 'list',
        name: 'module',
        message: 'Module',
        choices: [
          { name: 'CommonJS', value: ModuleKind.CommonJS },
          { name: 'AMD', value: ModuleKind.AMD },
          { name: 'UMD', value: ModuleKind.UMD },
          { name: 'System', value: ModuleKind.System },
          { name: 'ES2015', value: ModuleKind.ES2015 },
          { name: 'ESNext', value: ModuleKind.ESNext },
        ],
        default: ModuleKind.ESNext,
      },
    ];
  }

  generate = async (
    rules: SegmentAPI.RuleMetadata[],
    context: TemplateContext,
    options: GeneratorOptions,
  ): Promise<FileGenerateResult> => {
    const files = await typescript.generate(rules, context, options);
    const transpiledFiles = new Map<string, string>();

    for (const [name, contents] of files.entries()) {
      const { outputText } = transpileModule(contents, {
        compilerOptions: {
          target: options.target as ScriptTarget,
          module: options.module as ModuleKind,
          esModuleInterop: true,
        },
      });
      transpiledFiles.set(name, outputText);
    }
    // TODO: Prettier
    return transpiledFiles;
  };
}

export const javascript = new JavascriptGenerator();
