// This code is auto-generated by Segment Typewriter. Do not edit.
#import "SEGTestTrackingPlanAnalytics.h"

#pragma mark - Helper functions

#define λ(decl, expr) (^(decl) { return (expr); })

static id NSNullify(id _Nullable x) {
    return (x == nil || x == NSNull.null) ? NSNull.null : x;
}

static NSDictionary<NSString *, id> *_Nullable addTypewriterContextFields(NSDictionary<NSString *, id> *_Nullable options) {
    options = options ?: @{};
    NSDictionary<NSString *, id> *customContext = options[@"context"] ?: @{};
    NSDictionary<NSString *, id> *typewriterContext = @{
                                                        @"typewriter": @{
                                                                @"name": @"gen-ios",
                                                                @"version": @"5.0.2"
                                                                }
                                                        };
    NSMutableDictionary *context = [NSMutableDictionary dictionaryWithCapacity:customContext.count + typewriterContext.count];
    [context addEntriesFromDictionary:customContext];
    [context addEntriesFromDictionary:typewriterContext];
    
    NSMutableDictionary *newOptions = [NSMutableDictionary dictionaryWithCapacity:options.count + 1];
    [newOptions addEntriesFromDictionary:options];
    [newOptions addEntriesFromDictionary:@{
                                           @"context": context
                                           }];
    return newOptions;
}

NS_ASSUME_NONNULL_BEGIN

static id prune(NSDictionary *dict) {
    NSMutableDictionary *prunedDict = [dict mutableCopy];
    NSArray *keysForNullValues = [dict allKeysForObject:[NSNull null]];
    [prunedDict removeObjectsForKeys:keysForNullValues];
    return prunedDict;
}

static id map(id collection, id (^f)(id value)) {
    id result = nil;
    if ([collection isKindOfClass:NSArray.class]) {
        result = [NSMutableArray arrayWithCapacity:[collection count]];
        for (id x in collection) [result addObject:f(x)];
    } else if ([collection isKindOfClass:NSDictionary.class]) {
        result = [NSMutableDictionary dictionaryWithCapacity:[collection count]];
        for (id key in collection) [result setObject:f([collection objectForKey:key]) forKey:key];
    }
    return result;
}

#pragma mark - Private interfaces

@interface SEGThe42_TerribleEventName3 (JSONConversion)
- (NSDictionary *)JSONDictionary;
@end

@interface SEGExampleEvent (JSONConversion)
- (NSDictionary *)JSONDictionary;
@end

@interface SEGOptionalArray (JSONConversion)
- (NSDictionary *)JSONDictionary;
@end

@interface SEGOptionalObject (JSONConversion)
- (NSDictionary *)JSONDictionary;
@end

@interface SEGRequiredArray (JSONConversion)
- (NSDictionary *)JSONDictionary;
@end

@interface SEGRequiredObject (JSONConversion)
- (NSDictionary *)JSONDictionary;
@end

@interface SEGTestTrackingPlanAnalytics ()
@property (nonatomic, nullable) SEGAnalytics *analytics;
@end

#pragma mark - JSON Serialization

@implementation SEGThe42_TerribleEventName3
+ (NSDictionary<NSString *, NSString *> *)properties
{
    static NSDictionary<NSString *, NSString *> *properties;
    return properties = properties ? properties : @{
        @"0000---terrible-property-name~!3": @"the0000TerriblePropertyName3",
        @"identifier_id": @"identifierID",
    };
}

- (void)setValue:(nullable id)value forKey:(NSString *)key
{
    id resolved = SEGThe42_TerribleEventName3.properties[key];
    if (resolved) [super setValue:value forKey:resolved];
}

- (NSDictionary *)JSONDictionary
{
    id dict = [[self dictionaryWithValuesForKeys:SEGThe42_TerribleEventName3.properties.allValues] mutableCopy];

    for (id jsonName in SEGThe42_TerribleEventName3.properties) {
        id propertyName = SEGThe42_TerribleEventName3.properties[jsonName];
        if (![jsonName isEqualToString:propertyName]) {
            dict[jsonName] = dict[propertyName];
            [dict removeObjectForKey:propertyName];
        }
    }

    return prune(dict);
}
@end

