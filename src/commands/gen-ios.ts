import {
  quicktypeMultiFile,
  InputData,
  JSONSchemaInput,
  ObjectiveCTargetLanguage,
  ObjectiveCRenderer,
  RenderContext,
  TargetLanguage,
  SerializedRenderResult,
  ClassType,
  Name,
  Sourcelike,
  Type,
  ObjectType
} from 'quicktype-core'
import { stringEscape } from 'quicktype-core/dist/support/Strings'
import { OptionValues, StringOption } from 'quicktype-core/dist/RendererOptions'
import { objcOptions } from 'quicktype-core/dist/language/Objective-C'

import {
  getTypedTrackHandler,
  TrackedEvent,
  builder as defaultBuilder,
  Params as DefaultParams
} from '../lib/cli'
import { getRawName } from '../lib/naming'
import { version } from '../../package.json'
import * as fs from 'fs'
import * as util from 'util'
import { map, camelCase, upperFirst, get } from 'lodash'

const writeFile = util.promisify(fs.writeFile)

export const command = 'gen-ios'
export const desc = 'Generate a strongly typed analytics-ios client'
export const builder = {
  ...defaultBuilder,
  trackingPlan: {
    type: 'string',
    required: true,
    description: 'Tracking Plan name to use for generated classes'
  },
  language: {
    type: 'string',
    required: false,
    default: 'objectivec',
    choices: ['objectivec'],
    description: 'Which iOS language bindings to output'
  },
  classPrefix: {
    type: 'string',
    required: false,
    default: 'SEG',
    description: 'Prefix to use for generated class names'
  }
}

export type Params = DefaultParams & {
  trackingPlan: string
  language: string
  classPrefix: string
}

declare type analyticsIOSObjectiveCOptions = typeof objcOptions & {
  trackingPlan: StringOption
}

class AnalyticsObjectiveCTargetLanguage extends ObjectiveCTargetLanguage {
  public trackingPlan: string
  public classPrefix: string

  constructor(trackingPlan: string, classPrefix: string) {
    super()
    this.trackingPlan = trackingPlan
    this.classPrefix = classPrefix
  }

  protected makeRenderer(
    renderContext: RenderContext,
    _: { [name: string]: any }
  ): ObjectiveCRenderer {
    return new AnalyticsObjectiveCWrapperRenderer(this, renderContext, {
      extraComments: false,
      justTypes: false,
      marshallingFunctions: false,
      classPrefix: this.classPrefix,
      features: { interface: true, implementation: true },
      trackingPlan: this.trackingPlan
    })
  }

  get supportsOptionalClassProperties(): boolean {
    return true
  }
}

class AnalyticsObjectiveCWrapperRenderer extends ObjectiveCRenderer {
  constructor(
    targetLanguage: TargetLanguage,
    renderContext: RenderContext,
    protected readonly options: OptionValues<analyticsIOSObjectiveCOptions>
  ) {
    super(targetLanguage, renderContext, options)
  }

  protected emitImports(globalImports: string[], localImports: string[]) {
    map(globalImports, i => {
      this.emitLine(`#import <${i}>`)
    })
    map(localImports, i => {
      this.emitLine(`#import "${i}"`)
    })
  }

  protected emitClassDeclaration(className: Sourcelike) {
    this.emitLine(['@class ', className, ';'])
  }

  protected emitClassDeclarations(fileName: string) {
    this.emitMark('Class Declarations')
    this.ensureBlankLine()

    this.forEachNamedType(
      'none',
      (_: ClassType, className: Name) => {
        this.emitClassDeclaration(className)
        this.emitClassDeclaration([className, 'Builder'])
      },
      (_, enumName) => this.emitLine('@class ', enumName, ';'),
      () => null
    )
    this.emitClassDeclaration(fileName)
  }

