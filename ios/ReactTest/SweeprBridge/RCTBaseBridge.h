//
//  RCTBaseBridge.h
//  App
//
//  Created by Eoin Norris on 16/07/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTEventEmitter.h>

@interface RCTBaseBridge : RCTEventEmitter
- (NSDictionary*)errorDictFromError:(NSError*)error;
- (void)handleFailure:(NSError*) error rejecter:(RCTPromiseRejectBlock)rejecter;
- (void)handleNarrativeFailure:(NSError*) error rejecter:(RCTPromiseRejectBlock)rejecter;
- (NSDictionary*)convertJSONtoDictionary:(NSString*)string;
- (NSArray<NSString *> *)supportedEvents;

@property (nonatomic)  BOOL hasListeners;

@end
