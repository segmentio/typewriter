# typewriter [![CircleCI][circle-badge]][circle-link] [![npm-version][npm-badge]][npm-link] [![license][license-badge]][license-link]

A compiler for generating strongly-typed analytics clients from JSON Schema

Supported Languages:

- [JavaScript](./examples/js)
- [TypeScript](./examples/ts)
- [Android](./examples/android/java)
- [iOS](./examples/ios/objectivec)

<p align="center">
  <img src=".github/assets/readme-example.gif" alt="Typewriter GIF Example" width="90%"/>
</p>

## Install

- Yarn: `yarn add -D typewriter`

## Usage

```sh
$ typewriter --help
typewriter <command>

Commands:
  typewriter gen-android  Generate a strongly typed analytics-android client
  typewriter gen-ios      Generate a strongly typed analytics-ios client
  typewriter gen-js       Generate a strongly typed JavaScript analytics.js client
  typewriter gen-ts       Generate a strongly typed TypeScript analytics.js client

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

### Javascript Example

First, generate a Typewriter client from a local JSON schema:

```sh
$ typewriter gen-js \
  --inputPath ./schema.json \
  --outputPath ./generated
```

> By default, the output client is generated as ES6.  To customize the language target (and module format), use the `--target` and `--module` flags (run `typewriter gen-js --help` to see all available module formats and target syntaxes)

Then, import [`analytics.js`](https://segment.com/docs/sources/website/analytics.js/quickstart/) and the generated Typewriter client and start making type-secure calls!

```javascript
import * as analytics from './generated'

// ...

analytics.feedViewed({
  profileId: '3'
})
```

To see full working examples, including other languages such as [Typescript](./examples/ts), [Android](./examples/android/java), [iOS](./examples/ios/objectivec), see the [examples directory](./examples).

### Protocols Usage

If you use [Segment Protocols](https://segment.com/product/protocols), you can automatically generate clients from your Tracking Plan:

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