  protected emitInterfaces() {
    this.forEachNamedType(
      'leading-and-interposing',
      (t: ClassType, name: Name) => {
        this.emitInterface(name, { extends: 'NSObject' }, () => {
          this.emitClassProperties(t)
        })
        this.ensureBlankLine()

        this.emitLine(['typedef void (^ ', name, 'BuilderBlock)(', name, 'Builder *);'])
        this.emitInterface([name, 'Builder'], { extends: 'NSObject' }, () => {
          this.emitLine(['+ (', name, ' *)initWithBlock:(', name, 'BuilderBlock)block;'])
          this.emitClassProperties(t)
        })
      },
      () => null,
      () => null
    )
  }

  protected emitAnalyticsInterface(fileName: string) {
    this.emitInterface(fileName, { extends: 'NSObject' }, () => {
      this.emitLine('- (instancetype)initWithAnalytics:(SEGAnalytics *)analytics;')
      this.ensureBlankLine()

      this.forEachTopLevel('leading-and-interposing', (t: Type, name: Name) => {
        if (t instanceof ObjectType) {
          this.emitDescription(this.descriptionForType(t))
          const hasProperties = t.getProperties().size > 0
          this.emitLine([
            '- (void)',
            this.variableNameForTopLevel(name),
            ...(hasProperties ? [':(', name, ' *)props;'] : [';'])
          ])
          this.emitLine([
            '- (void)',
            this.variableNameForTopLevel(name),
            ':',
            ...(hasProperties ? ['(', name, ' *)props withOptions:'] : []),
            '(NSDictionary<NSString *, id> *_Nullable)options;'
          ])
        }
      })
    })
  }

  protected emitInterface(
    className: Sourcelike,
    options: { extends?: string; category?: string },
    emitContents: () => void
  ) {
    const optionalExtension = options.extends ? ` : ${options.extends}` : ''
    const optionalCategory = options.category !== undefined ? ` (${options.category})` : ''
    this.emitLine(['@interface ', className, optionalExtension, optionalCategory])
    emitContents()
    this.emitLine('@end')
  }

  protected emitImplementation(className: Sourcelike, emitContents: () => void) {
    this.emitLine(['@implementation ', className])
    emitContents()
    this.emitLine('@end')
  }

  protected emitAutogeneratedFileWarning() {
    this.emitCommentLines(['This code is auto-generated by Segment Typewriter. Do not edit.'])
  }

  protected emitInterfaceFile(fileName: string): void {
    this.startFile(fileName, 'h')
    this.emitAutogeneratedFileWarning()
    this.emitLine(['#ifndef ', fileName, '_h'])
    this.emitLine(['#define ', fileName, '_h'])
    this.ensureBlankLine()

    this.emitImports(['Foundation/Foundation.h', 'Analytics/SEGAnalytics.h'], [])
    this.ensureBlankLine()

    this.emitClassDeclarations(fileName)
    this.ensureBlankLine()

    this.emitLine('NS_ASSUME_NONNULL_BEGIN')
    this.ensureBlankLine()

    this.emitInterfaces()
    this.ensureBlankLine()

    this.emitAnalyticsInterface(fileName)
    this.ensureBlankLine()

    this.emitLine('NS_ASSUME_NONNULL_END')
    this.ensureBlankLine()

    this.emitLine(['#endif /* ', fileName, '_h */'])
    this.ensureBlankLine()

    this.finishFile()
  }

