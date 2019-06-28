//
//  AppDelegate.m
//  TypewriterExample
//
//  Created by Colin King on 10/02/18.
//  Copyright © 2018 Segment. All rights reserved.
//

#import <Analytics/SEGAnalytics.h>
#import "AppDelegate.h"


@interface AppDelegate ()

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Setup a Segment analytics-ios instance.
    [SEGAnalytics debug:YES];
    SEGAnalyticsConfiguration *configuration = [SEGAnalyticsConfiguration configurationWithWriteKey:@"1z5lR0MY95gEknwdn8F5G32poHJ9Riny"];
    configuration.trackApplicationLifecycleEvents = NO;
    configuration.flushAt = 999;
    
    // Customize the requestFactory to point at our sidecar container, which snapshots all analytics calls.
    configuration.requestFactory = ^(NSURL *url) {
        NSLog(@"some funky business is afoot!");
        NSURLComponents *components = [NSURLComponents componentsWithURL:url resolvingAgainstBaseURL:NO];
        components.scheme = @"http";
        components.host = @"localhost";
        components.port = @8765;
        NSURL *transformedURL = components.URL;
        return [NSMutableURLRequest requestWithURL:transformedURL];
//        return [NSMutableURLRequest requestWithURL:url];
    };

    [SEGAnalytics setupWithConfiguration:configuration];

    return YES;
}

@end
