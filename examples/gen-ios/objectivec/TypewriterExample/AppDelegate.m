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

NSString *const SEGMENT_WRITE_KEY = @"1z5lR0MY95gEknwdn8F5G32poHJ9Riny";

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [SEGAnalytics debug:YES];
    SEGAnalyticsConfiguration *configuration = [SEGAnalyticsConfiguration configurationWithWriteKey:SEGMENT_WRITE_KEY];
    configuration.trackApplicationLifecycleEvents = YES;
    configuration.trackAttributionData = YES;
    configuration.flushAt = 1;
    [SEGAnalytics setupWithConfiguration:configuration];
    NSLog(@"application:didFinishLaunchingWithOptions: %@", launchOptions);
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    NSLog(@"applicationWillResignActive:");
}


- (void)applicationDidEnterBackground:(UIApplication *)application
{
    NSLog(@"applicationDidEnterBackground:");
}


- (void)applicationWillEnterForeground:(UIApplication *)application
{
    NSLog(@"applicationWillEnterForeground:");
}


- (void)applicationDidBecomeActive:(UIApplication *)application
{
    NSLog(@"applicationDidBecomeActive:");
}


- (void)applicationWillTerminate:(UIApplication *)application
{
    NSLog(@"applicationWillTerminate:");
}

@end
