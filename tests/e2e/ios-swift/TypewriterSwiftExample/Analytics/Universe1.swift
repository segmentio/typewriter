/**
 * This client was automatically generated by Segment Typewriter. ** Do Not Edit **
 */

import Foundation

class Universe1: TypewriterSerializable {
/// The common name of this universe.
    var name: String
/// The most important occupants in this universe.
    var occupants: [OccupantsItem1]

    init(name: String, occupants: [OccupantsItem1]) {
        self.name = name
        self.occupants = occupants
    }

    func serializableDictionary() -> [String: Any] {
        var properties = [String: Any]()
        properties["name"] = self.name;
        properties["occupants"] = self.occupants.serializableArray();

        return properties;
    }
}