/**
 * This client was automatically generated by Segment Typewriter. ** Do Not Edit **
 */

#import "SEGOptionalObjectWithProperties.h"

@implementation SEGOptionalObjectWithProperties

+(nonnull instancetype) initWithOptionalAny:(nullable id)optionalAny
optionalArray:(nullable NSArray<id> *)optionalArray
optionalBoolean:(nullable NSNumber *)optionalBoolean
optionalInt:(nullable NSNumber *)optionalInt
optionalNumber:(nullable NSNumber *)optionalNumber
optionalObject:(nullable SERIALIZABLE_DICT)optionalObject
optionalString:(nullable NSString *)optionalString
optionalStringWithRegex:(nullable NSString *)optionalStringWithRegex {
  SEGOptionalObjectWithProperties *object = [[SEGOptionalObjectWithProperties alloc] init];
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
  if (self.optionalAny != nil) {
    properties[@"optional any"] = self.optionalAny;
  }
  if (self.optionalArray != nil) {
    properties[@"optional array"] = [SEGTypewriterUtils toSerializableArray:self.optionalArray];
  }
  if (self.optionalBoolean != nil) {
    properties[@"optional boolean"] = self.optionalBoolean;
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
