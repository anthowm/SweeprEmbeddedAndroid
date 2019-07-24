//
//  RCTSweeprCloudBridge.m
//  ReactBridgeTest
//
//  Created by Eoin Norris on 13/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//
//
//  RCTSweeprCloudBridge.m
//  ReactBridgeTest
//
//  Created by Eoin Norris on 13/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTSweeprCloudBridge.h"


#define USE_LOCAL_CONFIG 0

@implementation RCTSweeprCloudBridge

RCT_EXPORT_MODULE(SweeprCloud)


- (instancetype)init
{
    self = [super init];
    if (self) {
        NSDictionary* endPoints = @{@"hippoEndpoint": @"qa", @"apiEndpoint":@"api.qa.sweepr.com"};
        NSDictionary* headers = @{@"User-Agent":@"Sweepr.react.mobile.embed.TMobile"};
        self.sweeprCloud = [[SweeprCloud alloc] initWithEndPoints:endPoints headers:headers scheme:@"https"];
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup{
    return YES;
}

#pragma mark - Services

/*
 const response = yield sweeprCloud.updateUserSkillLevel({ skillLevel: action.skillLevel }, userID);
 */


RCT_EXPORT_METHOD(updateAPNSToken:(nonnull NSString*)apnsToken
                  userID:(nonnull NSNumber*)userID
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {
    
    [self.sweeprCloud putAPNSToken:apnsToken tokenType:@"APNS" userID:userID.integerValue completion:^(ProfileResponse * response, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [response serialise];
            NSDictionary* userDict = [self convertJSONtoDictionary:JSONStr];
            promise(userDict);
        }
    }];
}


RCT_EXPORT_METHOD(updateUserSkillLevel:(nonnull NSDictionary*)skillLevelDict
                  userID:(nonnull NSNumber*)userID
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {
    // do stuff
    
    NSNumber* skillLevel = skillLevelDict[@"skillLevel"];
    
    if (skillLevel != nil && [skillLevel isKindOfClass:[NSNumber class]]) {
        [self.sweeprCloud putUserSkillLevel:skillLevel.integerValue
                                     userID:userID.integerValue
                                 completion:^(ProfileResponse * response, NSError * error) {
                                     if (error != nil) {
                                         [self handleFailure:error rejecter:rejecter];
                                     } else {
                                         NSString* JSONStr = [response serialise];
                                         NSDictionary* userDict = [self convertJSONtoDictionary:JSONStr];
                                         promise(userDict);
                                     }
                                 }];
    } else {
        NSError* error = [[NSError alloc] initWithDomain:@"com.sweepr.api" code:400 userInfo:@{@"message":@"missing skill level"}];
        [self handleFailure:error rejecter:rejecter];
    }
}

RCT_EXPORT_METHOD(getAllServices:(nonnull NSNumber*)pageID promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter)  {
    [self.sweeprCloud getPagedServicesWithPage:pageID.integerValue completion:^(PageServiceDTO * servicePage, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [servicePage serialise];
            NSDictionary* servicesDict = [self convertJSONtoDictionary:JSONStr];
            promise(servicesDict);
        }
    }];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[];
}

RCT_EXPORT_METHOD(createNewHouseHold:(nonnull NSDictionary*)houseHoldDict userID:(nonnull NSNumber*)userIDN promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter){
    
    Household* houseHold = [[Household alloc] initFromDict:houseHoldDict];
    
    [self.sweeprCloud createNewHouseHoldWithHouseHold:houseHold userId:userIDN.integerValue completion:^(Household * houseHold, HouseholdStatus status, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [houseHold serialise];
            NSDictionary* servicesDict = [self convertJSONtoDictionary:JSONStr];
            promise(servicesDict);
        }
    }];
}

RCT_EXPORT_METHOD(addHouseHoldService:(nonnull NSNumber*)serviceID houseHoldID:(nonnull NSNumber*)houseHoldId promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {
    [self.sweeprCloud addServiceFavouriteWithHouseHoldId:houseHoldId.integerValue serviceID:serviceID.integerValue completion:^(Service * service, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [service serialise];
            NSDictionary* servicesDict = [self convertJSONtoDictionary:JSONStr];
            promise(servicesDict);
        }
    }];
}

RCT_EXPORT_METHOD(deleteHouseholdService:(nonnull NSNumber*)serviceID houseHoldID:(nonnull NSNumber*)houseHoldId promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {
    [self.sweeprCloud deleteServiceFavouriteWithHouseHoldId:houseHoldId.integerValue serviceID:serviceID.integerValue completion:^(NSInteger result, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSDictionary* dict = [NSDictionary dictionaryWithObject:@(result) forKey:@"status"];
            promise(dict);
        }
    }];
}

RCT_EXPORT_METHOD(getHouseHoldServices:(nonnull NSNumber*)pageID houseHoldID:(nonnull NSNumber*)houseHoldN promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {
    
    [self.sweeprCloud getPagedHouseHoldServicesWithPage:pageID.integerValue houseHoldID:houseHoldN.integerValue completion:^(PageServiceDTO * servicePage, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [servicePage serialise];
            NSDictionary* dict = [self convertJSONtoDictionary:JSONStr];
            promise(dict);
        }
    }];
}

// getAllScansForHouseHold
RCT_EXPORT_METHOD(getAllScansForHouseHold:(nonnull NSNumber*)houseHoldN  promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {
    
    [self.sweeprCloud getHouseHoldScansForHouseHold:houseHoldN.integerValue completion:^(HouseholdScans * houseHoldScans, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [houseHoldScans serialise];
            NSDictionary* dict = [self convertJSONtoDictionary:JSONStr];
            promise(dict);
        }
    }];
}

RCT_EXPORT_METHOD(syncScanForHouseHold:(nonnull NSNumber*)houseHoldN scanDict:(nonnull NSDictionary*)scanDict houseHoldScanpromise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter)   {
    NSNumber* latencyN = scanDict[@"latency"];
    NSNumber* speedN = scanDict[@"speed"];
    
    HouseholdSpeed* scanStatus = [[HouseholdSpeed alloc] initWithLatency:latencyN speed:speedN];
    
    [self.sweeprCloud syncHouseHoldScanWithHouseholdId:houseHoldN.integerValue scanStatus:scanStatus completion:^(HouseholdSpeed * result, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [result serialise];
            NSDictionary* servicesDict = [self convertJSONtoDictionary:JSONStr];
            promise(servicesDict);
        }
    }];
}

