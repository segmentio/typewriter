//
//  TypewriterSwiftExampleTests.swift
//  TypewriterSwiftExampleTests
//
//  Created by Colin King on 7/9/19.
//  Copyright © 2019 Colin King. All rights reserved.
//

import XCTest
@testable import TypewriterSwiftExample

class TypewriterSwiftExampleTests: XCTestCase {
    func testExample() {
        SEGTypewriterAnalytics.emptyEvent()
        
        SEGTypewriterAnalytics.everyRequiredType(
            withRequiredAny: "Rick Sanchez",
            requiredArray: [137, "C-137"],
            requiredArrayWithProperties: [
                SEGRequiredArrayWithPropertiesItem1.initWithRequiredAny(
                    "Rick Sanchez",
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
            requiredObjectWithProperties: SEGRequiredObjectWithProperties1.initWithRequiredAny(
                "Rick Sanchez",
                requiredArray: [137, "C-137"],
                requiredBoolean: false,
                requiredInt: 97,
                requiredNumber: 3.14,
                requiredObject: [:],
                requiredString: "Alpha-Betrium",
                requiredStringWithRegex:  "Lawyer Morty"),
            requiredString: "Alpha-Betrium",
            requiredStringWithRegex:  "Lawyer Morty")
            
        SEGTypewriterAnalytics.everyOptionalType(
            withOptionalAny: nil,
            optionalArray: nil,
            optionalArrayWithProperties: nil,
            optionalBoolean: nil,
            optionalInt: nil,
            optionalNumber: nil,
            optionalObject: nil,
            optionalObjectWithProperties: nil,
            optionalString: nil,
            optionalStringWithRegex:  nil)
        
        SEGTypewriterAnalytics.everyOptionalType(
            withOptionalAny: "Rick Sanchez",
            optionalArray: [137, "C-137"],
            optionalArrayWithProperties: [
                SEGOptionalArrayWithPropertiesItem1.initWithOptionalAny(
                    "Rick Sanchez",
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
            optionalObjectWithProperties: SEGOptionalObjectWithProperties1.initWithOptionalAny(
                "Rick Sanchez",
                optionalArray: [137, "C-137"],
                optionalBoolean: false,
                optionalInt: 97,
                optionalNumber: 3.14,
                optionalObject: [:],
                optionalString: "Alpha-Betrium",
                optionalStringWithRegex:  "Lawyer Morty"),
            optionalString: "Alpha-Betrium",
            optionalStringWithRegex:  "Lawyer Morty")
        
        SEGTypewriterAnalytics.everyNullableRequiredType(
            withRequiredAny: nil,
            requiredArray: nil,
            requiredArrayWithProperties: [
                SEGRequiredArrayWithPropertiesItem.initWithRequiredAny(
                    nil,
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
            requiredObjectWithProperties: SEGRequiredObjectWithProperties.initWithRequiredAny(
                nil,
                requiredArray: nil,
                requiredBoolean: nil,
                requiredInt: nil,
                requiredNumber: nil,
                requiredObject: nil,
                requiredString: nil,
                requiredStringWithRegex: nil),
            requiredString: nil,
            requiredStringWithRegex: nil)

        SEGTypewriterAnalytics.everyNullableRequiredType(
            withRequiredAny: "Rick Sanchez",
            requiredArray: [137, "C-137"],
            requiredArrayWithProperties: [
                SEGRequiredArrayWithPropertiesItem.initWithRequiredAny(
                    "Rick Sanchez",
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
            requiredObjectWithProperties: SEGRequiredObjectWithProperties.initWithRequiredAny(
                "Rick Sanchez",
                requiredArray: [137, "C-137"],
                requiredBoolean: false,
                requiredInt: 97,
                requiredNumber: 3.14,
                requiredObject: [:],
                requiredString: "Alpha-Betrium",
                requiredStringWithRegex:  "Lawyer Morty"),
            requiredString: "Alpha-Betrium",
            requiredStringWithRegex:  "Lawyer Morty")
        
        SEGTypewriterAnalytics.everyNullableOptionalType(
            withOptionalAny: nil,
            optionalArray: nil,
            optionalArrayWithProperties: nil,
            optionalBoolean: nil,
            optionalInt: nil,
            optionalNumber: nil,
            optionalObject: nil,
            optionalObjectWithProperties: nil,
            optionalString: nil,
            optionalStringWithRegex:  nil)
        
        SEGTypewriterAnalytics.everyNullableOptionalType(
            withOptionalAny: "Rick Sanchez",
            optionalArray: [137, "C-137"],
            optionalArrayWithProperties: [
                SEGOptionalArrayWithPropertiesItem.initWithOptionalAny(
                    "Rick Sanchez",
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
            optionalObjectWithProperties: SEGOptionalObjectWithProperties.initWithOptionalAny(
                "Rick Sanchez",
                optionalArray: [137, "C-137"],
                optionalBoolean: false,
                optionalInt: 97,
                optionalNumber: 3.14,
                optionalObject: [:],
                optionalString: "Alpha-Betrium",
                optionalStringWithRegex:  "Lawyer Morty"),
            optionalString: "Alpha-Betrium",
            optionalStringWithRegex:  "Lawyer Morty")
        
        SEGTypewriterAnalytics.i42TerribleEventName3()
        
        SEGTypewriterAnalytics.propertySanitized(withI0000TerriblePropertyName3: "what a cronenberg")
        
        SEGTypewriterAnalytics.eventCollided()
        
        SEGTypewriterAnalytics.eventCollided1()
        
        SEGTypewriterAnalytics.propertiesCollided(withPropertyCollided: "The Citadel", propertyCollided1: "Galactic Prison")
        
        SEGTypewriterAnalytics.propertyObjectNameCollision1(with: SEGUniverse.initWithName("Froopyland", occupants: [
                SEGOccupantsItem.initWithName("Beth Smith"),
                SEGOccupantsItem.initWithName("Thomas Lipkip"),
        ]))
        
        SEGTypewriterAnalytics.propertyObjectNameCollision2(with: SEGUniverse1.initWithName("Froopyland", occupants: [
            SEGOccupantsItem1.initWithName("Beth Smith"),
            SEGOccupantsItem1.initWithName("Thomas Lipkip"),
        ]))
        
        SEGTypewriterAnalytics.simpleArrayTypes(withAny: [137, "C-137"], boolean: [true, false], integer: [97], nullable_: nil, number: [3.14], object: [SEGObjectItem.initWithName("Beth Smith")], string: ["Alpha-Betrium"])
        
        SEGTypewriterAnalytics.nestedObjects(with: SEGGarage.initWith(SEGTunnel.initWith(SEGSubterraneanLab.initWithJerrysMemories([], mortysMemories: [], summersContingencyPlan: "Oh, man, it’s a scenario four."))))
        
        SEGTypewriterAnalytics.nestedArrays(withUniverseCharacters: [
            [
                SEGUniverseCharactersItemItem.initWithName("Morty Smith"),
                SEGUniverseCharactersItemItem.initWithName("Rick Sanchez")
            ],
            [
                SEGUniverseCharactersItemItem.initWithName("Cronenberg Morty"),
                SEGUniverseCharactersItemItem.initWithName("Cronenberg Rick")
            ]
        ])

        SEGTypewriterAnalytics.largeNumbersEvent(withLargeNullableOptionalInteger: 1230007112658965944, largeNullableOptionalNumber: 1240007112658965944331.0, largeNullableRequiredInteger: 1250007112658965944, largeNullableRequiredNumber: 1260007112658965944331.0, largeOptionalInteger: 1270007112658965944, largeOptionalNumber: 1280007112658965944331.0, largeRequiredInteger: 1290007112658965944, largeRequiredNumber: 1300007112658965944331.0)

        // Note: flushing is an async operation in analytics-ios. Therefore, we use notifications to
        // identify when all events have finished flushing.
        var finishedFlushing = false
        NotificationCenter.default.addObserver(forName: Notification.Name.SEGSegmentRequestDidSucceed, object: nil, queue: nil) { (notification) in
            print("Typewriter: SEGSegmentRequestDidSucceedNotification notification fired")
            finishedFlushing = true
        }
        // We also want to catch failures, so that our test suite will still finish.
        NotificationCenter.default.addObserver(forName: Notification.Name.SEGSegmentRequestDidFail, object: nil, queue: nil) { (notification) in
            print("Typewriter: SEGSegmentRequestDidFailNotification notification fired")
            finishedFlushing = true
        }
        
        SEGAnalytics.shared()!.flush()
        
        while(!finishedFlushing) {
            RunLoop.current.run(until: Date.init(timeIntervalSinceNow: 0.1))
        }
    }
}
