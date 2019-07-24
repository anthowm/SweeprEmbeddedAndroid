//
//  RCTSweeprScanSerializer.h
//  
//
//  Created by Eoin Norris on 12/03/2018.
//

#import <Foundation/Foundation.h>

FOUNDATION_EXPORT const NSString *kRCTDeviceHostName;
FOUNDATION_EXPORT const NSString *kRCTDeviceIPAddress;
FOUNDATION_EXPORT const NSString *kRCTDevicePort;
FOUNDATION_EXPORT const NSString *kRCTDeviceMacAddress;
FOUNDATION_EXPORT const NSString *kRCTSubNetMask;
FOUNDATION_EXPORT const NSString *kRCTBrand;
FOUNDATION_EXPORT const NSString *kRCTManufacturer;


@class Device;

@interface RCTSweeprScanSerializer : NSObject

+ (NSDictionary *) serializeDeviceToDictionary:(Device *)device;

@end
