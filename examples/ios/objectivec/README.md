# Typewriter on iOS in Objective-C

This example repo demonstrates how to setup and use Typewriter in an iOS Objective-C environment, as a strongly-typed wrapper for [`analytics-ios`](https://segment.com/docs/sources/mobile/ios/).

## Setup

First, install the CocoaPods dependencies with:

```sh
$ pod install
```

Update the Segment write key in [`AppDelegate.m`](TypewriterExample/AppDelegate.m#L17) for the source you want to report analytics to:

```objectivec
NSString *const SEGMENT_WRITE_KEY = @"<Your source write key>";
```

Once you run the app, go the debugger to see events coming in!

## Typewriter Usage

The generated Typewriter client is available in [`TypewriterExample/Analytics`](./TypewriterExample/Analytics).

The JSON schema used to generate this client is available in [`local-tracking-plans/tracking-plan-mobile.json`](../../local-tracking-plans/tracking-plan-mobile.json).

You can regenerate the Typewriter client with `make typewriter-local`.

## Instrumentation

See [`README.md`](/README.md) for more information on instrumenting your iOS app with Typewriter.
