# typewriter
A compiler for generating strongly typed analytics clients from JSON Schema

[![CircleCI](https://circleci.com/gh/segmentio/typewriter.svg?style=svg&circle-token=8c1e734c99bdc08170e12d85af7a371900e33e96)](https://circleci.com/gh/segmentio/typewriter)

Supported Languages:

- [JavaScript](./examples/js)
- [TypeScript](./examples/ts)
- [Android](./examples/android/java)
- [iOS](./examples/ios/objectivec)
- More coming soon!

## Install

- Yarn: `yarn add -D typewriter`

## Usage

```sh
$ typewriter --help
```

### Javascript Example

First, generate a Typewriter client from a local JSON schema:

```sh
$ typewriter gen-js \
  --inputPath ./schema.json \
  --outputPath ./generated
```

By default, the output client is generated as ES6.  To customize the language target (and module format), use the `--target` and `--module` flags
(run `typewriter gen-js --help` to see all available module formats and target syntaxes)

If you use [Segment Protocols](https://segment.com/product/protocols), you can automatically generate clients from your Tracking Plan:

```sh
$ typewriter gen-js \
  --clientId [your_id] \
  --clientSecret [your_secret] \
  --outputPath ./generated
```

Then, import [`analytics.js`](https://segment.com/docs/sources/website/analytics.js/quickstart/) and the generated Typewriter client and start making type-secure calls!

```javascript
import * as analytics from './generated'

// ...

analytics.feedViewed({
  profileId: '3'
})
```

To see full working examples, including other languages such as [Typescript](./examples/ts), [Android](./examples/android/java), [iOS](./examples/ios/objectivec), see the [examples directory](./examples).

## Contributing

- To submit an issue, bug report, or feature request, [file an issue here](issues).
- To develop on Typewriter, see [CONTRIBUTING.md](./.github/CONTRIBUTING.md).
