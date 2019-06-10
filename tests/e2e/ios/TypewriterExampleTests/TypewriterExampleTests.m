//
//  TypewriterExampleTests.m
//  TypewriterExampleTests
//
//  Created by Colin King on 6/7/19.
//  Copyright © 2019 Segment. All rights reserved.
//

#import <XCTest/XCTest.h>
#import <Analytics/SEGAnalytics.h>
#import "SEGTypewriterAnalytics.h"

@interface TypewriterExampleTests : XCTestCase

@end

@implementation TypewriterExampleTests

NSString *const SIDECAR_ADDRESS = @"http://localhost:8765";

- (void)testExample {
    // TODO: Run through the standard tests!
    [[SEGAnalytics sharedAnalytics] track:@"Testing iOS Client"];
    
    // Send an event with no properties.
    [SEGTypewriterAnalytics emptyEvent];
    
    // Send an event with a custom option.
    [SEGTypewriterAnalytics emptyEventWithOptions:nil];
    [SEGTypewriterAnalytics emptyEventWithOptions:@{
                                                    @"foo": @"bar"
                                                    }];
    
    // Send an event with every combination of property type.
    SEGRequiredArrayItem *item = [SEGRequiredArrayItem initWithOptionalSubProperty:nil requiredSubProperty:@"Hello World"];
    SEGRequiredObject *requiredObject = [SEGRequiredObject initWithOptionalSubProperty:nil requiredSubProperty:@"Hello World"];
    [SEGTypewriterAnalytics eventWithAllTypesWithOptionalAny:nil optionalArray:nil optionalArrayEmpty:nil optionalBoolean:nil optionalInt:nil optionalNullableString:nil optionalNumber:nil optionalNumberOrString:nil optionalObject:nil optionalObjectEmpty:nil optionalString:nil optionalStringRegex:nil requiredAny:@123 requiredArray:@[item] requiredArrayEmpty:@[@123, @"Hello World"] requiredBoolean:NO requiredInt:123 requiredNullableString:nil requiredNumber:@3.1415 requiredNumberOrString:@123 requiredObject:requiredObject requiredObjectEmpty:@{@"test": @"foo"} requiredString:@"Hello World" requiredStringRegex:@"FOO"];
    
    [SEGTypewriterAnalytics exampleNamingCollision];
    
    [[SEGAnalytics sharedAnalytics] flush];
    
    // Wait for the analytics calls to become visible
    [NSThread sleepForTimeInterval:5.0f];
    [NSThread sleepForTimeInterval:5.0f];
}

@end