  protected emitTypewriterContextFields() {
    this.emitBlock(
      'static NSDictionary<NSString *, id> *_Nullable addTypewriterContextFields(NSDictionary<NSString *, id> *_Nullable options)',
      () => {
        this.emitLine('options = options ?: @{};')
        this.emitLine('NSDictionary<NSString *, id> *customContext = options[@"context"] ?: @{};')
        this.emitLine('NSDictionary<NSString *, id> *typewriterContext = @{')
        this.emitLine('                                                    @"typewriter": @{')
        this.emitLine(
          '                                                            @"name": @"',
          command,
          '",'
        )
        this.emitLine(
          '                                                            @"version": @"',
          version,
          '"'
        )
        this.emitLine('                                                            }')
        this.emitLine('                                                    };')
        this.emitLine(
          'NSMutableDictionary *context = [NSMutableDictionary dictionaryWithCapacity:customContext.count + typewriterContext.count];'
        )
        this.emitLine('[context addEntriesFromDictionary:customContext];')
        this.emitLine('[context addEntriesFromDictionary:typewriterContext];')
        this.emitLine('')
        this.emitLine(
          'NSMutableDictionary *newOptions = [NSMutableDictionary dictionaryWithCapacity:options.count + 1];'
        )
        this.emitLine('[newOptions addEntriesFromDictionary:options];')
        this.emitLine('[newOptions addEntriesFromDictionary:@{')
        this.emitLine('                                       @"context": context')
        this.emitLine('                                       }];')
        this.emitLine('return newOptions;')
      }
    )
  }

  protected emitImplementationHelpers() {
    this.emitLine(`#define λ(decl, expr) (^(decl) { return (expr); })`)
    this.ensureBlankLine()
    this.emitBlock('static id NSNullify(id _Nullable x)', () =>
      this.emitLine('return (x == nil || x == NSNull.null) ? NSNull.null : x;')
    )
    this.ensureBlankLine()
    this.emitTypewriterContextFields()
  }

  protected emitDictionaryPruner() {
    this.emitBlock('static id prune(NSDictionary *dict)', () => {
      this.emitLine('NSMutableDictionary *prunedDict = [dict mutableCopy];')
      this.emitLine('NSArray *keysForNullValues = [dict allKeysForObject:[NSNull null]];')
      this.emitLine('[prunedDict removeObjectsForKeys:keysForNullValues];')
      this.emitLine('return prunedDict;')
    })
  }

  protected emitPrivateInterfaces() {
    this.forEachNamedType(
      'leading-and-interposing',
      (_: ClassType, name: Name) => {
        this.emitInterface(name, { category: 'JSONConversion' }, () => {
          this.emitLine('- (NSDictionary *)JSONDictionary;')
        })
      },
      () => null,
      () => null
    )
  }

  protected emitPrivateAnalyticsInterface(name: Sourcelike) {
    this.emitInterface(name, { category: '' }, () => {
      this.emitLine('@property (nonatomic, nullable) SEGAnalytics *analytics;')
    })
  }

  protected emitPropertiesGetter(c: ClassType) {
    this.emitMethod('+ (NSDictionary<NSString *, NSString *> *)properties', () => {
      this.emitLine('static NSDictionary<NSString *, NSString *> *properties;')
      this.emitLine('return properties = properties ? properties : @{')
      this.indent(() => {
        this.forEachClassProperty(c, 'none', (name, jsonName) =>
          this.emitLine(`@"${stringEscape(jsonName)}": @"`, name, `",`)
        )
      })
      this.emitLine('};')
    })
  }

  protected emitSetter(name: Name) {
    this.emitMethod('- (void)setValue:(nullable id)value forKey:(NSString *)key', () => {
      this.emitLine(['id resolved = ', name, '.properties[key];'])
      this.emitLine('if (resolved) [super setValue:value forKey:resolved];')
    })
  }

  protected emitBuildMethod(c: ClassType, className: Name) {
    this.emitMethod(
      ['+ (', className, ' *)initWithBlock:(', className, 'BuilderBlock)block'],
      () => {
        this.emitLine('NSParameterAssert(block);')
        this.ensureBlankLine()

        this.emitLine([className, 'Builder *builder = [[', className, 'Builder alloc] init];'])
        this.emitLine('block(builder);')
        this.ensureBlankLine()

        this.forEachClassProperty(c, 'none', (name, _, prop) => {
          if (!prop.isOptional) {
            this.emitBlock(['if (builder.', name, ' == NULL)'], () => {
              this.emitLine([
                '@throw [NSException exceptionWithName:@"Missing Required Property" reason:@"',
                className,
                ' is missing a required property: ',
                name,
                '" userInfo:NULL];'
              ])
            })
            this.ensureBlankLine()
          }
        })

        const variableName = this.variableNameForTopLevel(className)
        this.emitLine([className, ' *', variableName, ' = [[', className, ' alloc] init];'])
        this.forEachClassProperty(c, 'none', name => {
          this.emitLine([variableName, '.', name, ' = builder.', name, ';'])
        })
        this.emitLine(['return ', variableName, ';'])
      }
    )
  }

