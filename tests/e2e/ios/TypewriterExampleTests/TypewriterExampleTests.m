//
//  TypewriterExampleTests.m
//  TypewriterExampleTests
//
//  Created by Colin King on 6/7/19.
//  Copyright © 2019 Segment. All rights reserved.
//

#import <XCTest/XCTest.h>
#import <Analytics/SEGAnalytics.h>

@interface TypewriterExampleTests : XCTestCase

@end

@implementation TypewriterExampleTests

NSString *const SIDECAR_ADDRESS = @"http://localhost:8765";

- (void)testExample {
    // TODO: Run through the standard tests!
    [[SEGAnalytics sharedAnalytics] track:@"Testing iOS Client"];
    
    [[SEGAnalytics sharedAnalytics] flush];
    
    // Wait for the analytics calls to become visible
    [NSThread sleepForTimeInterval:5.0f];
    [NSThread sleepForTimeInterval:5.0f];
}

@end
