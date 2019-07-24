//
//  RCTSweeprSubscribe.m
//  App
//
//  Created by Eoin Norris on 20/08/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTSweeprResolution.h"

@interface NSString (JRStringAdditions)

- (BOOL)containsString:(NSString *)string;
- (BOOL)containsString:(NSString *)string
               options:(NSStringCompareOptions)options;

@end

@implementation NSString (JRStringAdditions)

- (BOOL)containsString:(NSString *)string
               options:(NSStringCompareOptions)options {
  NSRange rng = [self rangeOfString:string options:options];
  return rng.location != NSNotFound;
}

- (BOOL)containsString:(NSString *)string {
  return [self containsString:string options:0];
}

@end


@implementation RCTSweeprResolution



+ (BOOL)requiresMainQueueSetup{
  return YES;
}

/*
 API_URL=api.dev.sweepr.com
 HIPPO_URL=hippo.dev.sweepr.com
 MQTT_URL=mqtt.dev.sweepr.com
 ENV=Sweepr
 */

RCT_EXPORT_MODULE(SweeprResolution)

- (instancetype)initWithHost:(nonnull NSString*)inHost port:(nonnull NSNumber*)inPortN
{
  self = [super init];

//  NSDictionary *config = [ReactNativeConfig env];
//  NSString* mqttString = config[@"MQTT_URL"];

  if (self) {
   self.sweeprSubscribe = [[SweeprSubscribe alloc] init:@"mqtt.qa.sweepr.com" port:8883 pathToResouce:@"" uiDelegate:self inClientID:@"SweeprApp"];

    self.orders = [[NSMutableArray alloc] init];
    self.audits = [[NSMutableArray alloc] init];
    self.statusStr = @"FailedAttempt";
  }
  return self;
}


RCT_EXPORT_METHOD(updateSkillLevel:(nonnull NSDictionary*)skillLevelDict
                  userID:(NSNumber*)userID
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {

  NSNumber* userLevel = skillLevelDict[@"skillLevel"];
  if (userLevel != nil) {
    NSString* formatedInt = [NSString stringWithFormat:@"%@",userLevel];
    [self.sweeprSubscribe setUserProfile:formatedInt];
  } else {
    NSError* error = [[NSError alloc] initWithDomain:@"com.sweepr.api" code:400 userInfo:@{@"message":@"missing skill level"}];
    [self handleFailure:error rejecter:rejecter];
  }
}


RCT_EXPORT_METHOD(resetSubscription) {
  self.sweeprSubscribe = [[SweeprSubscribe alloc] init:@"mqtt.qa.sweepr.com" port:8883 pathToResouce:@"" uiDelegate:self inClientID:@"SweeprApp"];
  self.orders = [[NSMutableArray alloc] init];
  self.audits = [[NSMutableArray alloc] init];
}


-(NSString*)versionFromEnvironment:(NSDictionary *)config {
  NSString* result = @"V1";
  NSString* env = config[@"ENV"];
  if ([env isEqualToString:@"Sweepr"]) {
    NSString* api = config[@"API_URL"];
    if ([api localizedStandardContainsString:@".dev"] == YES) {
      result = @"V2";
    }
  }

  return result;
}

/*
 InProgress,             //if send to external system. ticket logged or we will contact the user later on
 SuccessfulAttempt,     //the stage finished without errors, proceed to next stage if applicable
 UnsuccessfulAttempt,   //did make it pass to the next stage. resolution didn't fix issue
 FailedAttempt          //some step failed during execution. timed out
 */


- (instancetype)init{
  self = [super init];
  if (self) {
//    NSDictionary *config = [ReactNativeConfig env];
//    NSString* mqttString = config[@"MQTT_URL"];

//    self.version = [self versionFromEnvironment:config];
//    self.version = @"V2";
    self.sweeprSubscribe = [[SweeprSubscribe alloc] init:@"mqtt.qa.sweepr.com" port:8883 pathToResouce:@"" uiDelegate:self inClientID:@"SweeprApp"];
    self.orders = [[NSMutableArray alloc] init];
    self.audits = [[NSMutableArray alloc] init];
    self.statusStr = @"FailedAttempt";

  }
  return self;
}

RCT_EXPORT_METHOD(respondToButton:(BOOL)result) {
  self.response = result;
  dispatch_semaphore_signal(self.semaphore);
}

RCT_EXPORT_METHOD(respondToContent:(BOOL)result) {
  self.response = result;
  dispatch_semaphore_signal(self.semaphore);
}

RCT_EXPORT_METHOD(respondToResolution) {
  dispatch_semaphore_signal(self.semaphore);
}


RCT_EXPORT_METHOD(unsubcribeToIncidentWithIncidentID:(nonnull NSNumber*)incidentIDN promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {

  NSError* error = [self.sweeprSubscribe unsubcribeToIncident:incidentIDN.integerValue runAtType: RunningAtAppClarification];

  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"status",@"success",incidentIDN,@"incidentID", nil];
    promise(dict);
  }
}

