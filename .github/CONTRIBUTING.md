# Thanks for taking the time to contribute to Typewriter!

It is highly appreciated that you take the time to help improve Typewriter.

Please see our [issue template](ISSUE_TEMPLATE.md) for issues specifically.

## Issues, Bugfixes and New Language Support

Have an idea for improving Typewriter? Submit an issue first, and we'll be happy to help
you scope it out and make sure it is a good fit for Typewriter.

## Developing on Typewriter

### Conventions

We follow the [Angular commit guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

### Build and run locally

```sh
$ yarn
$ yarn build

# The build library is now available in ./dist

# Regenerate the JS example to verify Typewriter is installed correctly
$ node ./dist/src/index.js gen-js \
  --inputPath ./examples/local-tracking-plans/tracking-plan-web.json \
  --outputPath ./examples/js/pages/generated
```

### Running Tests

```sh
$ yarn test
```

### Regenerate Example Clients

You can regenerate all [example clients](../examples) by running:

```sh
$ yarn run generate-examples
```

### Adding a New Language Target

1) Create a `gen-{your-lang-here}.ts` file in [`src/commands`](../src/commands) (see existing commands for examples to work from).

2) Export the variables `command` (the name of the command), `desc` (its description), `builder` (an object that captures the parameters your command takes -- in the majority of cases you can just re-export `builder` in [`src/lib/index.ts`](../src/lib/index.ts)) and `handler` (see below).

3) The `handler` export is the function that accepts the user-specified parameters and an object that includes the Tracking Plan events. (Keep in mind that you need to wrap your handler function with `getTypedTrackHandler()` which will supply these to you.) This is where you can extract type information and other metadata from the events and use it to format a data payload that can be renderer out as files.

```typescript
/*
 * gen-go.ts
 */

export const handler = getTypedTrackHandler(
  async (params: Params, { events }) => {
    const codeContent = await genGo(events);
    return writeFile(`${params.outputPath}/index.go`, codeContent);
  }
);
```

A single promise must be returned from the handler. In order to render multiple files, use a `Promise.all()` to concurrently render them to disk:

```typescript
/*
 * gen-node.ts
 */

const readmeContent = `
Welcome to Typewriter Node.js!
`

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

4) Make sure to include an example application in the [`examples/`](../examples) directory that shows how to use your client library.

### Deploying

You can deploy a new version to `npm` by running:

```
$ yarn release
```
