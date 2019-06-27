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
    // TODO
    
    [[SEGAnalytics sharedAnalytics] flush];
    
    // Wait for the analytics calls to become visible
    [NSThread sleepForTimeInterval:5.0f];
}

@end
