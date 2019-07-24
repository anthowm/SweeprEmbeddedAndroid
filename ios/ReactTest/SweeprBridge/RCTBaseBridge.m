//
//  RCTBaseBridge.m
//  App
//
//  Created by Eoin Norris on 16/07/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTBaseBridge.h"

@implementation RCTBaseBridge

+ (BOOL)requiresMainQueueSetup{
  return YES;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[];
}

-(void)startObserving {
  self.hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  self.hasListeners = NO;
}

- (void)handleFailure:(NSError*) error rejecter:(RCTPromiseRejectBlock)rejecter {
  NSString *code = [self errorCodeAsString:error];
  NSString *message = [self errorMessage:error];
  
  NSDictionary* userDict = error.userInfo;
  if (userDict[@"message"] != nil) {
    message = userDict[@"message"];
  }
  
  rejecter(code, message, error);
}


- (void)handleNarrativeFailure:(NSError*) error rejecter:(RCTPromiseRejectBlock)rejecter {
  NSString *code = [self errorCodeAsString:error];
  NSString *message = @"We're sorry we didn't catch that, maybe describe a problem with your home network or device?";
  NSDictionary* newInfo = @{@"message":message};
  NSError* newError = [[NSError  alloc] initWithDomain:error.domain code:error.code userInfo:newInfo];
  
  rejecter(code, message, newError);
}


- (NSDictionary*)convertJSONtoDictionary:(NSString*)string {
  NSError* error;
  //giving error as it takes dic, array,etc only. not custom object.
  NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
  if (data != nil) {
    id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    return json;
  }
  return [NSDictionary dictionary];
}

-(NSDictionary*)errorDictFromError:(NSError*)error {
  NSMutableDictionary* dict = [[NSMutableDictionary alloc] init];
  if (error.description.length)
    [dict setObject:error.description forKey:@"description"];
  if (error.localizedFailureReason.length)
    [dict setObject:error.localizedFailureReason forKey:@"localizedFailureReason"];
  [dict setObject:@(error.code) forKey:@"code"];
  if (error.domain.length)
    [dict setObject:error.domain forKey:@"domain"];
  
  return dict;
}

-(NSString*)errorCodeAsString:(NSError*)error {
  if (error != nil) {
    return [NSString stringWithFormat:@"%@",@(error.code)];
  } else {
    return @"9999";
  }
}

-(NSString*)errorMessage:(NSError*)error {
  return error.description.length > 0 ? error.description : @"Unknown error";
}


@end
