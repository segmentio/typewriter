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
        
        SEGTypewriterAnalytics.everyRequiredType(withRequiredArray: [137, "C-137"], requiredBoolean: false, requiredInt: 97, requiredNumber: 3.14, requiredObject: [:], requiredString: "Alpha-Betrium", requiredStringWithRegex: "Lawyer Morty", requiredAny: "Rick Sanchez")
        
        SEGTypewriterAnalytics.everyOptionalType(withOptionalInt: nil, optionalNumber: nil, optionalObject: nil, optionalString: nil, optionalStringWithRegex: nil, optionalAny: nil, optionalArray: nil, optionalBoolean: nil)
        
        // The bridging process borked the "required string with regex" field below.
        SEGTypewriterAnalytics.everyNullableRequiredTypeWithRequiredString(withRegex: nil, requiredAny: nil, requiredArray: nil, requiredBoolean: nil, requiredInt: nil, requiredNumber: nil, requiredObject: nil, requiredString: nil)
        
        SEGTypewriterAnalytics.everyNullableOptionalType(withOptionalString: nil, optionalStringWithRegex: nil, optionalAny: nil, optionalArray: nil, optionalBoolean: nil, optionalInt: nil, optionalNumber: nil, optionalObject: nil)
        
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
        
        SEGTypewriterAnalytics.simpleArrayTypes(withNumber: [3.14], object: [SEGObjectItem.initWithName("Beth Smith")], string: ["Alpha-Betrium"], any: [137, "C-137"], boolean: [true, false], integer: [3.14], nullable_: nil)
        
        SEGTypewriterAnalytics.nestedObjects(with: SEGGarage.initWith(SEGTunnel.initWith(SEGSubterraneanLab.initWithJerrysMemories([], mortysMemories: [], summersContingencyPlan: "Oh, man, it's a scenario four."))))
        
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
        
        SEGAnalytics.shared().flush()
        
        while(!finishedFlushing) {
            RunLoop.current.run(until: Date.init(timeIntervalSinceNow: 0.1))
        }
    }
}