- (NSArray<NSString *> *)supportedEvents{

  return @[@"RCTSweeprIncidentError",
           @"RCTSweeprIncidentReceived",
           @"RCTContentResponse",
           @"RCTCardContentResponse",
           @"RCTPromptResponse",
           @"RCTResolutionAuditResponse",
           @"RCTFailedResponse",
           @"RCTProgressResponse",
           @"RCTStartResolution",
           @"RCTAffectedDeviceList",
           @"RCTClarificationFailedResponse",
           @"RCTResolutionEnded"];
}

- (void)subscribeFailedWithError:(NSError*)error{
  [self sendEventWithName:@"RCTSweeprIncidentError" body:@{@"error": error}];
}

- (void)clarificationReceivedResponse:(SubscriptionResponse*) response{
  NSString* JSONStr = [response serialise];
  NSMutableDictionary* incidentResponseDict = [[self convertJSONtoDictionary:JSONStr] mutableCopy];
  if ([incidentResponseDict[@"messageType"] isEqualToString:@"FAILED_CLARIFICATION"]){
    [self sendEventWithName:@"RCTClarificationFailedResponse" body:incidentResponseDict];
  } else {
    [self sendEventWithName:@"RCTSweeprIncidentReceived" body:incidentResponseDict];
  }
}

RCT_EXPORT_METHOD(subscribeToDiagnosticIncident:(nonnull NSNumber*)incidentIDN
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {

  [self.sweeprSubscribe subscribeToIncidentID:incidentIDN.integerValue receiverType:RunningAtAppDiagnostic  completion:^(SubscriptionResponse * _Nullable response, NSError * _Nullable error) {
    if (error != nil) {
      [self subscribeFailedWithError:error];
    } else {
      [self clarificationReceivedResponse:response];
    }
  }];

  NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"status",@"success",incidentIDN, @"incidentID", nil];
  promise(dict);
}

-(BOOL)isValidSweeprMarkup:(NSString*)inStr {
    if(([inStr hasPrefix:@"<Content>"])|| ([inStr hasSuffix:@"<Content>"])) {
      return YES;
    }
  return NO;
}
       

RCT_EXPORT_METHOD(subscribeToResolutionIncident:(nonnull NSNumber*)incidentIDN
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {


  [self.sweeprSubscribe subscribeToIncidentID:incidentIDN.integerValue receiverType:RunningAtAppResolution  completion:^(SubscriptionResponse * _Nullable response, NSError * _Nullable error) {
    if (error != nil) {
      [self subscribeFailedWithError:error];
    }
  }];

  NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"status",@"success",incidentIDN, @"incidentID", nil];
  promise(dict);
}

