// SignalStrengthModule.m

#import "SignalStrengthModule.h"
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>

@implementation SignalStrengthModule

RCT_EXPORT_MODULE(SignalStrengthModule);

RCT_EXPORT_METHOD(getSignalStrength:(RCTResponseSenderBlock)callback) {
    CTTelephonyNetworkInfo *networkInfo = [[CTTelephonyNetworkInfo alloc] init];
    CTCarrier *carrier = [networkInfo subscriberCellularProvider];
    if (carrier != nil) {
        NSNumber *strengthValue = [carrier signalStrength];
        callback(@[strengthValue]);
    } else {
        callback(@[@(-1)]);
    }
}

@end