RCT_EXPORT_METHOD(setMode:(NSString*)mode) {
    NSDictionary* modeInfo = self.config[mode];
    
    if (modeInfo) {
        NSString* apiEndpoint = modeInfo[@"domain"];
        NSString* scheme = modeInfo[@"protocol"];
        NSNumber* port = modeInfo[@"port"];
        
        if (port) {
            apiEndpoint = [NSString stringWithFormat:@"%@:%@", apiEndpoint,port];
        }
        self.sweeprCloud.endPoints = @{@"hippoEndpoint":@"hippo.sweepr.xyz", @"apiEndpoint":apiEndpoint};
        self.sweeprCloud.scheme = scheme.length ? scheme : @"https";
    } else {
        NSLog(@"No result for setMode for mode (%@) and config (%@)", mode, self.config);
    }
}

RCT_EXPORT_METHOD(setMode:(nonnull NSString*)mode forConfig:(nonnull NSDictionary*)config) {
    NSDictionary* modeInfo = config[mode];
    
    if (modeInfo) {
        NSString* apiEndpoint = modeInfo[@"domain"];
        NSString* scheme = modeInfo[@"protocol"];
        NSNumber* port = modeInfo[@"port"];
        
        if (port) {
            apiEndpoint = [NSString stringWithFormat:@"%@:%@", apiEndpoint,port];
        }
        self.sweeprCloud.endPoints = @{@"hippoEndpoint":@"hippo.sweepr.xyz", @"apiEndpoint":apiEndpoint};
        self.sweeprCloud.scheme = scheme.length ? scheme : @"https";
    } else {
        NSLog(@"No result for setMode for mode (%@) and config (%@)", mode, self.config);
    }
}

RCT_EXPORT_METHOD(clearAppStorage:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {
    [self.sweeprCloud logout];
    promise(@"Success");
}

RCT_EXPORT_METHOD(setHTTPHeaders:( NSDictionary<NSString *, NSString *> * _Nonnull) headers) {
    self.sweeprCloud.headers = headers;
}

RCT_EXPORT_METHOD(setEndpoints:( NSDictionary<NSString *, NSString *> * _Nonnull) endpoints) {
    self.sweeprCloud.endPoints = endpoints;
}

RCT_EXPORT_METHOD(setToken:(nonnull NSString*)token refreshToken:(nonnull NSString*)refreshToken) {
    [self.sweeprCloud loginWithToken:token refreshToken:refreshToken];
}

RCT_EXPORT_METHOD(loginWithCredentials:(nonnull NSDictionary*)credentials promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter){
    
    NSString* email = credentials[@"email"];
    NSString* password = credentials[@"hashedPassword"];
    
    [self.sweeprCloud loginWithUsername:email password:password completion:^(Auth * auth , NSError * error ) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* jsonStr = [auth serialise];
            promise([self convertJSONtoDictionary:jsonStr]);
        }
    }];
}

RCT_EXPORT_METHOD(login:(nonnull NSString*) username password: (nonnull NSString*) password  promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter){
    [self.sweeprCloud loginWithUsername:username password:password completion:^(Auth * auth , NSError * error ) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [auth serialise];
            NSDictionary* authDict = [self convertJSONtoDictionary:JSONStr];
            promise(authDict);
        }
    }];
}

