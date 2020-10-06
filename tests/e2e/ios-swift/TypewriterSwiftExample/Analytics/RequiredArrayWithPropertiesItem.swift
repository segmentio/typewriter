/**
 * This client was automatically generated by Segment Typewriter. ** Do Not Edit **
 */

import Foundation

class RequiredArrayWithPropertiesItem: TypewriterSerializable {
/// Required any property
    var requiredAny: Any?
/// Required array property
    var requiredArray: [Any]?
/// Required boolean property
    var requiredBoolean: Bool?
/// Required integer property
    var requiredInt: Int?
/// Required number property
    var requiredNumber: Decimal?
/// Required object property
    var requiredObject: [String: Any]?
/// Required string property
    var requiredString: String?
/// Required string property with a regex conditional
    var requiredStringWithRegex: String?

    init(requiredAny: Any?, requiredArray: [Any]?, requiredBoolean: Bool?, requiredInt: Int?, requiredNumber: Decimal?, requiredObject: [String: Any]?, requiredString: String?, requiredStringWithRegex: String?) {
        self.requiredAny = requiredAny
        self.requiredArray = requiredArray
        self.requiredBoolean = requiredBoolean
        self.requiredInt = requiredInt
        self.requiredNumber = requiredNumber
        self.requiredObject = requiredObject
        self.requiredString = requiredString
        self.requiredStringWithRegex = requiredStringWithRegex
    }

    func serializableDictionary() -> [String: Any] {
        var properties = [String: Any]()
        properties["required any"] = self.requiredAny == nil ? NSNull() : self.requiredAny
        properties["required array"] = self.requiredArray == nil ? NSNull() : self.requiredArray?.serializableArray()
        properties["required boolean"] = self.requiredBoolean == nil ? NSNull() : self.requiredBoolean
        properties["required int"] = self.requiredInt == nil ? NSNull() : self.requiredInt
        properties["required number"] = self.requiredNumber == nil ? NSNull() : self.requiredNumber
        properties["required object"] = self.requiredObject == nil ? NSNull() : self.requiredObject
        properties["required string"] = self.requiredString == nil ? NSNull() : self.requiredString
        properties["required string with regex"] = self.requiredStringWithRegex == nil ? NSNull() : self.requiredStringWithRegex

        return properties;
    }
}