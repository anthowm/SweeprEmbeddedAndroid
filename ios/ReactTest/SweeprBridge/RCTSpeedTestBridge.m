//
//  RCTSpeedTestBridge.m
//  App
//
//  Created by Eoin Norris on 18/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//


#define TWOMB  2000000.0
#define TENMB  10000000.0

#define MIN_SPEED_TEST_TIME 5.0
#define MAX_SPEED_TEST_TIME 30.0

#define SPEED_TEST_SLOW @"SPEED_TEST_SLOW"
#define SPEED_TEST_MEDIUM @"SPEED_TEST_MEDIUM"
#define SPEED_TEST_FAST @"SPEED_TEST_FAST"
#define SPEED_TEST_FAILED @"SPEED_TEST_NO_INTERNET"

#import "RCTSpeedTestBridge.h"

@implementation RCTSpeedTestBridge

RCT_EXPORT_MODULE(SpeedTest);

+ (BOOL)requiresMainQueueSetup{
  return YES;
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    self.sweeprDownload = [[SweeprDownload alloc] init];
    self.urlToDownload = [[NSURL alloc] initWithString:@"https://speedtest.sweepr.com/files/testData.dmg"];
    self.isTesting = NO;
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[];
}

- (NSDictionary *)actions {
  return @{@(0): SPEED_TEST_SLOW, @(1): SPEED_TEST_MEDIUM, @(2): SPEED_TEST_FAST, @(3): SPEED_TEST_FAILED};
}

// for the short  second demos we seem to br 20-30% too fast
- (NSDictionary*)getResultAsAction:(SpeedResult *)speedTest {
  NSMutableDictionary* mutDict = [[NSMutableDictionary alloc] init];
  NSNumber* avgResult = @(2); // SPEED_TEST_FAST: we cant really pass enums to react.
  NSString* result = nil;
  NSDictionary* actions = [self actions];

  // get the average result
  double average = speedTest.modifiedAvg;
  
  // the average is in bytes
  
  if (average ==0 ) {
    avgResult = @(3);
  } else if (average < TWOMB) {
    avgResult = @(0);
  } else if ((average > TWOMB) && (average < TENMB)){
    avgResult = @(1);
  } else if (average > TENMB) {
    avgResult = @(2);
  }
  
  result = actions[avgResult] ?  actions[avgResult]  : SPEED_TEST_MEDIUM;

  NSString *formatedAverage = [NSByteCountFormatter stringFromByteCount:(long long)average
                                                             countStyle:NSByteCountFormatterCountStyleBinary];
  
  formatedAverage = [NSString stringWithFormat:@"%@ s",formatedAverage];
  [mutDict setObject:result forKey:@"overall"];
  [mutDict setObject:@((int)average) forKey:@"rawResult"];
  
  // hack alert
  
  formatedAverage = [formatedAverage stringByReplacingOccurrencesOfString:@"MB" withString:@"Mb"];
  
  [mutDict setObject:formatedAverage forKey:@"result"];

  return mutDict;
}


RCT_EXPORT_METHOD(startSpeedTestWithTimeout:(NSNumber*)timeout promise:(RCTPromiseResolveBlock)callback rejecter:(RCTPromiseRejectBlock)rejecter){
  if ( self.isTesting == NO ) {
    self.isTesting = YES;
    
    [self.sweeprDownload startSpeedTestWithTimeOut:timeout.doubleValue urlToTest:self.urlToDownload result:^(SpeedResult *result, BOOL finished, double percent, NSError * error) {
      if (finished == YES) {
        self.isTesting = NO;
        NSDictionary* resultDict = [self getResultAsAction:result];
        if (error != nil) {
          rejecter(SPEED_TEST_FAILED,SPEED_TEST_FAILED,error);
        } else {
          if (resultDict != nil) {
            callback(@[resultDict]);
          }
        }
      }
    }];
  }
}

RCT_EXPORT_METHOD(startSpeedTestWithURL:(nonnull NSString*)urlStr time:(nonnull NSNumber*)timeN callback:(RCTPromiseResolveBlock)callback rejecter:(RCTPromiseRejectBlock)rejecter){
    if ( self.isTesting == NO ) {
      self.isTesting = YES;
      NSTimeInterval time = [timeN doubleValue];
  
      if ( time < MIN_SPEED_TEST_TIME ) time = MIN_SPEED_TEST_TIME;
      if ( time > MAX_SPEED_TEST_TIME) time = MAX_SPEED_TEST_TIME;
  
      NSURL* url = [NSURL URLWithString:urlStr];
      
      if (url == nil) {
        NSError* urlError = [NSError errorWithDomain:@"com.sweepr.speedtest" code:404 userInfo:nil];
        rejecter(SPEED_TEST_FAILED,SPEED_TEST_FAILED,urlError);
      }
    
      [self.sweeprDownload startSpeedTestWithTimeOut:time urlToTest:url result:^(SpeedResult *result, BOOL finished, double percent, NSError * error) {
        if (finished == YES) {
          self.isTesting = NO;
          NSDictionary* resultDict = [self getResultAsAction:result];
          if (error != nil) {
            rejecter(SPEED_TEST_FAILED,SPEED_TEST_FAILED,error);
          } else {
            if (resultDict != nil) {
              callback(@[resultDict]);
            }
          }
        }
      }];
    }
}

RCT_EXPORT_METHOD(startSpeedTest:(RCTPromiseResolveBlock)callback rejecter:(RCTPromiseRejectBlock)rejecter){
  if ( self.isTesting == NO ) {
    self.isTesting = YES;
    [self.sweeprDownload startSpeedTestWithTimeOut:3.0 urlToTest:self.urlToDownload result:^(SpeedResult *result,
                                                                                             BOOL finished,
                                                                                             double percent,
                                                                                             NSError * error) {
        if (finished == YES) {
              self.isTesting = NO;
              NSDictionary* resultDict = [self getResultAsAction:result];
              if (error != nil) {
                rejecter(SPEED_TEST_FAILED,SPEED_TEST_FAILED,error);
              } else {
              if (resultDict != nil) {
                callback(@[resultDict]);
              }
          }
        }
    }];
  }
}

@end