RCT_EXPORT_METHOD(subscribeToIncidentID:(nonnull NSNumber*)incidentIDN
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {

  [self.sweeprSubscribe subscribeToIncidentID:incidentIDN.integerValue
                                 receiverType:RunningAtAppClarification
                                   completion:^(SubscriptionResponse * _Nullable response, NSError * _Nullable error) {
                                     if (error != nil) {
                                       [self subscribeFailedWithError:error];
                                     } else {
                                       [self clarificationReceivedResponse:response];
                                     }
                                   }];

  NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"status",@"success",incidentIDN, @"incidentID", nil];
  promise(dict);
}

RCT_EXPORT_METHOD(publishDiagnosticAcknowledForIncident:(nonnull NSNumber*)incidentIDN
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {
  NSError* error = [self.sweeprSubscribe publishDiagnosticAcknowlegementForIncident:incidentIDN.integerValue];



  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"status",@"success",incidentIDN, @"incidentID", nil];
    promise(dict);
  }
}

RCT_EXPORT_METHOD(publishAcknowledForResolution:(nonnull NSNumber*)incidentIDN
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {
  NSError* error = [self.sweeprSubscribe publishResolutionAcknowlegementForIncident:incidentIDN.integerValue];
  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"status",@"success",incidentIDN, @"incidentID", nil];
    promise(dict);
  }
}

RCT_EXPORT_METHOD(publishAcknowledForIncident:(nonnull NSNumber*)incidentIDN
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {
  NSError* error = [self.sweeprSubscribe publishAcknowlegementForIncident:incidentIDN.integerValue];
  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"status",@"success",incidentIDN, @"incidentID", nil];
    promise(dict);
  }
}

RCT_EXPORT_METHOD(publishDeviceDiagnosticSuggestedResponseForIncident:(nonnull NSNumber*)incidentIDN
                  deviceID:(nonnull NSNumber*)deviceIDN
                  accept:(BOOL)accepted
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {

  NSError* error = [self.sweeprSubscribe publishDeviceSuggestionResponseForIncident:incidentIDN.integerValue
                                                                           deviceID:deviceIDN.integerValue
                                                                          runningAt:RunningAtCloudDiagnostic

                                                                             accept:accepted];

  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"success", @"status", incidentIDN, @"incidentID",deviceIDN, @"deviceID", nil];
    promise(dict);
  }
}


RCT_EXPORT_METHOD(publishDeviceSuggestedResponseForIncident:(nonnull NSNumber*)incidentIDN
                  deviceID:(nonnull NSNumber*)deviceIDN
                  accept:(BOOL)accepted
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {

  NSError* error = [self.sweeprSubscribe publishDeviceSuggestionResponseForIncident:incidentIDN.integerValue
                                                                           deviceID:deviceIDN.integerValue
                                                                          runningAt:RunningAtCloudClarification
                                                                             accept:accepted];

  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"success", @"status", incidentIDN, @"incidentID",deviceIDN, @"deviceID", nil];
    promise(dict);
  }
}

RCT_EXPORT_METHOD(publishDeviceDiagnosticResponseForIncident:(nonnull NSNumber*)incidentIDN
                  deviceID:(nonnull NSNumber*)deviceIDN
                  promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {

  NSError* error = [self.sweeprSubscribe publishDeviceResponseForIncident:incidentIDN.integerValue
                                                                 deviceID:deviceIDN.integerValue
                                                                   accept:SuggestedClarificationTypeNone
                                                                runningAt:RunningAtCloudDiagnostic
                                                       clarificationLayer:0];
  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"success", @"status", incidentIDN, @"incidentID",deviceIDN, @"deviceID", nil];
    promise(dict);
  }
}


