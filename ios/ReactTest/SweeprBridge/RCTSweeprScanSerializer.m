//
//  RCTSweeprScanSerializer.m
//  
//
//  Created by Eoin Norris on 12/03/2018.
//

#import "RCTSweeprScanSerializer.h"
#import <Sweepr/Sweepr-Swift.h>

const NSString *kRCTDeviceHostName = @"hostName";
const NSString *kRCTDeviceTrimHostName = @"sanitisedHostName";
const NSString *kRCTDeviceIPAddress = @"ipAddress";
const NSString *kRCTDevicePort = @"devicePort";
const NSString *kRCTDeviceMacAddress = @"macAddress";
const NSString *kRCTSubNetMask = @"subnetmask";
const NSString *kRCTBrand = @"brand";
const NSString *kRCTManufacturer = @"manufacturer";
const NSString *kRCTType = @"deviceType";



@implementation RCTSweeprScanSerializer

+(NSString*)hostNameToType:(NSString*)hostName{
  if ([[hostName uppercaseString] containsString:@"MACBOOK"]) {
      return @"macbook";
  } else if ([[hostName uppercaseString] containsString:@"MACBOOK PRO"]) {
    return @"macbookpro";
  } else if ([[hostName uppercaseString] containsString:@"IPHONE"]) {
    return @"iphone";
  } else if ([[hostName uppercaseString] containsString:@"GOOGLE HOME"]) {
    return @"googlehome";
  } else if ([[hostName uppercaseString] containsString:@"PS4"]) {
    return @"playstation";
  } else if ([[hostName uppercaseString] containsString:@"XBOX"]) {
    return @"xbox";
  }  else if ([[hostName uppercaseString] containsString:@"RING.COM DOORBELL"]) {
    return @"ringdoorbell";
  }
  
  return @"unknown";
}

+ (NSString*)trimmedUpperCaseString:(NSString*)inString{
  NSMutableCharacterSet *charactersToKeep = [NSMutableCharacterSet alphanumericCharacterSet];
  [charactersToKeep addCharactersInString:@" ,."];
  
  NSCharacterSet *charactersToRemove = [charactersToKeep invertedSet];
  
  NSString* result =   [[[inString componentsSeparatedByCharactersInSet:charactersToRemove] componentsJoinedByString:@"" ] uppercaseString];
  
  NSArray* words = [result componentsSeparatedByCharactersInSet :[NSCharacterSet whitespaceAndNewlineCharacterSet]];
  return  [words componentsJoinedByString:@""];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[];
}

+ (NSDictionary *) serializeDeviceToDictionary:(Device *)device{
  NSMutableDictionary *serviceInfo = [[NSMutableDictionary alloc] init];
  
  serviceInfo[kRCTDeviceIPAddress] = device.ipAddress;
  serviceInfo[kRCTDevicePort] = @(device.port);

  if (device.fullName.length) {
    serviceInfo[kRCTDeviceHostName] = device.fullName;
    serviceInfo[kRCTType] = [RCTSweeprScanSerializer hostNameToType:device.fullName];
    serviceInfo[kRCTDeviceTrimHostName] =  [RCTSweeprScanSerializer trimmedUpperCaseString:device.fullName];
  }
  if (device.macAddress.length) {
    serviceInfo[kRCTDeviceMacAddress] = device.macAddress;
  }
  if (device.subnetMask.length) {
    serviceInfo[kRCTSubNetMask] = device.subnetMask;
  }

  if (device.manufacturer.length) {
    serviceInfo[kRCTManufacturer] = device.manufacturer;
  }


//  NSLog(@"device in serializeDeviceToDictionary is %@", serviceInfo);
  
  return [NSDictionary dictionaryWithDictionary:serviceInfo];
}

@end
