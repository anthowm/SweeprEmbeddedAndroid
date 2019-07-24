//
//  RCTSweeprCloudBridge.h
//  ReactBridgeTest
//
//  Created by Eoin Norris on 13/06/2018.
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
#import "RCTBaseBridge.h"


@interface RCTSweeprCloudBridge : RCTBaseBridge <RCTBridgeModule>

@property (nonatomic, strong) SweeprCloud* sweeprCloud;
@property (nonatomic, strong) NSDictionary* headers;
@property (nonatomic, strong) NSDictionary* config;

@end
