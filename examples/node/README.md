# Typewriter in Node.js

This example repo demonstrates how to setup and use Typewriter in a Node.js environment, as a strongly-typed wrapper for [`analytics-node`](https://segment.com/docs/sources/server/node/quickstart/).

## Setup

Install dependencies:

```
$ yarn
```

Update the Segment write key in [`app.js`](./app.js#L14) for the source you want to report analytics to:

```javascript
var analytics = new Analytics('<Your source write key>');
```

Run the development server:

```
$ yarn dev
yarn run v1.10.1
$ DEBUG=node:* yarn start
$ node ./bin/www
  node:server Listening on port 3000 +0ms
```

Once you run the app, go the debugger to see events coming in!

## Typewriter Usage

The generated Typewriter client is available in [`generated/index.js`](./generated/index.js).

The JSON schema used to generate this client is available in [`local-tracking-plans/tracking-plan-mobile.json`](../local-tracking-plans/tracking-plan-mobile.json).

You can regenerate the Typewriter client with `yarn run typewriter-local`.

## Instrumentation

See [`README.md`](/README.md) for more information on instrumenting your Javascript app with Typewriter.
