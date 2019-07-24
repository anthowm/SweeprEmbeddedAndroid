//
//  RCTSweeprSubscribe.h
//  App
//
//  Created by Eoin Norris on 20/08/2018.
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
#import <React/RCTUtils.h>

#import "RCTBaseBridge.h"

@interface RCTSweeprResolution :RCTBaseBridge <RCTBridgeModule, ResolutionUIDelegate>
@property (nonatomic, strong) SweeprSubscribe* sweeprSubscribe;
@property (nonatomic, strong) ResolutionStateMachine* machine;

@property (nonatomic)  BOOL response;
@property (nonatomic)  BOOL waitingForResponse;
@property (nonatomic, strong) NSMutableArray<NSString*>* audits;
@property (nonatomic, strong) NSMutableArray<NSString*>* orders;

@property (nonatomic, strong) Incident* lastIncident;
@property (nonatomic, strong) NSString* statusStr;
@property (nonatomic) NSString* version;


@property (nonatomic) dispatch_semaphore_t semaphore;


@end