RCT_EXPORT_METHOD(publishDeviceResponseForIncident:(nonnull NSNumber*)incidentIDN
                  deviceID:(nonnull NSNumber*)deviceIDN
                  promise:(RCTPromiseResolveBlock)promise rejecter:(RCTPromiseRejectBlock)rejecter) {

  NSError* error = [self.sweeprSubscribe publishDeviceResponseForIncident:incidentIDN.integerValue
                                                                 deviceID:deviceIDN.integerValue
                                                                   accept:SuggestedClarificationTypeNone
                                                                runningAt:RunningAtCloudClarification
                                                       clarificationLayer:0];
  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"success", @"status", incidentIDN, @"incidentID",deviceIDN, @"deviceID", nil];
    promise(dict);
  }
}

RCT_EXPORT_METHOD(publishServiceResponseForIncident:(nonnull NSNumber*)incidentIDN
                  serviceID:(nonnull NSNumber*)issueIDN
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {
  NSError* error = [self.sweeprSubscribe publishServiceResponseForIncident:incidentIDN.integerValue
                                                                 serviceID:issueIDN.integerValue
                                                                 runningAt:RunningAtCloudClarification];

  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"success", @"status",incidentIDN, @"incidentID", issueIDN, @"issueID", nil];
    promise(dict);
  }
}

RCT_EXPORT_METHOD(publishServiceDiagnosticResponseForIncident:(nonnull NSNumber*)incidentIDN
                  serviceID:(nonnull NSNumber*)issueIDN
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {
  NSError* error = [self.sweeprSubscribe publishServiceResponseForIncident:incidentIDN.integerValue
                                                                 serviceID:issueIDN.integerValue
                                                                 runningAt:RunningAtCloudDiagnostic];

  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"success", @"status",incidentIDN, @"incidentID", issueIDN, @"issueID", nil];
    promise(dict);
  }
}


RCT_EXPORT_METHOD(publishIssueResponseForIncident:(nonnull NSNumber*)incidentIDN
                  issueID:(nonnull NSNumber*)issueIDN
                  promise:(RCTPromiseResolveBlock)promise
                  rejecter:(RCTPromiseRejectBlock)rejecter) {
  NSError* error = [self.sweeprSubscribe publishIssueResponseForIncident:incidentIDN.integerValue
                                                                 issueID:issueIDN.integerValue
                                                               receiverType:RunningAtCloudClarification];

  if (error != nil) {
    [self handleFailure:error rejecter:rejecter];
  } else {
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:@"success", @"status",incidentIDN, @"incidentID", issueIDN, @"issueID", nil];
    promise(dict);
  }
}

/**
 UI Delegate responses

 @param content the content to display
 @param delay the time to show this response.
 */

- (void)showContent:(NSString * _Nonnull)content
         subContent:(NSString * _Nullable)subContent
          withDelay:(NSInteger)delay
       progresstype:(NSString * _Nonnull)progresstype
         buttonText:(ButtonText * _Nullable)buttonText
              media:(Media * _Nullable)media{
  NSMutableDictionary* incidentResponseDict = [@{@"text":content} mutableCopy];
  NSDictionary* mediaDict = [media toDictionary];
  NSDictionary* buttonTextDict = [buttonText toDictionary];

  if (delay < 2) {
    delay = 2;
  }

  if ([self.version isEqualToString:@"V2"] == NO) {
    [incidentResponseDict  setObject:@(delay) forKey:@"delay"];

    if (progresstype!= nil) {
      [incidentResponseDict setObject:progresstype forKey:@"progress"];

    }

    if (mediaDict != nil) {
      [incidentResponseDict setObject:mediaDict forKey:@"media"];
    }

    if (buttonTextDict != nil) {
      [incidentResponseDict setObject:buttonTextDict forKey:@"buttonText"];
    }
  }

  [self sendEventWithName:@"RCTContentResponse" body:incidentResponseDict];


  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    dispatch_semaphore_signal(self.semaphore);
  });

  self.semaphore = dispatch_semaphore_create(0);
  dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER);

  return;

}

