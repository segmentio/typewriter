<p align="center">
	<br>
	<br>
  <img src=".github/assets/typewriter-logo.svg?sanitize=true" alt="Typewriter logo" />
  <br>
  <br>
  <br>
  <br>

  <a href="https://circleci.com/gh/segmentio/typewriter">
    <img src="https://circleci.com/gh/segmentio/typewriter.svg?style=svg&circle-token=8c1e734c99bdc08170e12d85af7a371900e33e96" alt="CircleCI Status">
  </a>
  <a href="http://www.npmjs.com/package/typewriter">
    <img src="https://img.shields.io/npm/v/typewriter.svg" alt="NPM Version">
  </a>
  <a href="./.github/LICENSE.md">
    <img src="https://img.shields.io/npm/l/typewriter.svg" alt="License">
  </a>
  <br>
  <br>
  <br>

  <img src=".github/assets/readme-example.gif" alt="Typewriter GIF Example" width="70%"/>
</p>

- **Strongly Typed Analytics**: Generates strongly-typed [Segment](http://segment.com) analytics clients from arbitrary [JSON Schema](http://json-schema.org).

- **Cross-Language Support**: Supports native clients in [JavaScript](#javascript--typescript-quickstart), [TypeScript](#javascript--typescript-quickstart), [Node.js](#nodejs-quickstart), [Android](#android-quickstart) and [iOS](#ios-quickstart).

- **Segment Protocols**: Built-in support to sync your Typewriter clients with your [centralized Tracking Plans](https://segment.com/product/protocols/).

## Install

```sh
$ yarn add -D typewriter
```

## Validation Warnings

| Language          | Build-Time | Run-Time                     |
|-------------------|----------|--------------------------------|
| [JavaScript](#javascript--typescript-quickstart)       | ❌ Types<br>❌ Naming<br>❌ Required Properties<br>✅ Intellisense | ✅ Types<br>✅ Naming<br>✅ Required Properties<br>N/A |
| [TypeScript](#javascript--typescript-quickstart)        | ✅ Types<br>✅ Naming<br>✅ Required Properties<br>✅ Intellisense | ✅ Types<br>✅ Naming<br>✅ Required Properties<br>N/A |
| [Android (Java)](#android-quickstart)    | ✅ Types<br>✅ Naming<br>❌ Required Properties<br>✅ Intellisense | ✅ Types<br>✅ Naming<br>✅ Required Properties<br>N/A |
| [iOS (Objective C)](#ios-quickstart) | ✅ Types<br>✅ Naming<br>❌ Required Properties<br>✅ Intellisense | ✅ Types<br>✅ Naming<br>✅ Required Properties<br>N/A |

## JSON Schema Setup

> Using [Segment Protocols](https://segment.com/product/protocols)? You can download a JSON Schema version of your Tracking Plan directly from the Segment Platform API. See the [instructions below](#protocols-customers).

Typewriter supports generating clients from multiple events without collisions, where each event is validated by its own [JSON Schema](http://json-schema.org/). A minimal example might look like:

```json
{
  "events": [
    {
      "name": "Viewed Typewriter",
      "description": "Fired when a user views the Typewriter landing page",
      "rules": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
          "properties": {
            "type": "object",
            "properties": {
              "user_id": {
                "type": "string",
                "description": "The user viewing Typewriter"
              }
            }
          }
        },
        "required": ["properties"]
      }
    }
  ]
}
```

Typewriter supports JSON Schema [`draft-04`](https://github.com/json-schema-org/json-schema-spec/tree/draft-04) through [`draft-07`](https://github.com/json-schema-org/json-schema-spec/tree/draft-07).

## Quickstarts

- [JavaScript / TypeScript](#javascript--typescript-quickstart)
- [Node.js](#nodejs-quickstart)
- [Android](#android-quickstart)
- [iOS](#ios-quickstart)

### JavaScript / TypeScript Quickstart

First, generate a Typewriter client from [your schema](#json-schema-setup):

```sh
$ typewriter gen-js \
  --inputPath ./schema.json \
  --outputPath ./generated \
  --declarations ts
```

> By default, the JavaScript client is generated as ES6.  To customize the language target (and module format), use the `--target` and `--module` flags (run `typewriter gen-js --help` to see all available module formats and target syntaxes)

<!-- TODO: Add table walking through the target/module flags. -->

Then, import [`analytics.js`](https://segment.com/docs/sources/website/analytics.js/quickstart/) and the generated Typewriter client to start making type-safe calls!

```javascript
import TypewriterAnalytics from './generated'

// Pass in your analytics.js instance to Typewriter
const analytics = new TypewriterAnalytics(analyticsJS)

analytics.viewedTypewriter({
  profile_id: '1234'
})
```

To see a full working example, see the [JavaScript example here](./examples/gen-js/js) or the [TypeScript example here](./examples/gen-js/ts).

We recommend that you add client generation as a `package.json` command:

```json
// package.json
{
  "scripts": {
    "typewriter": "typewriter gen-js --inputPath ./schema.json --outputPath ./generated"
  }
}
```

### Node.js Quickstart

First, generate a Typewriter client from [your schema](#json-schema-setup):

```sh
$ typewriter gen-js \
  --inputPath ./schema.json \
  --outputPath ./generated \
  --client node \
  --target "ES2017" \
  --module "CommonJS" \
  --declarations ts
```

Then, import [`analytics-node`](https://segment.com/docs/sources/server/node/quickstart/) and the generated Typewriter client to start making type-safe calls!

```javascript
const TypewriterAnalytics = require('./generated')

// Pass in your analytics-node instance to Typewriter
const analytics = new TypewriterAnalytics(analyticsNode)

analytics.viewedTypewriter({
  properties: {
    user_id: '1234'
  }
})
```

To see a full working example, see the [Node.js example here](./examples/gen-js/node).

We recommend that you add client generation as a [`package.json` command](#javascript--typescript-quickstart).

### Android Quickstart

First, generate a Typewriter client from [your schema](#json-schema-setup):

```sh
$ typewriter gen-android \
  --inputPath ./schema.json \
  --outputPath ./generated \
  --language "java"
```

Then, configure a new [`analytics-android`](https://segment.com/docs/sources/mobile/android/quickstart/) instance:

```java
import com.segment.analytics.Analytics;
// Your generated Typewriter client
import com.segment.analytics.KicksAppAnalytics;

// ...

Analytics analytics = new Analytics.Builder(this, SEGMENT_WRITE_KEY)
        .trackApplicationLifecycleEvents()
        .recordScreenViews()
        .build();
this.kicksAppAnalytics = new KicksAppAnalytics(analytics);
```

Finally, start making type-safe calls!

```java
OrderCompleted order = new OrderCompleted.Builder()
        .currency("USD")
        .orderID(UUID.randomUUID().toString())
        .total(13.37)
        .build();

this.kicksAppAnalytics.orderCompleted(order);
```

To see a full working example, see the [Android Java example here](./examples/gen-android/java).

<!-- TODO: Add a recommendation on how to run Typewriter in an Android build environment. -->
<!-- TODO: Add a recommendation on how to run Typewriter in a Kotlin environment. -->

### iOS Quickstart

First, generate a Typewriter client from [your schema](#json-schema-setup):

```sh
$ typewriter gen-ios \
  --inputPath ./schema.json \
  --outputPath ./generated \
  --language "objectivec"
```

Then, configure a new [`analytics-ios`](https://segment.com/docs/sources/mobile/ios/quickstart/) instance:

```objectivec
#import <Analytics/SEGAnalytics.h>
// Your generated Typewriter client
#import "Analytics/SEGKicksAppAnalytics.h"

// ...

self.kicksAppAnalytics = [[SEGKicksAppAnalytics alloc] initWithAnalytics:[SEGAnalytics sharedAnalytics]];
```

Finally, start making type-safe calls!

```objectivec
SEGOrderCompleted *order = [SEGOrderCompletedBuilder initWithBlock:^(SEGOrderCompletedBuilder *builder) {
    builder.currency = @"USD";
    builder.orderID = [[NSUUID UUID] UUIDString];
    builder.total = productPrice;
}];
[self.kicksAppAnalytics orderCompleted:order];
```

To see a full working example, see the [iOS Objective C example here](./examples/gen-ios/objectivec).

<!-- TODO: Add a recommendation on how to run Typewriter in an iOS build environment. -->
<!-- TODO: Add a recommendation on how to run Typewriter in a Swift environment. -->

## Protocols Customers

If you use [Segment Protocols](https://segment.com/product/protocols), you can automatically generate clients from your Tracking Plan for any supported language.

To do so, you'll need your workspace slug and Tracking Plan id. You can find both in the URL when viewing your Tracking Plan: `https://app.segment.com/<WORKSPACE_SLUG>/protocols/tracking-plans/<TRACKING_PLAN_ID>`

1) First, you'll want to generate a personal API token:

```sh
$ USER=me@example.com
$ PASS=foobar
$ WORKSPACE_SLUG=your_slug

$ curl \
  -d "{'access_token': {'description': 'Typewriter Personal Access Token', 'scopes': 'workspace:read', 'workspaceNames': [ 'workspaces/${WORKSPACE_SLUG}' ] }}" \
  -u "$USER:$PASS" \
  https://platform.segmentapis.com/v1beta/access-tokens
```

2) Then, you can download a Tracking Plan with the `sync` command:

```sh
$ TRACKING_PLAN_ID=rs_foobar
$ PERSONAL_ACCESS_TOKEN=1234.4321
$ WORKSPACE_SLUG=your_slug

$ typewriter sync \
  --trackingPlanId ${TRACKING_PLAN_ID} \
  --token ${PERSONAL_ACCESS_TOKEN} \
  --workspaceSlug ${WORKSPACE_SLUG} \
  --outputPath ./generated/tracking-plan.json
```

3) Great! You're now setup to follow any of the [quickstarts above](#quickstarts)!

## Contributing

- To submit a bug report or feature request, [file an issue here](issues).
- To develop on Typewriter or propose a new language, see [CONTRIBUTING.md](./.github/CONTRIBUTING.md).
