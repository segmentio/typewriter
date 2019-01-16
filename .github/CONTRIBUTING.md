# Thanks for taking the time to contribute to Typewriter!

This doc provides a walkthrough of developing on, and contributing to, Typewriter.

Please see our [issue template](ISSUE_TEMPLATE.md) for issues specifically.

## Issues, Bugfixes and New Language Support

Have an idea for improving Typewriter? [Submit an issue first](https://github.com/segmentio/typewriter/issues/new), and we'll be happy to help
you scope it out and make sure it is a good fit for Typewriter.

## Developing on Typewriter

### Adding a New Language Target

> Before working towards adding a new language target, please [open an issue on GitHub](https://github.com/segmentio/typewriter/issues/new) that walks through your proposal for the new language support. See the [issue template](ISSUE_TEMPLATE.md) for details.

When you are ready to start on a PR:

1) Create a `gen-{your-lang-here}.ts` file in [`src/commands`](../src/commands).

2) Export the following variables to create a new `yargs` command:
- `command`: the name of the command (`gen-js`, `gen-go`, etc.).
- `desc`: the description shown in `typewriter --help`.
- `builder`: an object that captures the parameters your command takes. In the majority of cases, you can just re-export `builder` from [`src/lib/index.ts`](../src/lib/index.ts).
- `handler`: a function that accepts user-specified `params` and Tracking Plan `events`. This is where you can extract type information and other metadata from the `events` and use it compile your Typewriter client, usually with some kind of JSON Schema library (see `Implementing a Typewriter Client Compiler` below).

```typescript
/*
 * gen-go.ts
 */

const genGo = (events: TrackedEvent[]): Promise<string> => {
  // Generate your Typewriter client here.
}

export const handler = getTypedTrackHandler(
  async (params: Params, { events }) => {
    const codeContent = await genGo(events);
    return writeFile(`${params.outputPath}/index.go`, codeContent);
  }
);
```

A single promise must be returned from `handler`. In order to render multiple files, use a `Promise.all()` to concurrently render them to disk:

```typescript
/*
 * gen-node.ts
 */

const readmeContent = `
Welcome to Typewriter Node.js!
`

const genNodeJS = (events: TrackedEvent[], params: Params): Promise<string> => {
  // Generate your Typewriter client here.
}

export const handler = getTypedTrackHandler(async (params: Params, { events }) => {
  const indexJS = await genNodeJS(events, params)

  const packageJSON = `{ ... }`

  return Promise.all([
    writeFile(`${params.outputPath}/index.js`, indexJS),
    writeFile(`${params.outputPath}/package.json`, packageJSON)
    writeFile(`${params.outputPath}/README.md`, readmeContent)
  ])
})
```

3) Implement your compiler, following the instruction under `Implementing a Typewriter Client Compiler` below.

4) Most importantly, make sure to include an example program in the [`examples/`](../examples) directory that shows how to use your client library. You should use the Tracking Plan from [`examples/local-tracking-plans/tracking-plan.json`](../examples/local-tracking-plans/tracking-plan.json).

5) Update the [`tests`](../tests/commands) directory to generate snapshot tests for your new language. Simply add a test file: `commands/gen-{language}/gen-{language}.test.ts` with a snapshot test:

```js
import { genGo } from '../../../src/commands/gen-go'
import { testSnapshotSingleFile } from '../snapshots'

test('genGo - compiled output matches snapshot', async () => {
  await testSnapshotSingleFile(events => genGo(events), 'index.go')
})
```

> If you have any questions, feel free to raise them in the issue for your language proposal. We're happy to help out!

### Implementing a Typewriter Client Compiler

