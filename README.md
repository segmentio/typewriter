# typewriter [![CircleCI][circle-badge]][circle-link] [![npm-version][npm-badge]][npm-link] [![license][license-badge]][license-link]

<!-- Placeholder for design-team assets -->
<p align="center">
  <img src=".github/assets/readme-example.gif" alt="Typewriter GIF Example" width="70%"/>
</p>

- **Strongly Typed Analytics**: Generates strongly-typed [Segment](http://segment.com) analytics clients from arbitrary [JSON Schema](http://json-schema.org).

- **Cross-Language Support**: Supports native clients in [JavaScript](./examples/js), [TypeScript](./examples/ts), [Android](./examples/android/java) and [iOS](./examples/ios/objectivec).

- **Segment Protocols**: Built-in support to sync your clients with your centralized Tracking Plans.

## Install

```sh
$ yarn add -D typewriter
```

### Validation Warnings

| Language          | Run-Time | Build-Time                     |
|-------------------|----------|--------------------------------|
| JavaScript        | ✅ Types<br>✅ Naming<br>✅ Missing Properties | ❌ Types<br>❌ Naming<br>❌ Missing Properties |
| TypeScript        | ✅ Types<br>✅ Naming<br>✅ Missing Properties | ✅ Types<br>✅ Naming<br>✅ Missing Properties |
| Android (Java)    | ✅ Types<br>✅ Naming<br>✅ Missing Properties | ✅ Types<br>✅ Naming<br>❌ Missing Properties |
| iOS (Objective C) | ✅ Types<br>✅ Naming<br>✅ Missing Properties | ✅ Types<br>✅ Naming<br>❌ Missing Properties |

### Quickstarts

For an example JSON Schema, see

#### JavaScript / TypeScript

First, generate a Typewriter client from a local JSON schema:

```sh
# For TypeScript, use gen-ts
$ typewriter gen-js \
  --inputPath ./schema.json \
  --outputPath ./generated
```

> By default, the JavaScript client is generated as ES6.  To customize the language target (and module format), use the `--target` and `--module` flags (run `typewriter gen-js --help` to see all available module formats and target syntaxes)

Then, import [`analytics.js`](https://segment.com/docs/sources/website/analytics.js/quickstart/) and the generated Typewriter client to start making type-safe calls!

```javascript
import * as analytics from './generated'

// ...

analytics.feedViewed({
  profileId: '42'
})
```

To see a full working example, see the [JavaScript example here](./examples/js) or the [TypeScript example here](./examples/ts).

#### Android

First, generate a Typewriter client from a local JSON schema:

```sh
$ typewriter gen-android \
  --inputPath ./schema.json \
  --outputPath ./generated
```

Then, import [`analytics-android`](https://segment.com/docs/sources/mobile/android/quickstart/) and the generated Typewriter client to start making type-secure calls!

<!-- TODO -->
```java
import * as analytics from './generated'

// ...

analytics.feedViewed({
  profileId: '42'
})
```

To see a full working example, see the [Android Java example here](./examples/android/java).

### Protocols Usage

If you use [Segment Protocols](https://segment.com/product/protocols), you can automatically generate clients from your Tracking Plan for any language:

```sh
$ typewriter gen-js \
  --trackingPlanId [your_tracking_plan_id]
  --workspaceSlug [your_workspace_slug] \
  --token [your_token] \
  --outputPath ./generated
```

## Contributing

- To submit an issue, bug report, or feature request, [file an issue here](issues).
- To develop on Typewriter, see [CONTRIBUTING.md](./.github/CONTRIBUTING.md).

[circle-badge]: https://circleci.com/gh/segmentio/typewriter.svg?style=svg&circle-token=8c1e734c99bdc08170e12d85af7a371900e33e96
[circle-link]: https://circleci.com/gh/segmentio/typewriter
[npm-badge]: https://img.shields.io/npm/v/typewriter.svg?style=flat-square
[npm-link]: http://www.npmjs.com/package/typewriter
[license-badge]: https://img.shields.io/npm/l/typewriter.svg
[license-link]: ./.github/LICENSE.md