@implementation SEGThe42_TerribleEventName3Builder
+ (SEGThe42_TerribleEventName3 *)initWithBlock:(SEGThe42_TerribleEventName3BuilderBlock)block
{
    NSParameterAssert(block);

    SEGThe42_TerribleEventName3Builder *builder = [[SEGThe42_TerribleEventName3Builder alloc] init];
    block(builder);

    SEGThe42_TerribleEventName3 *the42TerribleEventName3 = [[SEGThe42_TerribleEventName3 alloc] init];
    the42TerribleEventName3.the0000TerriblePropertyName3 = builder.the0000TerriblePropertyName3;
    the42TerribleEventName3.identifierID = builder.identifierID;
    return the42TerribleEventName3;
}
@end

@implementation SEGExampleEvent
+ (NSDictionary<NSString *, NSString *> *)properties
{
    static NSDictionary<NSString *, NSString *> *properties;
    return properties = properties ? properties : @{
        @"optional any": @"optionalAny",
        @"optional array": @"optionalArray",
        @"optional array (empty)": @"optionalArrayEmpty",
        @"optional boolean": @"isOptionalBoolean",
        @"optional int": @"optionalInt",
        @"optional number": @"optionalNumber",
        @"optional object": @"optionalObject",
        @"optional object (empty)": @"optionalObjectEmpty",
        @"optional string": @"optionalString",
        @"optional string regex": @"optionalStringRegex",
        @"required any": @"requiredAny",
        @"required array": @"requiredArray",
        @"required array (empty)": @"requiredArrayEmpty",
        @"required boolean": @"isRequiredBoolean",
        @"required int": @"requiredInt",
        @"required number": @"requiredNumber",
        @"required object": @"requiredObject",
        @"required object (empty)": @"requiredObjectEmpty",
        @"required string": @"requiredString",
        @"required string regex": @"requiredStringRegex",
    };
}

- (void)setValue:(nullable id)value forKey:(NSString *)key
{
    id resolved = SEGExampleEvent.properties[key];
    if (resolved) [super setValue:value forKey:resolved];
}

- (NSDictionary *)JSONDictionary
{
    id dict = [[self dictionaryWithValuesForKeys:SEGExampleEvent.properties.allValues] mutableCopy];

    for (id jsonName in SEGExampleEvent.properties) {
        id propertyName = SEGExampleEvent.properties[jsonName];
        if (![jsonName isEqualToString:propertyName]) {
            dict[jsonName] = dict[propertyName];
            [dict removeObjectForKey:propertyName];
        }
    }

    [dict addEntriesFromDictionary:@{
        @"optional array": map(_optionalArray, λ(id x, [x JSONDictionary])),
        @"optional boolean": _isOptionalBoolean ? @YES : @NO,
        @"optional object": [_optionalObject JSONDictionary],
        @"required array": map(_requiredArray, λ(id x, [x JSONDictionary])),
        @"required boolean": _isRequiredBoolean ? @YES : @NO,
        @"required object": [_requiredObject JSONDictionary],
    }];

    return prune(dict);
}
@end

