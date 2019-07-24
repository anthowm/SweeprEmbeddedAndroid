//
//  RCTPing.m
//  App
//
//  Created by Eoin Norris on 11/05/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTPing.h"


#define PING_TEST_SLOW @"PING_TEST_SLOW"
#define PING_TEST_MEDIUM @"PING_TEST_MEDIUM"
#define PING_TEST_FAST @"PING_TEST_FAST"
#define PING_TEST_FAILED @"PING_TEST_FAILED"


@implementation RCTPing

RCT_EXPORT_MODULE(PingTest);


- (instancetype)init
{
  self = [super init];
  if (self) {
    self.latency = [[SweeprLatency alloc] init];
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[];
}

-(NSString*)saneResult:(double)inLatency{
  
  NSString* formattedLatency = [NSString stringWithFormat:@"%.1f ms",inLatency];
  return formattedLatency;
}

-(NSString*)thresholdResult:(double)inLatency {
//  What about <50ms (fast), 50-150s (medium), 150ms + (slow)
  NSString* result = PING_TEST_MEDIUM;
  
  if (inLatency == 0) {
    result = PING_TEST_FAILED;
  } else if ((inLatency > 0) && (inLatency < 50.0)) {
    result = PING_TEST_FAST;
  } else if ((inLatency >= 50.0) && (inLatency < 150.0)) {
    result = PING_TEST_MEDIUM;
  } else if  (inLatency >= 150.0) {
    result = PING_TEST_SLOW;
  }
  
  return result;
}


RCT_EXPORT_METHOD(pingWithHostName:(NSString*)hostName numberOfPings:(nonnull NSNumber*)pingsN promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {
  
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    if ( self.isTesting == NO ) {
      self.isTesting = YES;
      (void)[self.latency pingHostnameWithHostname:@"www.apple.com" numberofPings:5 withCallback:^(PingResult * result) {
        if (result.hostResolved == NO){
          self.isTesting = NO;
          return ;
        }
        NSString* saneResult = [self saneResult:result.average];
        NSString* thresholdResult = [self thresholdResult:result.average];
        
        NSDictionary* dict = @{@"result": saneResult, @"rawresult": @(result.average), @"thresholdResult":thresholdResult };
        promise(@[dict]);
      }];
    }
  });
  
}

@end
