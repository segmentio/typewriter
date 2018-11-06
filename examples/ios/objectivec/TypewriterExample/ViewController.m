//
//  ViewController.m
//  TypewriterExample
//
//  Created by Colin King on 10/02/18.
//  Copyright © 2018 Segment. All rights reserved.
//

#import "ViewController.h"

#import <Analytics/SEGAnalytics.h>
#import "Analytics/SEGKicksAppAnalytics.h"


@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *productTextField;
@property (weak, nonatomic) IBOutlet UITextField *sentTextView;
@property SEGKicksAppAnalytics *kicksAppAnalytics;
@end


@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.sentTextView.alpha = 0;

    self.kicksAppAnalytics = [[SEGKicksAppAnalytics alloc] initWithAnalytics:[SEGAnalytics sharedAnalytics]];
}

- (IBAction)fireEvent:(id)sender
{
    NSNumber *productPrice = @9.99;
    SEGProduct *product = [SEGProductBuilder initWithBlock:^(SEGProductBuilder *builder) {
        builder.brand = @"Kicks App";
        builder.name = self.productTextField.text;
        builder.price = productPrice;
    }];
    NSArray *products = @[product];
    SEGOrderCompleted *order = [SEGOrderCompletedBuilder initWithBlock:^(SEGOrderCompletedBuilder *builder) {
        builder.currency = @"USD";
        builder.orderID = [[NSUUID UUID] UUIDString];
        builder.total = productPrice;
        builder.products = products;
    }];
    [self.kicksAppAnalytics orderCompleted:order];

    self.sentTextView.alpha = 1;
    [UIView animateWithDuration:0.5 delay:1 options:UIViewAnimationOptionCurveEaseIn animations:^{ self.sentTextView.alpha = 0;} completion:nil];
}
@end