@implementation SEGExampleEventBuilder
+ (SEGExampleEvent *)initWithBlock:(SEGExampleEventBuilderBlock)block
{
    NSParameterAssert(block);

    SEGExampleEventBuilder *builder = [[SEGExampleEventBuilder alloc] init];
    block(builder);

    if (builder.requiredAny == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGExampleEvent is missing a required property: requiredAny" userInfo:NULL];
    }

    if (builder.requiredArray == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGExampleEvent is missing a required property: requiredArray" userInfo:NULL];
    }

    if (builder.requiredArrayEmpty == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGExampleEvent is missing a required property: requiredArrayEmpty" userInfo:NULL];
    }

    if (builder.isRequiredBoolean == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGExampleEvent is missing a required property: isRequiredBoolean" userInfo:NULL];
    }

    if (builder.requiredInt == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGExampleEvent is missing a required property: requiredInt" userInfo:NULL];
    }

    if (builder.requiredNumber == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGExampleEvent is missing a required property: requiredNumber" userInfo:NULL];
    }

    if (builder.requiredObject == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGExampleEvent is missing a required property: requiredObject" userInfo:NULL];
    }

    if (builder.requiredObjectEmpty == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGExampleEvent is missing a required property: requiredObjectEmpty" userInfo:NULL];
    }

    if (builder.requiredString == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGExampleEvent is missing a required property: requiredString" userInfo:NULL];
    }

    if (builder.requiredStringRegex == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGExampleEvent is missing a required property: requiredStringRegex" userInfo:NULL];
    }

    SEGExampleEvent *exampleEvent = [[SEGExampleEvent alloc] init];
    exampleEvent.optionalAny = builder.optionalAny;
    exampleEvent.optionalArray = builder.optionalArray;
    exampleEvent.optionalArrayEmpty = builder.optionalArrayEmpty;
    exampleEvent.isOptionalBoolean = builder.isOptionalBoolean;
    exampleEvent.optionalInt = builder.optionalInt;
    exampleEvent.optionalNumber = builder.optionalNumber;
    exampleEvent.optionalObject = builder.optionalObject;
    exampleEvent.optionalObjectEmpty = builder.optionalObjectEmpty;
    exampleEvent.optionalString = builder.optionalString;
    exampleEvent.optionalStringRegex = builder.optionalStringRegex;
    exampleEvent.requiredAny = builder.requiredAny;
    exampleEvent.requiredArray = builder.requiredArray;
    exampleEvent.requiredArrayEmpty = builder.requiredArrayEmpty;
    exampleEvent.isRequiredBoolean = builder.isRequiredBoolean;
    exampleEvent.requiredInt = builder.requiredInt;
    exampleEvent.requiredNumber = builder.requiredNumber;
    exampleEvent.requiredObject = builder.requiredObject;
    exampleEvent.requiredObjectEmpty = builder.requiredObjectEmpty;
    exampleEvent.requiredString = builder.requiredString;
    exampleEvent.requiredStringRegex = builder.requiredStringRegex;
    return exampleEvent;
}
@end

@implementation SEGOptionalArray
+ (NSDictionary<NSString *, NSString *> *)properties
{
    static NSDictionary<NSString *, NSString *> *properties;
    return properties = properties ? properties : @{
        @"optional sub-property": @"optionalSubProperty",
        @"required sub-property": @"requiredSubProperty",
    };
}

- (void)setValue:(nullable id)value forKey:(NSString *)key
{
    id resolved = SEGOptionalArray.properties[key];
    if (resolved) [super setValue:value forKey:resolved];
}

- (NSDictionary *)JSONDictionary
{
    id dict = [[self dictionaryWithValuesForKeys:SEGOptionalArray.properties.allValues] mutableCopy];

    for (id jsonName in SEGOptionalArray.properties) {
        id propertyName = SEGOptionalArray.properties[jsonName];
        if (![jsonName isEqualToString:propertyName]) {
            dict[jsonName] = dict[propertyName];
            [dict removeObjectForKey:propertyName];
        }
    }

    return prune(dict);
}
@end

@implementation SEGOptionalArrayBuilder
+ (SEGOptionalArray *)initWithBlock:(SEGOptionalArrayBuilderBlock)block
{
    NSParameterAssert(block);

    SEGOptionalArrayBuilder *builder = [[SEGOptionalArrayBuilder alloc] init];
    block(builder);

    if (builder.requiredSubProperty == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGOptionalArray is missing a required property: requiredSubProperty" userInfo:NULL];
    }

    SEGOptionalArray *optionalArray = [[SEGOptionalArray alloc] init];
    optionalArray.optionalSubProperty = builder.optionalSubProperty;
    optionalArray.requiredSubProperty = builder.requiredSubProperty;
    return optionalArray;
}
@end

