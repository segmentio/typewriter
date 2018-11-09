# Typewriter in Typescript

This example repo demonstrates how to setup and use Typewriter in a web Typescript environment, as a strongly-typed wrapper for [`analytics-js`](https://segment.com/docs/sources/website/analytics.js/).

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

Once you run the app, go the debugger to see events coming in!

## Typewriter Usage

The generated Typewriter client is available in [`pages/generated/index.ts`](./pages/generated/index.ts).

The JSON schema used to generate this client is available in [`local-tracking-plans/tracking-plan-web.json`](../local-tracking-plans/tracking-plan-web.json).

You can regenerate the Typewriter client with `yarn run typewriter`.

## Instrumentation

See [`README.md`](/README.md) for more information on instrumenting your Typescript app with Typewriter.