- (void)showDeterminateProgress:(NSString * _Nonnull)content
                       progress:(double)progress
                          media:(Media * _Nullable)media {
  NSDictionary* mediaDict = [media toDictionary];
  NSMutableDictionary* progressResponseDict = [@{@"text":content, @"progress":@(progress)} mutableCopy];
  if (mediaDict != nil) {
    [progressResponseDict setObject:mediaDict forKey:@"media"];
  }

  [self sendEventWithName:@"RCTProgressResponse" body:progressResponseDict];
}


-(void)clearContent {
  NSDictionary* incidentResponseDict = @{@"text":@"", @"delay":@(0)};
  [self sendEventWithName:@"RCTContentResponse" body:incidentResponseDict];
}


/**
 UI delegate response - not interacting with react here as we can show the alert here as well.
 @param prompt the prompt
 @return result
 */
- (enum DialogResponse)showPrompt:(NSString * _Nonnull)prompt
                        subPrompt:(NSString * _Nullable)subPrompt
                             type:(NSString * _Nullable)subType
                       buttonText:(ButtonText * _Nullable)buttonText
                            media:(Media * _Nullable)media {


  NSDictionary* buttonTextDict = [buttonText toDictionary];
  NSDictionary* mediaDict = [media toDictionary];

  NSMutableDictionary* incidentResponseDict = [@{@"text":prompt} mutableCopy];

  if ([self.version isEqualToString:@"V2"] == NO) {
    if (buttonTextDict != nil) {
      [incidentResponseDict setObject:buttonTextDict forKey:@"buttonText"];
    }

    if (mediaDict != nil) {
      [incidentResponseDict setObject:mediaDict forKey:@"media"];
    }

    if (subType != nil) {
      [incidentResponseDict setObject:subType forKey:@"subType"];
    }

    if (subPrompt != nil) {
      [incidentResponseDict setObject:subPrompt forKey:@"subPrompt"];
    }
  }


  [self sendEventWithName:@"RCTPromptResponse" body:incidentResponseDict];

  self.semaphore = dispatch_semaphore_create(0);
  dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER);

  DialogResponse response =  self.response ? DialogResponsePrimary: DialogResponseSecondary;

  return response;
}


- (enum DialogResponse)showFailure:(NSString * _Nonnull)text
                        buttonText:(ButtonText * _Nullable)buttonText{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSDictionary* buttonTextDict = [buttonText toDictionary];

    // fix with jira
    NSString* errorText = @"Oops. Something went wrong";

    NSMutableDictionary* failureResponseDict = [@{@"audits":self.audits,
                                                  @"orders":self.orders,
                                                  @"text":errorText,
                                                  @"status": @"Failed_attempt",
                                                  @"buttonText":[buttonText toDictionary],
                                                  @"resolutionFinished":@(true)} mutableCopy];
    if (buttonTextDict != nil) {
      [failureResponseDict setObject:buttonTextDict forKey:@"buttonText"];
    }

    [self sendEventWithName:@"RCTFailedResponse" body:failureResponseDict];
  });

  self.semaphore = dispatch_semaphore_create(0);
  dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER);

  return self.response ? DialogResponsePrimary: DialogResponseSecondary;
}

- (enum DialogResponse)showCardContent:(NSArray<CardContainer *> * _Nonnull)containers{
  NSMutableArray* cardContainers = [[NSMutableArray alloc] init];
  dispatch_async(dispatch_get_main_queue(), ^{
    for (CardContainer* container in containers) {
      NSDictionary* cardDict = [container toDictionary];
      [cardContainers addObject:cardDict];
    }

    NSDictionary* cardDict = @{@"cardContainers":cardContainers};
    [self sendEventWithName:@"RCTCardContentResponse" body:cardDict];

  });

  self.semaphore = dispatch_semaphore_create(0);
  dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER);

  return self.response ? DialogResponsePrimary: DialogResponseSecondary;
}

-(void)resetAudits {
  self.orders = [[NSMutableArray alloc] init];
  self.audits = [[NSMutableArray alloc] init];
}

