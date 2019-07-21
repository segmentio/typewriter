# Thanks for taking the time to contribute to Typewriter!

This doc provides a walkthrough of developing on, and contributing to, Typewriter.

Please see our [issue template](ISSUE_TEMPLATE.md) for issues specifically.

## Issues, Bugfixes and New Language Support

Have an idea for improving Typewriter? [Submit an issue first](https://github.com/segmentio/typewriter/issues/new), and we'll be happy to help you scope it out and make sure it is a good fit for Typewriter.

## Developing on Typewriter

### Adding a New Language Target

> Before working towards adding a new language target, please [open an issue on GitHub](https://github.com/segmentio/typewriter/issues/new) that walks through your proposal for the new language support. See the [issue template](ISSUE_TEMPLATE.md) for details.

### Build and run locally

```sh
# Install dependencies
$ yarn
# Test your Typewriter installation by regenerating Typewriter's typewriter client.
$ yarn dev build
```

### Running Tests

```sh
$ yarn test
```

### Deploying

You can deploy a new version to [`npm`](https://www.npmjs.com/package/typewriter) by running:

```
$ yarn release
```
