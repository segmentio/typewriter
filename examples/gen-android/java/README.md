# Android Java Example

This example repo demonstrates how to setup and use Typewriter in an Android Java environment, as a strongly-typed wrapper for [`analytics-android`](https://segment.com/docs/sources/mobile/android/).

## Example Setup

Update the Segment write key in [MainActivity.java](app/src/main/java/com/segment/typewriterexample/MainActivity.java#L20) for the source you want to report analytics to:

```java
private static final String SEGMENT_WRITE_KEY = "<Your source write key>";
```

Once you run the app, go the debugger to see events coming in!

## Typewriter Usage

The generated Typewriter client is available in [`app/src/main/java/com/segment/analytics/`](./app/src/main/java/com/segment/analytics/).

The JSON schema used to generate this client is available in [`local-tracking-plans/tracking-plan.json`](../../local-tracking-plans/tracking-plan.json).

You can regenerate the Typewriter client using the following [`make` command](Makefile):

```sh
$ make build typewriter-local
```

## Instrumentation

See [`README.md`](/README.md) for more information on instrumenting your Android app with Typewriter.
