//
//  TypewriterSwiftExampleTests.swift
//  TypewriterSwiftExampleTests
//
//  Created by Colin King on 7/9/19.
//  Copyright © 2019 Colin King. All rights reserved.
//

import XCTest

#if canImport(Segment)
import Segment
#elseif canImport(Analytics)
import Analytics
#endif

@testable import TypewriterSwiftExample

class TypewriterSwiftExampleTests: XCTestCase {
    func testExample() {
        TypewriterAnalytics.emptyEvent()
        
        TypewriterAnalytics.everyRequiredType(
            requiredAny: "Rick Sanchez",
            requiredArray: [137, "C-137"],
            requiredArrayWithProperties: [
                RequiredArrayWithPropertiesItem1.init(
                    requiredAny: "Rick Sanchez",
                    requiredArray: [137, "C-137"],
                    requiredBoolean: false,
                    requiredInt: 97,
                    requiredNumber: 3.14,
                    requiredObject: [:],
                    requiredString: "Alpha-Betrium",
                    requiredStringWithRegex:  "Lawyer Morty"),
            ],
            requiredBoolean: false,
            requiredInt: 97,
            requiredNumber: 3.14,
            requiredObject: [:],
            requiredObjectWithProperties: RequiredObjectWithProperties1.init(
                requiredAny: "Rick Sanchez",
                requiredArray: [137, "C-137"],
                requiredBoolean: false,
                requiredInt: 97,
                requiredNumber: 3.14,
                requiredObject: [:],
                requiredString: "Alpha-Betrium",
                requiredStringWithRegex:  "Lawyer Morty"),
            requiredString: "Alpha-Betrium",
            requiredStringWithRegex:  "Lawyer Morty")
            
        TypewriterAnalytics.everyOptionalType(
            optionalAny: nil,
            optionalArray: nil,
            optionalArrayWithProperties: nil,
            optionalBoolean: nil,
            optionalInt: nil,
            optionalNumber: nil,
            optionalObject: nil,
            optionalObjectWithProperties: nil,
            optionalString: nil,
            optionalStringWithRegex:  nil)
        
        TypewriterAnalytics.everyOptionalType(
            optionalAny: "Rick Sanchez",
            optionalArray: [137, "C-137"],
            optionalArrayWithProperties: [
                OptionalArrayWithPropertiesItem1.init(
                    optionalAny: "Rick Sanchez",
                    optionalArray: [137, "C-137"],
                    optionalBoolean: false,
                    optionalInt: 97,
                    optionalNumber: 3.14,
                    optionalObject: [:],
                    optionalString: "Alpha-Betrium",
                    optionalStringWithRegex:  "Lawyer Morty"),
            ],
            optionalBoolean: false,
            optionalInt: 97,
            optionalNumber: 3.14,
            optionalObject: [:],
            optionalObjectWithProperties: OptionalObjectWithProperties1.init(
                optionalAny: "Rick Sanchez",
                optionalArray: [137, "C-137"],
                optionalBoolean: false,
                optionalInt: 97,
                optionalNumber: 3.14,
                optionalObject: [:],
                optionalString: "Alpha-Betrium",
                optionalStringWithRegex:  "Lawyer Morty"),
            optionalString: "Alpha-Betrium",
            optionalStringWithRegex:  "Lawyer Morty")
        
        TypewriterAnalytics.everyNullableRequiredType(
            requiredAny: nil,
            requiredArray: nil,
            requiredArrayWithProperties: [
                RequiredArrayWithPropertiesItem.init(
                    requiredAny: nil,
                    requiredArray: nil,
                    requiredBoolean: nil,
                    requiredInt: nil,
                    requiredNumber: nil,
                    requiredObject: nil,
                    requiredString: nil,
                    requiredStringWithRegex: nil),
            ],
            requiredBoolean: nil,
            requiredInt: nil,
            requiredNumber: nil,
            requiredObject: nil,
            requiredObjectWithProperties: RequiredObjectWithProperties.init(
                requiredAny: nil,
                requiredArray: nil,
                requiredBoolean: nil,
                requiredInt: nil,
                requiredNumber: nil,
                requiredObject: nil,
                requiredString: nil,
                requiredStringWithRegex: nil),
            requiredString: nil,
            requiredStringWithRegex: nil)

        TypewriterAnalytics.everyNullableRequiredType(
            requiredAny: "Rick Sanchez",
            requiredArray: [137, "C-137"],
            requiredArrayWithProperties: [
                RequiredArrayWithPropertiesItem.init(
                    requiredAny: "Rick Sanchez",
                    requiredArray: [137, "C-137"],
                    requiredBoolean: false,
                    requiredInt: 97,
                    requiredNumber: 3.14,
                    requiredObject: [:],
                    requiredString: "Alpha-Betrium",
                    requiredStringWithRegex:  "Lawyer Morty"),
            ],
            requiredBoolean: false,
            requiredInt: 97,
            requiredNumber: 3.14,
            requiredObject: [:],
            requiredObjectWithProperties: RequiredObjectWithProperties.init(
                requiredAny: "Rick Sanchez",
                requiredArray: [137, "C-137"],
                requiredBoolean: false,
                requiredInt: 97,
                requiredNumber: 3.14,
                requiredObject: [:],
                requiredString: "Alpha-Betrium",
                requiredStringWithRegex:  "Lawyer Morty"),
            requiredString: "Alpha-Betrium",
            requiredStringWithRegex:  "Lawyer Morty")
        
        TypewriterAnalytics.everyNullableOptionalType(
            optionalAny: nil,
            optionalArray: nil,
            optionalArrayWithProperties: nil,
            optionalBoolean: nil,
            optionalInt: nil,
            optionalNumber: nil,
            optionalObject: nil,
            optionalObjectWithProperties: nil,
            optionalString: nil,
            optionalStringWithRegex:  nil)
        
        TypewriterAnalytics.everyNullableOptionalType(
            optionalAny: "Rick Sanchez",
            optionalArray: [137, "C-137"],
            optionalArrayWithProperties: [
                OptionalArrayWithPropertiesItem.init(
                    optionalAny: "Rick Sanchez",
                    optionalArray: [137, "C-137"],
                    optionalBoolean: false,
                    optionalInt: 97,
                    optionalNumber: 3.14,
                    optionalObject: [:],
                    optionalString: "Alpha-Betrium",
                    optionalStringWithRegex:  "Lawyer Morty"),
            ],
            optionalBoolean: false,
            optionalInt: 97,
            optionalNumber: 3.14,
            optionalObject: [:],
            optionalObjectWithProperties: OptionalObjectWithProperties.init(
                optionalAny: "Rick Sanchez",
                optionalArray: [137, "C-137"],
                optionalBoolean: false,
                optionalInt: 97,
                optionalNumber: 3.14,
                optionalObject: [:],
                optionalString: "Alpha-Betrium",
                optionalStringWithRegex:  "Lawyer Morty"),
            optionalString: "Alpha-Betrium",
            optionalStringWithRegex:  "Lawyer Morty")
        
        TypewriterAnalytics.I42TerribleEventName3()
        
        TypewriterAnalytics.propertySanitized(I0000TerriblePropertyName3: "what a cronenberg")
        
        TypewriterAnalytics.eventCollided()
        
        TypewriterAnalytics.eventCollided1()
        
        TypewriterAnalytics.propertiesCollided(propertyCollided: "The Citadel", propertyCollided1: "Galactic Prison")
        
        TypewriterAnalytics.propertyObjectNameCollision1(universe: Universe.init(name: "Froopyland", occupants: [
            OccupantsItem.init(name: "Beth Smith"),
            OccupantsItem.init(name: "Thomas Lipkip"),
        ]))
        
        TypewriterAnalytics.propertyObjectNameCollision2(universe: Universe1.init(name: "Froopyland", occupants: [
            OccupantsItem1.init(name: "Beth Smith"),
            OccupantsItem1.init(name: "Thomas Lipkip"),
        ]))
        
        TypewriterAnalytics.simpleArrayTypes(any: [137, "C-137"], boolean: [true, false], integer: [97], nullable: nil, number: [3.14], object: [ObjectItem.init(name: "Beth Smith")], string: ["Alpha-Betrium"])
        
        TypewriterAnalytics.nestedObjects(garage: Garage.init(tunnel: Tunnel.init(subterraneanLab: SubterraneanLab.init(jerrysMemories: [], mortysMemories: [], summersContingencyPlan: "Oh, man, it’s a scenario four."))))
        
        TypewriterAnalytics.nestedArrays(universeCharacters: [
            [
                UniverseCharactersItemItem.init(name: "Morty Smith"),
                UniverseCharactersItemItem.init(name: "Rick Sanchez")
            ],
            [
                UniverseCharactersItemItem.init(name: "Cronenberg Morty"),
                UniverseCharactersItemItem.init(name: "Cronenberg Rick")
            ]
        ])

        TypewriterAnalytics.largeNumbersEvent(largeNullableOptionalInteger: 1230007112658965944, largeNullableOptionalNumber: 1240007112658965944331.0, largeNullableRequiredInteger: 1250007112658965944, largeNullableRequiredNumber: 1260007112658965944331.0, largeOptionalInteger: 1270007112658965944, largeOptionalNumber: 1280007112658965944331.0, largeRequiredInteger: 1290007112658965944, largeRequiredNumber: 1300007112658965944331.0)

        // Note: flushing is an async operation in analytics-ios. Therefore, we use notifications to
        // identify when all events have finished flushing.
        var finishedFlushing = false
        NotificationCenter.default.addObserver(forName: Notification.Name.SEGSegmentDidSendRequest, object: nil, queue: nil) { (notification) in
            print("Typewriter: mentRequestDidSucceedNotification notification fired")
            finishedFlushing = true
        }
        // We also want to catch failures, so that our test suite will still finish.
        NotificationCenter.default.addObserver(forName: Notification.Name.SEGSegmentRequestDidFail, object: nil, queue: nil) { (notification) in
            print("Typewriter: mentRequestDidFailNotification notification fired")
            finishedFlushing = true
        }
        
        Analytics.shared().flush()
        
        while(!finishedFlushing) {
            RunLoop.current.run(until: Date.init(timeIntervalSinceNow: 0.1))
        }
    }
}