- (void)startResolution:(BOOL)available attempt:(NSInteger)attempt {

  if (available == YES) {
    if (attempt <=1 ) {
      [self resetAudits];
    }
  }

  [self sendEventWithName:@"RCTStartResolution" body:[[NSDictionary alloc] init]];
  self.semaphore = dispatch_semaphore_create(0);
  dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER);
}

-(NSString*)mapInternalStatusToString:(enum StatemachineRunState)status {

  NSString* result = @"UnsuccessfulAttempt";

  switch (status) {
    case StatemachineRunStateIsFinished:
      result =  @"SuccessfulAttempt";
      break;
    case StatemachineRunStateUserCancelled:
      result = @"UnsuccessfulAttempt";

    default:
      result =  @"FailedAttempt";
      break;
  }

  return result;
}
/**
 step response

 @param auditSummary the audit for this step
 @param order the order for this step
 @param status the status of the resolution engine
 */
- (void)finishedStepWith:(NSString * _Nullable)auditSummary
                   order:(NSString * _Nonnull)order
                  status:(enum StatemachineRunState)status {
  if (status == StatemachineRunStateIsFinished) {
    NSString* statusStr = [self mapInternalStatusToString:status];
    NSDictionary* resolutionAuditDict = @{@"audits":self.audits,
                                          @"orders":self.orders,
                                          @"status": statusStr,
                                          @"resolutionFinished":@(false)};
    [self sendEventWithName:@"RCTResolutionAuditResponse" body:resolutionAuditDict];
  } else {
      if ((auditSummary == nil) || (auditSummary.length < 1)) {
        auditSummary = @"none";
      }
          
      if ((order == nil) || (order.length < 1)) {
          order = @"none";
      }
      [self.audits addObject:auditSummary];
      [self.orders addObject:order];
  }
}

-(void)sendResolutionStatus:(NSString*)statusString
                    success:(BOOL)success{
  NSMutableDictionary* resolutionAuditDict = [@{@"audits":self.audits,
                                                @"orders":self.orders,
                                                @"status": statusString,
                                                @"resolutionFinished":@(true)} mutableCopy];

  [self sendEventWithName:@"RCTResolutionAuditResponse" body:resolutionAuditDict];
}

- (NSString*)addMarkupToPrompt:(NSString*)content
                    buttonText:(ButtonText * _Nullable)buttonText  {
  
  NSString* buttonTemplate = @"";
  
    if (buttonText.secondaryButton.length > 0) {
        buttonTemplate = [NSString stringWithFormat:@"<Options><Button type='advance'>%@</Button><Button type='negative'>%@</Button></Options>",buttonText.primaryButton, buttonText.secondaryButton];
    } else {
       buttonTemplate = [NSString stringWithFormat:@"<Options><Button type='advance'>%@</Button></Options>",buttonText.primaryButton];
    }
        
    NSString* contentTemplate = [NSString stringWithFormat:@"<Content><Img width='50' height='50' src='https://hippo.dev.sweepr.com/site/restservices/image?domain=network&amp;imageFileName=great&amp;resolutionName=diagnostics'/><Paragraph>%@</Paragraph>%@</Content>",content,buttonTemplate];
    NSString* result = [NSString stringWithFormat:@"<Prompt>%@</Prompt>",contentTemplate];
  
    return result;
  
}

- (enum DialogResponse)showSlide:(NSString * _Nonnull)slideText {  
  
  [self sendEventWithName:@"RCTCardContentResponse" body:@{@"text":slideText}];
  
  self.semaphore = dispatch_semaphore_create(0);
  dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER);
  
  DialogResponse response =  self.response ? DialogResponsePrimary: DialogResponseSecondary;
  
  return response;
}


