# Typewriter in JavaScript

This example repo demonstrates how to setup and use Typewriter in a web JavaScript environment, as a strongly-typed wrapper for [`analytics-js`](https://segment.com/docs/sources/website/analytics.js/).

## Setup

Install dependencies:

```
$ yarn
```

Update the Segment write key in [`Layout.js`](./components/Layout.js#L10) for the source you want to report analytics to:

```javascript
analytics.load("<Your source write key>");
```

Run the development server:

```
$ yarn run dev
DONE  Compiled successfully in 1564ms                                       18:06:53

> Ready on http://localhost:3000
```

Once you run the app, go to the debugger to see events coming in!

## Typewriter Usage

The generated Typewriter client is available in [`analytics/generated/index.js`](./analytics/generated/index.js).

The JSON schema used to generate this client is available in [`local-tracking-plans/tracking-plan-slothgram.json`](../../local-tracking-plans/tracking-plan-slothgram.json).

You can regenerate the Typewriter client with `yarn run typewriter`.

## Instrumentation

See [`README.md`](/README.md) for more information on instrumenting your JavaScript app with Typewriter.