  protected emitImplementations() {
    this.forEachNamedType(
      'leading-and-interposing',
      (c: ClassType, name: Name) => {
        this.emitImplementation(name, () => {
          this.emitPropertiesGetter(c)
          this.ensureBlankLine()

          if (this.hasIrregularProperties(c)) {
            this.emitSetter(name)
            this.ensureBlankLine()
          }

          this.emitJSONDictionary(c, name)
        })
        this.ensureBlankLine()

        this.emitImplementation([name, 'Builder'], () => {
          this.emitBuildMethod(c, name)
        })
      },
      () => null,
      () => null
    )
  }

  protected emitAnalyticsWrapperMethod(name: Name, hasProperties: boolean, withOptions: boolean) {
    const camelCaseName = this.variableNameForTopLevel(name)
    this.emitMethod(
      [
        '- (void)',
        camelCaseName,
        hasProperties || withOptions ? ':' : '',
        ...(hasProperties ? ['(', name, ' *)props'] : []),
        hasProperties && withOptions ? ' ' : '',
        ...(withOptions
          ? [
              hasProperties ? 'withOptions:' : '',
              '(NSDictionary<NSString *, id> *_Nullable)options'
            ]
          : [])
      ],
      () => {
        if (withOptions) {
          this.emitLine([
            '[self.analytics track:@"',
            getRawName(name),
            '" properties:',
            hasProperties ? '[props JSONDictionary]' : '@{}',
            withOptions ? ' options:addTypewriterContextFields(options)' : '',
            '];'
          ])
        } else {
          this.emitLine([
            '[self ',
            camelCaseName,
            ':',
            hasProperties ? 'props withOptions:' : '',
            '@{}];'
          ])
        }
      }
    )
  }

  protected emitAnalyticsWrapperImplementation(fileName: string) {
    this.emitImplementation(fileName, () => {
      this.emitMethod('- (instancetype)initWithAnalytics:(SEGAnalytics *)analytics', () => {
        this.emitLine('self = [super init];')
        this.emitBlock('if (self)', () => {
          this.emitLine('_analytics = analytics;')
        })
        this.emitLine('return self;')
      })
      this.ensureBlankLine()

      this.forEachTopLevel('leading-and-interposing', (t: Type, className: Name) => {
        if (t instanceof ObjectType) {
          const hasProperties = t.getProperties().size > 0
          this.emitAnalyticsWrapperMethod(className, hasProperties, false)
          this.emitAnalyticsWrapperMethod(className, hasProperties, true)
        }
      })
    })
  }

  protected emitImplementationFile(fileName: string) {
    this.startFile(fileName, 'm')
    this.emitAutogeneratedFileWarning()
    this.emitImports([], [`${fileName}.h`])
    this.ensureBlankLine()

    this.emitMark('Helper functions')
    this.ensureBlankLine()

    this.emitImplementationHelpers()
    this.ensureBlankLine()

    this.emitLine('NS_ASSUME_NONNULL_BEGIN')
    this.ensureBlankLine()

    this.emitDictionaryPruner()
    this.ensureBlankLine()

    this.emitMapFunction()
    this.ensureBlankLine()

    this.emitMark('Private interfaces')
    this.ensureBlankLine()

    this.emitPrivateInterfaces()
    this.ensureBlankLine()

    this.emitPrivateAnalyticsInterface(fileName)
    this.ensureBlankLine()

    this.emitMark('JSON Serialization')
    this.ensureBlankLine()

    this.emitImplementations()
    this.ensureBlankLine()

    this.emitAnalyticsWrapperImplementation(fileName)
    this.ensureBlankLine()

    this.emitLine('NS_ASSUME_NONNULL_END')
    this.ensureBlankLine()

    this.finishFile()
  }

