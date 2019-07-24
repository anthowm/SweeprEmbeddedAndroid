//
//  SweeprScanBridge.m
//  SwiftBridge
//
//  Created by Eoin Norris on 07/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#include "RCTSweeprScanBridge.h"
#import "RCTSweeprScanSerializer.h"
#import "RCTBaseBridge.h"


@implementation RCTSweeprScanBridge

RCT_EXPORT_MODULE(SweeprScan);

- (instancetype)init
{
  self = [super init];
  if (self) {
   self.sweeprScan = [[SweeprScan alloc] initWithDelegate:self];
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_METHOD(reset) {
  [self.sweeprScan reset];
}

RCT_EXPORT_METHOD(startDemo) {
  [self.sweeprScan startDemo];
}

RCT_EXPORT_METHOD(startLanScanWithOption:(nonnull NSNumber*)optionsN) {
  (void)[self.sweeprScan startLanScanWithOption:(SweeprScanOptions)optionsN.integerValue];
}

#define RANDOM_BSSID 0
#define FAKE_CELLULAR 0


RCT_EXPORT_METHOD(getBSSID:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter){
#if TARGET_OS_SIMULATOR
  NSDictionary* dict = NULL;
  NSString* wifiStr = @"51M-14-22-01-23-10+cccab123";
#if RANDOM_BSSID
  int rand = arc4random_uniform(1000);
  NSString* rStr = [NSString stringWithFormat:@"%d", rand];
  wifiStr = [NSString stringWithFormat:@"51M-14-22-01-23-10+cccab123%@",rStr];
  dict = [NSDictionary dictionaryWithObject:wifiStr forKey:@"BSSID"];
#elif FAKE_CELLULAR
  dict = NULL;
#else
    dict = [NSDictionary dictionaryWithObject:wifiStr forKey:@"BSSID"];
#endif
  promise(dict);
#else
  NSString* BSSID = [self.sweeprScan fetchBSSIDInfo];
  if (BSSID.length > 0) {
    NSDictionary* dict = [NSDictionary dictionaryWithObject:BSSID forKey:@"BSSID"];
    promise(dict);
  } else {
    NSDictionary *userInfo = @{

                               NSLocalizedFailureReasonErrorKey: NSLocalizedString(@"Failed to get BSSID", nil),
                               };
    NSError* error = [NSError errorWithDomain:@"com.sweepr.scan" code:404 userInfo:userInfo];
    rejecter(@"404",@"Missing BSSID", error);
  }
#endif

}

- (dispatch_queue_t)methodQueue{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(getSSID:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter){
#if TARGET_OS_SIMULATOR
  NSDictionary* dict = [NSDictionary dictionaryWithObject:@"Home Wifi--New3+cccb123" forKey:@"SSID"];
  promise(dict);
#else
  NSString* BSSID = [self.sweeprScan fetchSSIDInfo];
  if (BSSID.length > 0) {
    NSDictionary*  dict = [NSDictionary dictionaryWithObject:BSSID forKey:@"SSID"];
    promise(dict);
  } else {
    NSDictionary *userInfo = @{
                               NSLocalizedFailureReasonErrorKey: NSLocalizedString(@"Failed to get SSID", nil),
                               };
    NSError* error = [NSError errorWithDomain:@"com.sweepr.scan" code:404 userInfo:userInfo];
    rejecter(@"404",@"Missing SSSID", error);
  }
#endif
}


RCT_EXPORT_METHOD(startDeviceScanWithOptions:(nonnull NSNumber*)optionsN
                  timeout:(nonnull NSNumber*)timeoutN
                  promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter){

  if (self.isScanning) {
    NSDictionary *userInfo = @{
                               NSLocalizedFailureReasonErrorKey: NSLocalizedString(@"startDeviceScanWithOptions called before a scan ended", nil),
                               };
    NSError* error = [NSError errorWithDomain:@"com.sweepr.scan" code:420 userInfo:userInfo];
    rejecter(@"420",@"startDeviceScanWithOptions called before a scan ended", error);
  }

  self.isScanning = YES;
  NSInteger sweeprOptions = optionsN.integerValue;
  NSInteger timeout = timeoutN.integerValue;
  SweeprDeviceOptions options = pingDeviceSubnet;

  if (sweeprOptions > pingAll) {
    options = pingAll;
  } else if (sweeprOptions < pingDeviceSubnet) {
    options = pingDeviceSubnet;
  } else {
    options = (SweeprDeviceOptions)sweeprOptions;
  }

  options = pingAll;

  if (timeout < 5) timeout = 5;
  if (timeout > 60) timeout = 60;

  [self.sweeprScan startDeviceScanWithOptions:options timeOut:timeout completion:^(DeviceScan * deviceScan) {
      NSString* JSONStr = [deviceScan serialise];
      NSDictionary* dict = [self convertJSONtoDictionary:JSONStr];

      if (self.isScanning == YES) {
        promise(dict);
      }

      self.isScanning = NO;


  }];

}

RCT_EXPORT_METHOD(stopLanScan) {
  [self.sweeprScan stopLanScan];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"RCTSweeprFailed",@"RCTSweeprFinished",@"RCTSweeprFoundDevice",@"RCTSweeprProgress"];
}

- (void)sweeprFailedScanWithStatus:(enum SweeprErrorStatus)status {
  [self sendEventWithName:@"RCTSweeprFailed" body:@(status)];
}

- (void)sweeprFinishedScan:(enum SweeprScanStatus)status {
  [self sendEventWithName:@"RCTSweeprFinished" body:@(status)];
}

- (void)sweeprFoundOrUpdatedWithDevice:(Device * _Nonnull)device {
  NSDictionary *deviceInfo = [RCTSweeprScanSerializer serializeDeviceToDictionary:device];
  [self sendEventWithName:@"RCTSweeprFoundDevice" body:deviceInfo];
  if (device.fullName.length == 0) {
    NSLog(@"missing fullName");
  }
}

- (void)sweeprProgress:(float)progress lastPingedAddress:(NSString * _Nonnull)lastPingedAddress {
  [self sendEventWithName:@"RCTSweeprProgress" body:@(progress)];
}


@end