- (enum DialogResponse)allResolutionsFinishedWithInfotext:(NSString * _Nullable)didIHelpStr
                                                subPrompt:(NSString * _Nonnull)subPrompt
                                                     type:(NSString * _Nullable)type
                                                   status:(enum StatemachineRunState)status
                                               buttonText:(ButtonText * _Nullable)buttonText {
  NSString* statusStr = [self mapInternalStatusToString:status];
  DialogResponse dialogResponse = DialogResponseSecondary;

  if (status != StatemachineRunStateUserCancelled) {

    if ([self.version isEqualToString:@"V2"] == YES) {
      didIHelpStr = [self addMarkupToPrompt:didIHelpStr buttonText:buttonText];
    }

    
    dialogResponse = [self showPrompt:didIHelpStr
                            subPrompt:subPrompt
                                 type:type
                           buttonText:buttonText media:nil];
    if (status != StatemachineRunStateIsFinished) {
      self.statusStr  = dialogResponse == DialogResponsePrimary ? @"SuccessfulAttempt" : @"FailedAttempt";
    }

    if (status ==  StatemachineRunStateIsFinished ) {
      [self sendResolutionStatus:self.statusStr success:true];
    }
  } else if (status == StatemachineRunStateUserCancelled){
    [self sendResolutionStatus:statusStr success:false];
  }
  return dialogResponse;

}

- (enum DialogResponse)showLogTicketPrompt:(NSString * _Nonnull)prompt
                                 subPrompt:(NSString * _Nonnull)subPrompt
                                buttonText:(ButtonText * _Nullable)buttonText
                                     media:(Media * _Nullable)media {
  DialogResponse dialogResponse = DialogResponseSecondary;

  if ([self.version isEqualToString:@"V2"] == YES) {
    prompt = [self addMarkupToPrompt:prompt buttonText:buttonText];
  }
  
  dialogResponse = [self showPrompt:prompt
                          subPrompt:subPrompt
                               type:@"Info"
                         buttonText:buttonText media:nil];


  self.statusStr  = @"InProgress";

  return dialogResponse;
}


- (enum DialogResponse)showDeviceList:(NSArray<SweeprAffectedDevice *> * _Nonnull)deviceList
                           buttonText:(ButtonText * _Nullable)buttonText
                                media:(Media * _Nullable)media {

  NSMutableArray* deviceDicts = [[NSMutableArray alloc] init];
  NSMutableDictionary* responseDict = [[NSMutableDictionary alloc] init];

  for (SweeprAffectedDevice* device in deviceList) {
    NSMutableDictionary* deviceDict = [[device toDictionary] mutableCopy];
    NSString* cmsQuery = deviceDict[@"cmsImageQuery"];
    if ([cmsQuery containsString:@"iphone"]) {
      cmsQuery= [cmsQuery stringByReplacingOccurrencesOfString:@"other" withString:@"apple"];
    }
    if ([cmsQuery containsString:@"macbook"]) {
      cmsQuery = [cmsQuery stringByReplacingOccurrencesOfString:@"other" withString:@"apple"];
    }
    if ([cmsQuery containsString:@"ps4"]) {
      cmsQuery = [cmsQuery stringByReplacingOccurrencesOfString:@"other" withString:@"sony"];
    }
    deviceDict[@"cmsImageQuery"] = cmsQuery;

    if (deviceDicts.count < 6) {
      [deviceDicts addObject:deviceDict];
    }
  }

  NSDictionary* buttonTextDict = [buttonText toDictionary];

  [responseDict setObject:deviceDicts forKey:@"devices"];

  if (buttonTextDict != nil) {
    [responseDict setObject:buttonTextDict forKey:@"buttonText"];
  }

  [self sendEventWithName:@"RCTAffectedDeviceList" body:responseDict];

  self.semaphore = dispatch_semaphore_create(0);
  dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER);

  return self.response ? DialogResponsePrimary: DialogResponseSecondary;
}

- (enum DialogResponse)showStep:(Step * _Nonnull)step {
    NSLog(@"Step is %@", step);
    return DialogResponsePrimary;
}



@end
