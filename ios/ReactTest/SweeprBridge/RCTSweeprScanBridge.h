//
//  SweeprScanBridge.h
//  SwiftBridge
//
//  Created by Eoin Norris on 07/03/2018.
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


@interface RCTSweeprScanBridge : RCTBaseBridge <RCTBridgeModule,SweeprScannerDelegate>

@property (nonatomic,strong) SweeprScan* _Nonnull sweeprScan;
@property (nonatomic) BOOL isScanning;


@end