@implementation SEGOptionalObject
+ (NSDictionary<NSString *, NSString *> *)properties
{
    static NSDictionary<NSString *, NSString *> *properties;
    return properties = properties ? properties : @{
        @"optional sub-property": @"optionalSubProperty",
        @"required sub-property": @"requiredSubProperty",
    };
}

- (void)setValue:(nullable id)value forKey:(NSString *)key
{
    id resolved = SEGOptionalObject.properties[key];
    if (resolved) [super setValue:value forKey:resolved];
}

- (NSDictionary *)JSONDictionary
{
    id dict = [[self dictionaryWithValuesForKeys:SEGOptionalObject.properties.allValues] mutableCopy];

    for (id jsonName in SEGOptionalObject.properties) {
        id propertyName = SEGOptionalObject.properties[jsonName];
        if (![jsonName isEqualToString:propertyName]) {
            dict[jsonName] = dict[propertyName];
            [dict removeObjectForKey:propertyName];
        }
    }

    return prune(dict);
}
@end

@implementation SEGOptionalObjectBuilder
+ (SEGOptionalObject *)initWithBlock:(SEGOptionalObjectBuilderBlock)block
{
    NSParameterAssert(block);

    SEGOptionalObjectBuilder *builder = [[SEGOptionalObjectBuilder alloc] init];
    block(builder);

    if (builder.requiredSubProperty == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGOptionalObject is missing a required property: requiredSubProperty" userInfo:NULL];
    }

    SEGOptionalObject *optionalObject = [[SEGOptionalObject alloc] init];
    optionalObject.optionalSubProperty = builder.optionalSubProperty;
    optionalObject.requiredSubProperty = builder.requiredSubProperty;
    return optionalObject;
}
@end

@implementation SEGRequiredArray
+ (NSDictionary<NSString *, NSString *> *)properties
{
    static NSDictionary<NSString *, NSString *> *properties;
    return properties = properties ? properties : @{
        @"optional sub-property": @"optionalSubProperty",
        @"required sub-property": @"requiredSubProperty",
    };
}

- (void)setValue:(nullable id)value forKey:(NSString *)key
{
    id resolved = SEGRequiredArray.properties[key];
    if (resolved) [super setValue:value forKey:resolved];
}

- (NSDictionary *)JSONDictionary
{
    id dict = [[self dictionaryWithValuesForKeys:SEGRequiredArray.properties.allValues] mutableCopy];

    for (id jsonName in SEGRequiredArray.properties) {
        id propertyName = SEGRequiredArray.properties[jsonName];
        if (![jsonName isEqualToString:propertyName]) {
            dict[jsonName] = dict[propertyName];
            [dict removeObjectForKey:propertyName];
        }
    }

    return prune(dict);
}
@end

@implementation SEGRequiredArrayBuilder
+ (SEGRequiredArray *)initWithBlock:(SEGRequiredArrayBuilderBlock)block
{
    NSParameterAssert(block);

    SEGRequiredArrayBuilder *builder = [[SEGRequiredArrayBuilder alloc] init];
    block(builder);

    if (builder.requiredSubProperty == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGRequiredArray is missing a required property: requiredSubProperty" userInfo:NULL];
    }

    SEGRequiredArray *requiredArray = [[SEGRequiredArray alloc] init];
    requiredArray.optionalSubProperty = builder.optionalSubProperty;
    requiredArray.requiredSubProperty = builder.requiredSubProperty;
    return requiredArray;
}
@end

@implementation SEGRequiredObject
+ (NSDictionary<NSString *, NSString *> *)properties
{
    static NSDictionary<NSString *, NSString *> *properties;
    return properties = properties ? properties : @{
        @"optional sub-property": @"optionalSubProperty",
        @"required sub-property": @"requiredSubProperty",
    };
}

