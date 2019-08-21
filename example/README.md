# Typewriter Example

This example repo demonstrates how to setup and use Typewriter in a JavaScript web environment, as a strongly-typed wrapper for [`analytics.js`](https://segment.com/docs/sources/website/analytics.js/).

## Setup

Install dependencies:

```sh
$ yarn
```

Update the Segment write key in [`Layout.tsx`](./components/Layout.tsx#L10) for the source you want to report analytics to:

```typescript
analytics.load("<Your source write key>");
```

Run the development server:

```sh
$ yarn run dev
DONE  Compiled successfully in 1409ms                                       18:15:03

> Ready on http://localhost:3000
No type errors found
Version: typescript 3.1.1
Time: 2219ms
```

Once you run the app, go the Debugger to see events coming in!

## Typewriter Usage

The generated Typewriter client is available in [`analytics/index.ts`](./analytics/index.ts).

The JSON schema used to generate this client is available in [`local-tracking-plans/tracking-plan-slothgram.json`](../../local-tracking-plans/tracking-plan-slothgram.json).

You can regenerate the Typewriter client with `yarn run typewriter`.

## More Documentation

See the [`Typewriter docs`](https://segment.com/docs/protocols/typewriter) for more information on instrumenting your app with Typewriter.
