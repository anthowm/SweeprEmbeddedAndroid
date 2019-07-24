//
//  RCTPing.h
//  App
//
//  Created by Eoin Norris on 11/05/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <Sweepr/Sweepr-Swift.h>
#import <Sweepr/SweeprUmbrella.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTEventEmitter.h>


@interface RCTPing : NSObject <RCTBridgeModule>

@property(nonatomic, strong) SweeprLatency* latency;
@property (nonatomic) BOOL isTesting;

@end
