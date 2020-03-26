/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <UserNotifications/UserNotifications.h>
#import <React/RCTUtils.h>
#import <React/RCTPushNotificationManager.h>
#import <BugsnagReactNative/BugsnagReactNative.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Blum"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor clearColor];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  
  UIView *backgroundView = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] firstObject];
  backgroundView.frame = self.window.bounds;
  
  UIView *launchScreenView = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] firstObject];
  rootView.frame = self.window.bounds;
  launchScreenView.frame = self.window.bounds;
  rootView.loadingView = launchScreenView;
  [backgroundView addSubview: rootView];
  
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = backgroundView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [UIApplication sharedApplication].idleTimerDisabled = YES;
  
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound + UNAuthorizationOptionBadge)
                        completionHandler:^(BOOL granted, NSError * _Nullable error)
  {
    if (!granted) {
      NSLog(@"Permission for notifiations not granted");
    }
  }];
 
  [UIDevice currentDevice].batteryMonitoringEnabled = true;
  [BugsnagReactNative start];

  return YES;
}

@end
