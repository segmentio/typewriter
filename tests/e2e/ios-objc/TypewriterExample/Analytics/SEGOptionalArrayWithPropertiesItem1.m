/**
 * This client was automatically generated by Segment Typewriter. ** Do Not Edit **
 */

#import "SEGOptionalArrayWithPropertiesItem1.h"

@implementation SEGOptionalArrayWithPropertiesItem1

+(nonnull instancetype) initWithOptionalAny:(nullable id)optionalAny
optionalArray:(nullable NSArray<id> *)optionalArray
optionalBoolean:(nullable BOOL *)optionalBoolean
optionalInt:(nullable NSNumber *)optionalInt
optionalNumber:(nullable NSNumber *)optionalNumber
optionalObject:(nullable SERIALIZABLE_DICT)optionalObject
optionalString:(nullable NSString *)optionalString
optionalStringWithRegex:(nullable NSString *)optionalStringWithRegex {
  SEGOptionalArrayWithPropertiesItem1 *object = [[SEGOptionalArrayWithPropertiesItem1 alloc] init];
  object.optionalAny = optionalAny;
  object.optionalArray = optionalArray;
  object.optionalBoolean = optionalBoolean;
  object.optionalInt = optionalInt;
  object.optionalNumber = optionalNumber;
  object.optionalObject = optionalObject;
  object.optionalString = optionalString;
  object.optionalStringWithRegex = optionalStringWithRegex;
  return object;
}

-(nonnull SERIALIZABLE_DICT) toDictionary {
  NSMutableDictionary *properties = [[NSMutableDictionary alloc] init];
  properties[@"optional any"] = self.optionalAny == nil ? [NSNull null] : self.optionalAny;
  if (self.optionalArray != nil) {
    properties[@"optional array"] = [SEGTypewriterUtils toSerializableArray:self.optionalArray];
  }
  if (self.optionalBoolean != nil) {
    properties[@"optional boolean"] = [NSNumber numberWithBool:*self.optionalBoolean];
  }
  if (self.optionalInt != nil) {
    properties[@"optional int"] = self.optionalInt;
  }
  if (self.optionalNumber != nil) {
    properties[@"optional number"] = self.optionalNumber;
  }
  if (self.optionalObject != nil) {
    properties[@"optional object"] = self.optionalObject;
  }
  if (self.optionalString != nil) {
    properties[@"optional string"] = self.optionalString;
  }
  if (self.optionalStringWithRegex != nil) {
    properties[@"optional string with regex"] = self.optionalStringWithRegex;
  }

  return properties;
}

@end