  protected emitSourceStructure(_: string): void {
    const fileName = `${this.options.classPrefix}${upperFirst(
      camelCase(this.options.trackingPlan || '')
    )}Analytics`
    this.emitInterfaceFile(fileName)
    this.emitImplementationFile(fileName)
  }

  protected emitClassProperties(t: ClassType) {
    this.emitPropertyTable(t, (name, _, property) => {
      const attributes = ['nonatomic']
      if (property.isOptional) {
        attributes.push('nullable')
      }
      attributes.push(this.memoryAttribute(property.type, property.type.isNullable))
      return [
        ['@property ', ['(', attributes.join(', '), ')'], ' '],
        [this.pointerAwareTypeName(property.type), name, ';']
      ]
    })
  }

  protected emitJSONDictionary(c: ClassType, className: Name) {
    this.emitMethod('- (NSDictionary *)JSONDictionary', () => {
      if (!this.hasIrregularProperties(c) && !this.hasUnsafeProperties(c)) {
        this.emitLine(
          'return [self dictionaryWithValuesForKeys:',
          className,
          '.properties.allValues];'
        )
        return
      }

      this.emitLine(
        'id dict = [[self dictionaryWithValuesForKeys:',
        className,
        '.properties.allValues] mutableCopy];'
      )
      this.ensureBlankLine()

      if (this.hasIrregularProperties(c)) {
        this.emitBlock(['for (id jsonName in ', className, '.properties)'], () => {
          this.emitLine(`id propertyName = `, className, `.properties[jsonName];`)
          this.emitBlock(`if (![jsonName isEqualToString:propertyName])`, () => {
            this.emitLine(`dict[jsonName] = dict[propertyName];`)
            this.emitLine(`[dict removeObjectForKey:propertyName];`)
          })
        })
      }

      if (this.hasUnsafeProperties(c)) {
        this.ensureBlankLine()
        this.emitLine('[dict addEntriesFromDictionary:@{')
        this.indent(() => {
          this.forEachClassProperty(c, 'none', (propertyName, jsonKey, property) => {
            if (!this.implicitlyConvertsToJSON(property.type)) {
              const key = stringEscape(jsonKey)
              const name = ['_', propertyName]
              this.emitLine('@"', key, '": ', this.toDynamicExpression(property.type, name), ',')
            }
          })
        })
        this.emitLine('}];')
      }

      this.ensureBlankLine()
      // NOTE: modifying original JSONDictionary method via prune() here.
      this.emitLine('return prune(dict);')
    })
  }

  protected objcType(t: Type, _: boolean): [Sourcelike, string] {
    return super.objcType(t, true)
  }
}

export async function genObjC(events: TrackedEvent[], { trackingPlan, classPrefix }: Params) {
  const inputData = new InputData()

  events.forEach(({ name, rules }) => {
    const schema = {
      $schema: rules.$schema || 'http://json-schema.org/draft-07/schema#',
      title: rules.title,
      description: rules.description,
      ...get(rules, 'properties.properties', {})
    }

    inputData.addSource(
      'schema',
      { name, uris: [name], schema: JSON.stringify(schema) },
      () => new JSONSchemaInput(undefined)
    )
  })

  const lang = new AnalyticsObjectiveCTargetLanguage(trackingPlan, classPrefix)

  const files = await quicktypeMultiFile({ lang, inputData })
  return files
}

export const handler = getTypedTrackHandler(async (params: Params, { events }) => {
  let files: ReadonlyMap<string, SerializedRenderResult>

  if (params.language === 'objectivec') {
    files = await genObjC(events, params)
  } else {
    throw new Error(`Invalid language: ${params.language}`)
  }

  return Promise.all(
    map([...files.keys()], (fileName: string) => {
      return writeFile(`${params.outputPath}/${fileName}`, files.get(fileName)!.lines.join('\n'))
    })
  )
})