- (void)setValue:(nullable id)value forKey:(NSString *)key
{
    id resolved = SEGRequiredObject.properties[key];
    if (resolved) [super setValue:value forKey:resolved];
}

- (NSDictionary *)JSONDictionary
{
    id dict = [[self dictionaryWithValuesForKeys:SEGRequiredObject.properties.allValues] mutableCopy];

    for (id jsonName in SEGRequiredObject.properties) {
        id propertyName = SEGRequiredObject.properties[jsonName];
        if (![jsonName isEqualToString:propertyName]) {
            dict[jsonName] = dict[propertyName];
            [dict removeObjectForKey:propertyName];
        }
    }

    return prune(dict);
}
@end

@implementation SEGRequiredObjectBuilder
+ (SEGRequiredObject *)initWithBlock:(SEGRequiredObjectBuilderBlock)block
{
    NSParameterAssert(block);

    SEGRequiredObjectBuilder *builder = [[SEGRequiredObjectBuilder alloc] init];
    block(builder);

    if (builder.requiredSubProperty == NULL) {
        @throw [NSException exceptionWithName:@"Missing Required Property" reason:@"SEGRequiredObject is missing a required property: requiredSubProperty" userInfo:NULL];
    }

    SEGRequiredObject *requiredObject = [[SEGRequiredObject alloc] init];
    requiredObject.optionalSubProperty = builder.optionalSubProperty;
    requiredObject.requiredSubProperty = builder.requiredSubProperty;
    return requiredObject;
}
@end

@implementation SEGTestTrackingPlanAnalytics
- (instancetype)initWithAnalytics:(SEGAnalytics *)analytics
{
    self = [super init];
    if (self) {
        _analytics = analytics;
    }
    return self;
}

- (void)the42TerribleEventName3:(SEGThe42_TerribleEventName3 *)props
{
    [self the42TerribleEventName3:props withOptions:@{}];
}
- (void)the42TerribleEventName3:(SEGThe42_TerribleEventName3 *)props withOptions:(NSDictionary<NSString *, id> *_Nullable)options
{
    [self.analytics track:@"42_--terrible==event++name~!3" properties:[props JSONDictionary] options:addTypewriterContextFields(options)];
}

- (void)emptyEvent:(SEGEmptyEvent *)props
{
    [self emptyEvent:props withOptions:@{}];
}
- (void)emptyEvent:(SEGEmptyEvent *)props withOptions:(NSDictionary<NSString *, id> *_Nullable)options
{
    [self.analytics track:@"Empty Event" properties:[props JSONDictionary] options:addTypewriterContextFields(options)];
}

- (void)exampleEvent:(SEGExampleEvent *)props
{
    [self exampleEvent:props withOptions:@{}];
}
- (void)exampleEvent:(SEGExampleEvent *)props withOptions:(NSDictionary<NSString *, id> *_Nullable)options
{
    [self.analytics track:@"Example Event" properties:[props JSONDictionary] options:addTypewriterContextFields(options)];
}

- (void)draft04Event:(SEGDraft04Event *)props
{
    [self draft04Event:props withOptions:@{}];
}
- (void)draft04Event:(SEGDraft04Event *)props withOptions:(NSDictionary<NSString *, id> *_Nullable)options
{
    [self.analytics track:@"Draft-04 Event" properties:[props JSONDictionary] options:addTypewriterContextFields(options)];
}

- (void)draft06Event:(SEGDraft06Event *)props
{
    [self draft06Event:props withOptions:@{}];
}
- (void)draft06Event:(SEGDraft06Event *)props withOptions:(NSDictionary<NSString *, id> *_Nullable)options
{
    [self.analytics track:@"Draft-06 Event" properties:[props JSONDictionary] options:addTypewriterContextFields(options)];
}
@end

NS_ASSUME_NONNULL_END