RCT_EXPORT_METHOD(setLoginToken:(nonnull NSString*) token refreshToken: (nonnull NSString*) refreshToken) {
    [self.sweeprCloud loginWithToken:token refreshToken:refreshToken];
}

RCT_EXPORT_METHOD(registerCredentials:(nonnull NSDictionary*)credentials promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter){
    NSString* username = credentials[@"email"];
    NSString* password = credentials[@"hashedPassword"];
    NSString* firstName = credentials[@"firstName"];
    NSString* lastName = credentials[@"lastName"];
    
    
    UserDTO* user = [[UserDTO alloc] initWithUsername:username hashedPassword:password];
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = username;
    
    [self.sweeprCloud registerUser:user completion:^(SweeprUser * user, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [user serialise];
            NSDictionary* dict = [self convertJSONtoDictionary:JSONStr];
            promise(dict);
        }
    }];
}

RCT_EXPORT_METHOD(createIncidentWithNarrative:(nonnull NSNumber*)houseHoldIDN
                  narrative:(nonnull NSString*)narrative promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter){
    [self.sweeprCloud createIncidentForHouseHold:houseHoldIDN.integerValue narrative:narrative completion:^(Incident * incident, NSError * error) {
        if (error != nil) {
            [self handleNarrativeFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [incident serialise];
            NSMutableDictionary* incidentDict = [[self convertJSONtoDictionary:JSONStr] mutableCopy];
            
            if (incident.type == IncidentTypeDiagnostic) {
                [incidentDict setObject:@"IncidentTypeDiagnostic" forKey:@"IncidentType"];
            } else {
                [incidentDict setObject:@"IncidentTypeClarification" forKey:@"IncidentType"];
            }
            promise(incidentDict);
        }
    }];
}


RCT_EXPORT_METHOD(saveResolutionCloud:(nonnull NSNumber*)houseHoldIDN
                  audit:(NSDictionary*)dict promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {
    
    NSArray* resultionPath = dict[@"orders"];
    NSArray* audits = dict[@"audits"];
    NSString* status = dict[@"status"];
    NSNumber* incidentID = dict[@"incident"];
    
    // sends the resolution cloud
    [self.sweeprCloud saveResolutionAuditForHouseHold:houseHoldIDN.integerValue
                                           incidentID:incidentID.integerValue
                                                audit:audits
                                       resolutionPath:resultionPath
                                               result:status
                                           completion:^(ResolutionAttempt * resolutionAttempt,
                                                        NSError * error) {
                                               if (error != nil) {
                                                   [self handleFailure:error rejecter:rejecter];
                                               } else {
                                                   NSString* JSONStr = [resolutionAttempt serialise];
                                                   NSMutableDictionary* resolutionAttemptDict = [[self convertJSONtoDictionary:JSONStr] mutableCopy];
                                                   promise(resolutionAttemptDict);
                                               }
                                               
                                           }];
}

RCT_EXPORT_METHOD(syncDeviceScan:(nonnull NSString*) scanID forHouseHoldId:(nonnull NSNumber*)houseHoldIDN promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter){
    Household* houseHold = [[Household alloc] initWithHouseHoldID:houseHoldIDN.integerValue];
    
    [self.sweeprCloud syncDeviceScan:scanID forHouseHold:houseHold completion:^(Household * houseHold,  HouseholdStatus status, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [houseHold serialise];
            NSMutableDictionary* houseHoldDict = [[self convertJSONtoDictionary:JSONStr] mutableCopy];
            houseHoldDict[@"status"] = @(status);
            promise(houseHoldDict);
        }
    }];
}

RCT_EXPORT_METHOD(getUserProfile:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {
    [self.sweeprCloud getUserProfileWithCompletion:^(ProfileResponse * user, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [user serialise];
            NSDictionary* userDict = [self convertJSONtoDictionary:JSONStr];
            promise(userDict);
        }
    }];
}

RCT_EXPORT_METHOD(getFaqForNamedDevice:(nonnull NSString*)deviceStr promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter)  {
    [self.sweeprCloud getFaqForQueryDevice:deviceStr completion:^(FAQ * faq, NSError * error) {
        if (error != nil) {
            promise([self errorDictFromError:error]);
        } else {
            NSString* JSONStr = [faq serialise];
            NSDictionary* faqDict = [self convertJSONtoDictionary:JSONStr];
            promise(faqDict);
        }
    }];
}

RCT_EXPORT_METHOD(getNotifications:(nonnull NSNumber*)houseHoldIDN promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {
    [self.sweeprCloud getNotificationsForHouseHold:houseHoldIDN.integerValue completion:^(SweeprNotes * sweeprNotes, NSError * error) {
        if (error != nil) {
            [self handleFailure:error rejecter:rejecter];
        } else {
            NSString* JSONStr = [sweeprNotes serialise];
            NSDictionary* sweeprNotesDict = [self convertJSONtoDictionary:JSONStr];
            NSDictionary* notes = sweeprNotesDict[@"notes"];
            promise(notes);
        }
    }];
}

@end
