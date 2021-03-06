/**
 * This client was automatically generated by Segment Typewriter. ** Do Not Edit **
 */

#import <Foundation/Foundation.h>
#import <Analytics/SEGSerializableValue.h>
#import "SEGTypewriterSerializable.h"
#import "SEGTypewriterUtils.h"

@interface SEGRequiredArrayWithPropertiesItem : NSObject<SEGTypewriterSerializable>

/// Required any property
@property (strong, nonatomic, nonnull) id requiredAny;
/// Required array property
@property (strong, nonatomic, nonnull) NSArray<id> *requiredArray;
/// Required boolean property
@property (strong, nonatomic, nonnull) NSNumber *requiredBoolean;
/// Required integer property
@property (strong, nonatomic, nonnull) NSNumber *requiredInt;
/// Required number property
@property (strong, nonatomic, nonnull) NSNumber *requiredNumber;
/// Required object property
@property (strong, nonatomic, nonnull) SERIALIZABLE_DICT requiredObject;
/// Required string property
@property (strong, nonatomic, nonnull) NSString *requiredString;
/// Required string property with a regex conditional
@property (strong, nonatomic, nonnull) NSString *requiredStringWithRegex;

+(nonnull instancetype) initWithRequiredAny:(nullable id)requiredAny
requiredArray:(nullable NSArray<id> *)requiredArray
requiredBoolean:(nullable NSNumber *)requiredBoolean
requiredInt:(nullable NSNumber *)requiredInt
requiredNumber:(nullable NSNumber *)requiredNumber
requiredObject:(nullable SERIALIZABLE_DICT)requiredObject
requiredString:(nullable NSString *)requiredString
requiredStringWithRegex:(nullable NSString *)requiredStringWithRegex;

-(nonnull SERIALIZABLE_DICT) toDictionary;

@end
