<div align="center" style="margin-bottom: 1px solid #ccc;" >
	<br>
	<br>
  <img src=".github/assets/typewriter-logo.svg" alt="Typewriter logo" />
  <br>
  <br>
  <br>
</div>



<div align="center" margin-top="10px">

[![CircleCI][circle-badge]][circle-link] [![npm-version][npm-badge]][npm-link] [![license][license-badge]][license-link]
</div>


<p align="center">
  <img src=".github/assets/readme-example.gif" alt="Typewriter GIF Example" width="70%"/>
</p>

- **Strongly Typed Analytics**: Generates strongly-typed [Segment](http://segment.com) analytics clients from arbitrary [JSON Schema](http://json-schema.org).

- **Cross-Language Support**: Supports native clients in [JavaScript](#javascript--typescript-quickstart), [TypeScript](#javascript--typescript-quickstart), [Node.js](#nodejs-quickstart), [Android](#android-quickstart) and [iOS](#ios-quickstart).

- **Segment Protocols**: Built-in support to sync your clients with your centralized Tracking Plans.

## Install

```sh
$ yarn add -D typewriter
```

## Validation Warnings

| Language          | Run-Time | Build-Time                     |
|-------------------|----------|--------------------------------|
| [JavaScript](#javascript--typescript-quickstart)        | ✅ Types<br>✅ Naming<br>✅ Required Properties | ❌ Types<br>❌ Naming<br>❌ Required Properties |
| [TypeScript](#javascript--typescript-quickstart)        | ✅ Types<br>✅ Naming<br>✅ Required Properties | ✅ Types<br>✅ Naming<br>✅ Required Properties |
| [Android (Java)](#android-quickstart)    | ✅ Types<br>✅ Naming<br>✅ Required Properties | ✅ Types<br>✅ Naming<br>❌ Required Properties |
| [iOS (Objective C)](#ios-quickstart) | ✅ Types<br>✅ Naming<br>✅ Required Properties | ✅ Types<br>✅ Naming<br>❌ Required Properties |

## JSON Schema Setup

> Using [Segment Protocols](https://segment.com/product/protocols)? We'll generate your clients directly from your Tracking Plans. See the [instructions below](#protocols-customers).

Typewriter supports generating clients from multiple events without collisions, where each event is validated by its own [JSON Schema](http://json-schema.org/). A minimal example might look like:

```json
{
  "events": [
    {
      "name": "Viewed Typewriter",
      "rules": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "context": {
            "id": "/properties/context"
          },
          "traits": {
            "id": "/properties/traits"
          },
          "properties": {
            "type": "object",
            "properties": {
              "user_id": {
                "description": "The user viewing Typewriter",
                "id": "/properties/properties/properties/user_id"
              }
            },
            "id": "/properties/properties"
          }
        },
        "required": ["properties"]
      }
    },
  ]
}
```

Typewriter currently uses JSON Schema [`draft-04`](https://github.com/json-schema-org/json-schema-spec/tree/draft-04).

## Quickstarts

- [JavaScript / TypeScript](#javascript--typescript-quickstart)
- [Node.js](#nodejs-quickstart)
- [Android](#android-quickstart)
- [iOS](#ios-quickstart)

### JavaScript / TypeScript Quickstart

First, generate a Typewriter client from [your schema](#json-schema-setup):

```sh
# For TypeScript, use gen-ts
$ typewriter gen-js \
  --inputPath ./schema.json \
  --outputPath ./generated
```

> By default, the JavaScript client is generated as ES6.  To customize the language target (and module format), use the `--target` and `--module` flags (run `typewriter gen-js --help` to see all available module formats and target syntaxes)
<!-- TODO: Add table walking through the target/module flags. -->

Then, import [`analytics.js`](https://segment.com/docs/sources/website/analytics.js/quickstart/) and the generated Typewriter client to start making type-safe calls!

```javascript
import * as analytics from './generated'

// ...

analytics.feedViewed({
  profileId: '42'
})
```

To see a full working example, see the [JavaScript example here](./examples/js) or the [TypeScript example here](./examples/ts).

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
  --module "CommonJS"
```

Then, import [`analytics-node`](https://segment.com/docs/sources/server/node/quickstart/) and the generated Typewriter client to start making type-safe calls!

```javascript
const analytics = require('./generated')

// ...

analytics.feedViewed({
  properties: {
    profileId: '42'
  }
})
```

To see a full working example, see the [Node.js example here](./examples/node).

We recommend that you add client generation as [a `package.json` command](#javascript--typescript-quickstart).

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

To see a full working example, see the [Android Java example here](./examples/android/java).

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

To see a full working example, see the [iOS Objective C example here](./examples/ios/objectivec).

<!-- TODO: Add a recommendation on how to run Typewriter in an iOS build environment. -->
<!-- TODO: Add a recommendation on how to run Typewriter in a Swift environment. -->

## Protocols Customers

If you use [Segment Protocols](https://segment.com/product/protocols), you can automatically generate clients from your Tracking Plan for any supported language.

You'll need to first generate an API token:
```sh
$ USER=me@example.com
$ PASS=<redacted>

$ curl \
  -d '{"access_token": {"description": "Typewriter Personal Access Token", "scopes": "workspace:read"}}' \
  -u "$USER:$PASS" \
  https://platform.segmentapis.com/v1alpha/access-tokens
{
  "name": "access-tokens/42",
  "description": "Typewriter Personal Access Token",
  "scopes": "workspace:read",
  "create_time": "2018-10-12T22:36:39Z",
  "token": "Pphs79YSWHJZCVF1a1RoFgrHvbRd6ZGhdaJ4uWrMH73.eMgjTcord46orXR7X8oM1p0SBjGGekQudaulGFWyFcY"
}
```

Then, instead of passing an `inputPath`, pass your `trackingPlanId`, `workspaceSlug` and `token`. You find the first two in the URL when viewing your Tracking Plan: `https://app.segment.com/<WORKSPACE_SLUG>/protocols/tracking-plans/<TRACKING_PLAN_ID>`

```sh
$ typewriter gen-js \
  --trackingPlanId [your_tracking_plan_id]
  --workspaceSlug [your_workspace_slug] \
  --token [your_token] \
  --outputPath ./generated
```

Great! You're now setup to follow any of the [quickstarts above](#quickstarts)!

## Contributing

- To submit an issue, bug report, or feature request, [file an issue here](issues).
- To develop on Typewriter, see [CONTRIBUTING.md](./.github/CONTRIBUTING.md).

[circle-badge]: https://circleci.com/gh/segmentio/typewriter.svg?style=svg&circle-token=8c1e734c99bdc08170e12d85af7a371900e33e96
[circle-link]: https://circleci.com/gh/segmentio/typewriter
[npm-badge]: https://img.shields.io/npm/v/typewriter.svg?style=flat-square
[npm-link]: http://www.npmjs.com/package/typewriter
[license-badge]: https://img.shields.io/npm/l/typewriter.svg
[license-link]: ./.github/LICENSE.md
