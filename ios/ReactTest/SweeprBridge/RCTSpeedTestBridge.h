//
//  RCTSpeedTestBridge.h
//  App
//
//  Created by Eoin Norris on 18/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTEventEmitter.h>
#import <Sweepr/Sweepr-Swift.h>
#import <Sweepr/SweeprUmbrella.h>



@interface RCTSpeedTestBridge : NSObject <RCTBridgeModule>

@property (nonatomic,strong) SweeprDownload* _Nonnull sweeprDownload;
@property (nonatomic,strong) NSURL* urlToDownload;
@property (nonatomic) BOOL isTesting;


@end