For context, it's useful to have some background on JSON Schema. Here are some great resources:
- [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/)
  - Also: [The Official JSON Schema Spec](https://json-schema.org/specification.html)
- [The Meta Schema](https://github.com/json-schema-org/json-schema-spec/blob/draft-07/schema.json)

At a high-level, a Typewriter client exposes a series of analytics functions, each of which represents a single [`track`](https://segment.com/docs/spec/track/) event. Together, these events form a Tracking Plan and each event has a corresponding JSON Schema. Each of these functions are typed, to provide **build-time validation**, if the underlying language can support it. All functions should support **run-time validation**, since portions of JSON Schema cannot be represented as types (such as regex on strings, for example). Both types of validation are generated using some kind of JSON Schema library, with the former usually generated with [`QuickType`](https://github.com/quicktype/quicktype), while the latter is always a language-specific JSON Schema library ([`AJV.js`](https://github.com/epoberezkin/ajv), [`gojsonschema`](https://github.com/xeipuuv/gojsonschema), etc.).

As an example, TypeScript supports build-time validation through TypeScript declarations ([example](../examples/gen-js/ts/analytics/generated/index.d.ts)) which are compiled using [`QuickType`](https://github.com/quicktype/quicktype). Conversely, JavaScript can only support run-time validation, so we use [`AJV.js`](https://github.com/epoberezkin/ajv) to pre-compile a validation function that executes at run-time ([example](../examples/gen-js/js/analytics/generated/index.js)).

> Note: When performing run-time validation, you can either pre-compile the validation functions (like we do with `AJV.js`), or you can inline/output the JSON Schema, and call out to your JSON Schema library (like we will do with `gojsonschema`). The latter requires a peer dependency at development/test time on your language's JSON Schema library.

> Note: Run-time validation should always respect the `--runtimeValidation` flag so that users can prevent validation issues from throwing errors in production.

> Note: For context, the mobile clients don't (yet) perform runtime validation (they perform build-time validation only). Runtime validation is expected of all new languages.

[`QuickType`](https://github.com/quicktype/quicktype) is primarily used for building typed clients for JSON, so it generates code for JSON serialization (which we don't need). Generally you can disable this with a `Types Only` or `Classes Only` flag. You can test out `QuickType` in their [online editor here](https://app.quicktype.io/) by throwing in one of the [example JSON Schemas](../examples/local-tracking-plans/tracking-plan.json).

The high-level flow for compiling a Typewriter client is as follows:

1. If the language supports types, generate types using `QuickType`. See [`gen-android.ts`](../src/commands/gen-android.ts) or [`gen-js > typescript.ts`](../src/commands/gen-js/typescript.ts) as an example.
2. Generate a function for every event in the Tracking Plan (with typed parameters from #1, if possible). Make sure to normalize the event names (such as `Cart Viewed`) into function names (such as `cartViewed`). Within each function:
    - Generate code to perform run-time JSON Schema validation. See [`gen-js > library.ts`](../src/commands/gen-js/library.ts) as an example.
    - Issue a call to the underlying analytics instance ([`analytics.js`](https://segment.com/docs/sources/website/analytics.js/), [`analytics-go`](https://segment.com/docs/sources/server/go/), etc.).

Since JSON Schema has an extensive spec, we only explicitely support the features that are supported by the Segment Protocols Tracking Plan Editor (and tested in: [`tests/__fixtures__/*`](../tests/__fixtures__/tracking-plan-fixture.json)). We'll be working towards improving support for other JSON Schema features (such as `enums`, `anyOf/oneOf/....`, etc.) in the near future. However, when adding support for a new language, you'll only need to support the features documented in [`tests/__fixtures__/*`](../tests/__fixtures__/tracking-plan-fixture.json), at minimum.

### Build and run locally

```sh
# Install dependencies
$ yarn
# Build the Typewriter CLI
$ yarn build

# Test your Typewriter installation by regenerating the JS example.
$ node ./dist/src/index.js gen-js \
  --inputPath ./examples/local-tracking-plans/tracking-plan-slothgram.json \
  --outputPath ./examples/gen-js/js/analytics/generated
```

### Running Tests

```sh
$ yarn test
```

### Regenerate All Example Clients

You can regenerate all [example clients](../examples) by running:

```sh
$ yarn run generate-examples
```

### Conventions

We follow the [Angular commit guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

### Deploying

You can deploy a new version to [`npm`](https://www.npmjs.com/package/typewriter) by running:

```
$ yarn release
```
