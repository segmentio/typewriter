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

NSString *const SIDECAR_ADDRESS = @"http://localhost:8765";

NSInteger flushCount = 0;
// Note: make sure to update this count whenever adding new analytics calls below.
NSInteger const expectedFlushCount = 14;

- (void)testExample {
    // Listen for successful flush notifications, so that we can wait until all events have flushed before finishing the test.
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(messageSent:) name:SEGSegmentDidSendRequestNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(messageFlushed:) name:SEGSegmentRequestDidSucceedNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(messageFailedToFlush:) name:SEGSegmentRequestDidFailNotification object:nil];

    [SEGTypewriterAnalytics emptyEvent];
    
    [SEGTypewriterAnalytics everyRequiredTypeWithRequiredAny:@"Rick Sanchez" requiredArray:@[@137, @"C-137"] requiredBoolean:false requiredInt:97 requiredNumber:@3.14 requiredObject:@{} requiredString:@"Alpha-Betrium" requiredStringWithRegex:@"Lawyer Morty"];
    
    [SEGTypewriterAnalytics everyOptionalTypeWithOptionalAny:nil optionalArray:nil optionalBoolean:nil optionalInt:nil optionalNumber:nil optionalObject:nil optionalString:nil optionalStringWithRegex:nil];
    
    // TODO: pretty sure this is wrong...
    [SEGTypewriterAnalytics everyNullableRequiredTypeWithRequiredAny:nil requiredArray:nil requiredBoolean:nil requiredInt:nil requiredNumber:nil requiredObject:nil requiredString:nil requiredStringWithRegex:nil];
    
    [SEGTypewriterAnalytics everyNullableOptionalTypeWithOptionalAny:nil optionalArray:nil optionalBoolean:nil optionalInt:nil optionalNumber:nil optionalObject:nil optionalString:nil optionalStringWithRegex:nil];
    
    [SEGTypewriterAnalytics I42TerribleEventName3];
    
    [SEGTypewriterAnalytics propertySanitizedWithI0000TerriblePropertyName3:@"what a cronenberg"];
    
    [SEGTypewriterAnalytics eventCollided];
    [SEGTypewriterAnalytics eventCollided1];
    
    [SEGTypewriterAnalytics propertiesCollidedWithPropertyCollided:@"The Citadel" propertyCollided1:@"Galactic Prison"];
    
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
    [SEGTypewriterAnalytics simpleArrayTypesWithAny:@[@137, @"C-137"] boolean:@[[NSNumber numberWithBool:TRUE], [NSNumber numberWithBool:FALSE]] integer:@[@97] nullable_:nil number:@[@3.14] object:@[[SEGObjectItem initWithName:@"Beth Smith"]] string:@[@"Alpha-Betrium"]];
    
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
    
    // Note: flushing is an async operation in analytics-ios. Therefore, we use notifications (see above) to
    // identify when all events have finished flushing.
    [[SEGAnalytics sharedAnalytics] flush];
    
//    while (flushCount < expectedFlushCount) {
    NSLog(@"%d of %d events flushed so far, waiting...", (int) flushCount, (int) expectedFlushCount);
    [NSThread sleepForTimeInterval:5.0f];
//    }

    NSLog(@"Flushed all events");
}

- (void)messageSent:(nonnull NSNotification *)notification
{
    NSDictionary *info = notification.userInfo;
    NSLog(@"Segment: message sent");
    for(NSString *key in [info allKeys]) {
        NSLog(@"%@",[info objectForKey:key]);
    }
    
    NSArray *obj = notification.object;
    NSLog(@"%@", obj);
}

- (void)messageFlushed:(nonnull NSNotification *)notification
{
//    NSObject *integration = notification.object;
    NSDictionary *info = notification.userInfo;
    NSLog(@"Segment: message flushed");
    for(NSString *key in [info allKeys]) {
        NSLog(@"%@",[info objectForKey:key]);
    }
    flushCount += 1;
    
    NSArray *obj = notification.object;
    NSLog(@"%@", obj);
}

- (void)messageFailedToFlush:(nonnull NSNotification *)notification
{
    //    NSObject *integration = notification.object;
    NSLog(@"Segment: message failed to flushed");
    
    NSArray *obj = notification.object;
    NSLog(@"%@", obj);
}

@end
