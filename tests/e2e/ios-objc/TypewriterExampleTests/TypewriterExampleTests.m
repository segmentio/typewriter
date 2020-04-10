//
//  TypewriterExampleTests.m
//  TypewriterExampleTests
//
//  Created by Colin King on 6/7/19.
//  Copyright © 2019 Segment. All rights reserved.
//

#import <XCTest/XCTest.h>
#import <Analytics/SEGAnalytics.h>
#import <Analytics/SEGSegmentIntegration.h>
#import "SEGTypewriterAnalytics.h"

@interface TypewriterExampleTests : XCTestCase

@end

@implementation TypewriterExampleTests

- (void)testExample {
    [SEGTypewriterAnalytics emptyEvent];
    
    SEGRequiredArrayWithPropertiesItem1 *requiredArrayWithPropertiesItem =
        [SEGRequiredArrayWithPropertiesItem1 initWithRequiredAny:@"Rick Sanchez"
                                                   requiredArray:@[@137, @"C-137"]
                                                 requiredBoolean:NO
                                                     requiredInt:97
                                                  requiredNumber:@3.14
                                                  requiredObject:@{}
                                                  requiredString:@"Alpha-Betrium"
                                         requiredStringWithRegex:@"Lawyer Morty"];
    SEGRequiredObjectWithProperties1 *requiredObjectWithProperties =
        [SEGRequiredObjectWithProperties1 initWithRequiredAny:@"Rick Sanchez"
                                                requiredArray:@[@137, @"C-137"]
                                              requiredBoolean:NO
                                                  requiredInt:97
                                               requiredNumber:@3.14
                                               requiredObject:@{}
                                               requiredString:@"Alpha-Betrium"
                                      requiredStringWithRegex:@"Lawyer Morty"];
    [SEGTypewriterAnalytics everyRequiredTypeWithRequiredAny:@"Rick Sanchez"
                                               requiredArray:@[@137, @"C-137"]
                                 requiredArrayWithProperties:@[requiredArrayWithPropertiesItem]
                                             requiredBoolean:NO
                                                 requiredInt:97
                                              requiredNumber:@3.14
                                              requiredObject:@{}
                                requiredObjectWithProperties:requiredObjectWithProperties
                                              requiredString:@"Alpha-Betrium"
                                     requiredStringWithRegex:@"Lawyer Morty"];
    
    [SEGTypewriterAnalytics everyOptionalTypeWithOptionalAny:nil
                                               optionalArray:nil
                                 optionalArrayWithProperties:nil
                                             optionalBoolean:nil
                                                 optionalInt:nil
                                              optionalNumber:nil
                                              optionalObject:nil
                                optionalObjectWithProperties:nil
                                              optionalString:nil
                                     optionalStringWithRegex:nil];
    
    SEGOptionalArrayWithPropertiesItem1 *optionalArrayWithProperties =
        [SEGOptionalArrayWithPropertiesItem1 initWithOptionalAny:@"Rick Sanchez"
                                                   optionalArray:@[@137, @"C-137"]
                                                 optionalBoolean:@NO
                                                     optionalInt:@97
                                                  optionalNumber:@3.14
                                                  optionalObject:@{}
                                                  optionalString:@"Alpha-Betrium"
                                         optionalStringWithRegex:@"Lawyer Morty"];
    SEGOptionalObjectWithProperties1 *optionalObjectWithProperties =
        [SEGOptionalObjectWithProperties1 initWithOptionalAny:@"Rick Sanchez"
                                                optionalArray:@[@137, @"C-137"]
                                              optionalBoolean:@NO
                                                  optionalInt:@97
                                               optionalNumber:@3.14
                                               optionalObject:@{}
                                               optionalString:@"Alpha-Betrium"
                                      optionalStringWithRegex:@"Lawyer Morty"];
    [SEGTypewriterAnalytics everyOptionalTypeWithOptionalAny:@"Rick Sanchez"
                                               optionalArray:@[@137, @"C-137"]
                                 optionalArrayWithProperties:@[optionalArrayWithProperties]
                                             optionalBoolean:@NO optionalInt:@97
                                              optionalNumber:@3.14
                                              optionalObject:@{}
                                optionalObjectWithProperties:optionalObjectWithProperties
                                              optionalString:@"Alpha-Betrium"
                                     optionalStringWithRegex:@"Lawyer Morty"];

    SEGRequiredArrayWithPropertiesItem *nullableRequiredArrayWithNilPropertiesItem =
        [SEGRequiredArrayWithPropertiesItem initWithRequiredAny:nil
                                                  requiredArray:nil
                                                requiredBoolean:nil
                                                    requiredInt:nil
                                                 requiredNumber:nil
                                                 requiredObject:nil
                                                 requiredString:nil
                                        requiredStringWithRegex:nil];
    SEGRequiredObjectWithProperties *nullableRequiredObjectWithNilProperties =
        [SEGRequiredObjectWithProperties initWithRequiredAny:nil
                                               requiredArray:nil
                                             requiredBoolean:nil
                                                 requiredInt:nil
                                              requiredNumber:nil
                                              requiredObject:nil
                                              requiredString:nil
                                     requiredStringWithRegex:nil];
    [SEGTypewriterAnalytics everyNullableRequiredTypeWithRequiredAny:nil
                                                       requiredArray:nil
                                         requiredArrayWithProperties:@[nullableRequiredArrayWithNilPropertiesItem]
                                                     requiredBoolean:nil
                                                         requiredInt:nil
                                                      requiredNumber:nil
                                                      requiredObject:nil
                                        requiredObjectWithProperties:nullableRequiredObjectWithNilProperties
                                                      requiredString:nil
                                             requiredStringWithRegex:nil];

    SEGRequiredArrayWithPropertiesItem *nullableRequiredArrayWithPropertiesItem =
        [SEGRequiredArrayWithPropertiesItem initWithRequiredAny:@"Rick Sanchez"
                                                  requiredArray:@[@137, @"C-137"]
                                                requiredBoolean:@NO
                                                    requiredInt:@97
                                                 requiredNumber:@3.14
                                                 requiredObject:@{}
                                                 requiredString:@"Alpha-Betrium"
                                        requiredStringWithRegex:@"Lawyer Morty"];
    SEGRequiredObjectWithProperties *nullableRequiredObjectWithProperties =
        [SEGRequiredObjectWithProperties initWithRequiredAny:@"Rick Sanchez"
                                               requiredArray:@[@137, @"C-137"]
                                             requiredBoolean:@NO
                                                 requiredInt:@97
                                              requiredNumber:@3.14
                                              requiredObject:@{}
                                              requiredString:@"Alpha-Betrium"
                                     requiredStringWithRegex:@"Lawyer Morty"];
    [SEGTypewriterAnalytics everyNullableRequiredTypeWithRequiredAny:@"Rick Sanchez"
                                                       requiredArray:@[@137, @"C-137"]
                                         requiredArrayWithProperties:@[nullableRequiredArrayWithPropertiesItem]
                                                     requiredBoolean:@NO
                                                         requiredInt:@97
                                                      requiredNumber:@3.14
                                                      requiredObject:@{}
                                        requiredObjectWithProperties:nullableRequiredObjectWithProperties
                                                      requiredString:@"Alpha-Betrium"
                                             requiredStringWithRegex:@"Lawyer Morty"];
    
    [SEGTypewriterAnalytics everyNullableOptionalTypeWithOptionalAny:nil
                                                       optionalArray:nil
                                         optionalArrayWithProperties:nil
                                                     optionalBoolean:nil
                                                         optionalInt:nil
                                                      optionalNumber:nil
                                                      optionalObject:nil
                                        optionalObjectWithProperties:nil
                                                      optionalString:nil
                                             optionalStringWithRegex:nil];
    
    SEGOptionalArrayWithPropertiesItem *nullableOptionalArrayWithProperties =
        [SEGOptionalArrayWithPropertiesItem initWithOptionalAny:@"Rick Sanchez"
                                                  optionalArray:@[@137, @"C-137"]
                                                optionalBoolean:@NO
                                                    optionalInt:@97
                                                 optionalNumber:@3.14
                                                 optionalObject:@{}
                                                 optionalString:@"Alpha-Betrium"
                                        optionalStringWithRegex:@"Lawyer Morty"];
    SEGOptionalObjectWithProperties *nullableOptionalObjectWithProperties =
        [SEGOptionalObjectWithProperties initWithOptionalAny:@"Rick Sanchez"
                                               optionalArray:@[@137, @"C-137"]
                                             optionalBoolean:@NO
                                                 optionalInt:@97
                                              optionalNumber:@3.14
                                              optionalObject:@{}
                                              optionalString:@"Alpha-Betrium"
                                     optionalStringWithRegex:@"Lawyer Morty"];
    [SEGTypewriterAnalytics everyNullableOptionalTypeWithOptionalAny:@"Rick Sanchez"
                                                       optionalArray:@[@137, @"C-137"]
                                         optionalArrayWithProperties:@[nullableOptionalArrayWithProperties]
                                                     optionalBoolean:@NO
                                                         optionalInt:@97
                                                      optionalNumber:@3.14
                                                      optionalObject:@{}
                                        optionalObjectWithProperties:nullableOptionalObjectWithProperties
                                                      optionalString:@"Alpha-Betrium"
                                             optionalStringWithRegex:@"Lawyer Morty"];
    
    [SEGTypewriterAnalytics I42TerribleEventName3];
    
    [SEGTypewriterAnalytics propertySanitizedWithI0000TerriblePropertyName3:@"what a cronenberg"];
    
    [SEGTypewriterAnalytics eventCollided];
    [SEGTypewriterAnalytics eventCollided1];
    
    [SEGTypewriterAnalytics propertiesCollidedWithPropertyCollided:@"The Citadel"
                                                 propertyCollided1:@"Galactic Prison"];
    
    SEGUniverse *universe = [SEGUniverse initWithName:@"Froopyland" occupants:@[
        [SEGOccupantsItem initWithName:@"Beth Smith"],
        [SEGOccupantsItem initWithName:@"Thomas Lipkip"]
    ]];
    [SEGTypewriterAnalytics propertyObjectNameCollision1WithUniverse:universe];
    
    SEGUniverse1 *universe2 = [SEGUniverse1 initWithName:@"Froopyland" occupants:@[
        [SEGOccupantsItem1 initWithName:@"Beth Smith"],
        [SEGOccupantsItem1 initWithName:@"Thomas Lipkip"]
    ]];
    [SEGTypewriterAnalytics propertyObjectNameCollision2WithUniverse:universe2];
    
    // TODO: nullable??
    [SEGTypewriterAnalytics simpleArrayTypesWithAny:@[@137, @"C-137"]
                                            boolean:@[[NSNumber numberWithBool:TRUE], [NSNumber numberWithBool:FALSE]]
                                            integer:@[@97]
                                          nullable_:nil
                                             number:@[@3.14]
                                             object:@[[SEGObjectItem initWithName:@"Beth Smith"]]
                                             string:@[@"Alpha-Betrium"]];
    
    SEGSubterraneanLab *lab = [SEGSubterraneanLab initWithJerrysMemories:@[] mortysMemories:@[] summersContingencyPlan:@"Oh, man, it’s a scenario four."];
    SEGTunnel *tunnel = [SEGTunnel initWithSubterraneanLab:lab];
    SEGGarage *garage = [SEGGarage initWithTunnel:tunnel];
    [SEGTypewriterAnalytics nestedObjectsWithGarage:garage];
    
    [SEGTypewriterAnalytics nestedArraysWithUniverseCharacters:@[
                                                                 @[
                                                                     [SEGUniverseCharactersItemItem initWithName:@"Morty Smith"],
                                                                     [SEGUniverseCharactersItemItem initWithName:@"Rick Sanchez"]
                                                                     ],
                                                                 @[
                                                                     [SEGUniverseCharactersItemItem initWithName:@"Cronenberg Morty"],
                                                                     [SEGUniverseCharactersItemItem initWithName:@"Cronenberg Rick"]
                                                                     ]
                                                                 ]];
    
    [SEGTypewriterAnalytics largeNumbersEventWithLargeNullableOptionalInteger:@1230007112658965944
                                                  largeNullableOptionalNumber:@1240007112658965944331.0
                                                 largeNullableRequiredInteger:@1250007112658965944
                                                  largeNullableRequiredNumber:@1260007112658965944331.0
                                                         largeOptionalInteger:@1270007112658965944
                                                          largeOptionalNumber:@1280007112658965944331.0
                                                         largeRequiredInteger:1290007112658965944
                                                          largeRequiredNumber:@1300007112658965944331.0];

    // Note: flushing is an async operation in analytics-ios. Therefore, we use notifications to
    // identify when all events have finished flushing.
    __block BOOL finishedFlushing = false;
    [[NSNotificationCenter defaultCenter] addObserverForName:SEGSegmentRequestDidSucceedNotification object:nil queue:nil usingBlock:^(NSNotification *notification) {
        NSLog(@"Typewriter: SEGSegmentRequestDidSucceedNotification notification fired");
        finishedFlushing = true;
    }];
    // We also want to catch failures, so that our test suite will still finish.
    [[NSNotificationCenter defaultCenter] addObserverForName:SEGSegmentRequestDidFailNotification object:nil queue:nil usingBlock:^(NSNotification *notification) {
        NSLog(@"Typewriter: SEGSegmentRequestDidFailNotification notification fired");
        finishedFlushing = true;
    }];
    
    [[SEGAnalytics sharedAnalytics] flush];
    
    while(!finishedFlushing) {
        [[NSRunLoop currentRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:0.1]];
    }
}

@end
