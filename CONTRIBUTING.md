# Thanks for taking the time to contribute to Typewriter!

This doc provides a walkthrough of developing on, and contributing to, Typewriter.

Please see our [issue template](ISSUE_TEMPLATE.md) for issues specifically.

## Issues, Bugfixes and New Language Support

Have an idea for improving Typewriter? [Submit an issue first](https://github.com/segmentio/typewriter/issues/new), and we'll be happy to help you scope it out and make sure it is a good fit for Typewriter.

## Developing on Typewriter

Typewriter is written using [OCLIF](https://oclif.io).

### Build and run locally

```sh
# Install dependencies
$ yarn
# Test your Typewriter installation by regenerating Typewriter's typewriter client.
$ yarn build
# Develop and test using OCLIFs dev runner to test any of your changes without transpiling
# This will build Typewriter's own TrackingPlan (src/telemetry/plan.json) with the root dir configuration (typewriter.yml)
$ ./bin/dev build -m prod -u
# You can run any command and debug locally using the `bin/dev` command:
$ mkdir myOwnClient && cd myOwnClient
$ ../bin/dev init # To initialize a new TW client
$ ../bind/dev build # To build this client
```

### Running Tests

Running the integration tests are heavily recommended for local development as they do not mess up with local clients nor you have to run the initialization wizard and setup a test account/tracking plan.

The tests run against all combinations of SDKs and Languages supported with a large TrackingPlan that contains complex values. They are snapshot tests that check against the expected output

```sh
$ yarn test # Run all tests
$ yarn test --updateSnapshot # Update the snapshots automatically after making a change in outputs
```

The Tracking Plan and configuration used in tests is contained in `test/env`

The output is written to `test-env` under specific directories for each language, SDK and build mode.

### Deploying

You can deploy a new version to [`npm`](https://www.npmjs.com/package/typewriter) by running:

```
$ yarn release
```

### Adding a New Language Target

> Before working towards adding a new language target, please [open an issue on GitHub](https://github.com/segmentio/typewriter/issues/new) that walks through your proposal for the new language support. See the [issue template](ISSUE_TEMPLATE.md) for details.

All languages are just objects that implement the [`LanguageGenerator`](src/languages/types.ts) interface. We have a [quick an easy way](#using-quicktype) to use [Handlebars](http://handlebarsjs.com/) and [Quicktype](quicktype.io) which should cover most of the scenarios but you can always write your own [renderer](#using-a-custom-renderer).

#### Using QuickType

We have to start by creating the Quicktype required classes: a `Renderer` and a `TargetLanguage`

We will start with the renderer. The `Renderer` is the class in Quicktype that outputs text to the files. We can customize the quicktype output here, and if you need to do more complex outputs you can check [Customize Quicktype Output](#customizing-quicktypes-output). For now we will stick to the basics and use the default handlebars renderer. Most scenarios will only need this.

To create a renderer extend the appropiate renderer class of your Language. For Swift for example that is `SwiftRenderer`. We will add a `constructor` with some custom parameters we need and override a few functions. This is pretty much boilerplate code:

```ts
import {
  Name,
  RenderContext,
  SwiftRenderer,
  SwiftTargetLanguage,
  TargetLanguage,
  Type,
} from "quicktype-core";
import { OptionValues } from "quicktype-core/dist/RendererOptions";
import { camelCase } from "quicktype-core/dist/support/Strings";
import {
  emitMultiline,
  executeRenderPlan,
  makeNameForTopLevelWithPrefixAndSuffix,
} from "./quicktype-utils";

// We extend the Quicktype renderer for the language we will output, SwiftRenderer here for Swift
class TypewriterSwiftRenderer extends SwiftRenderer {
  // Implement our own constructor to add our typewriterOptions
  constructor(
    targetLanguage: TargetLanguage,
    renderContext: RenderContext,
    typescriptOptions: OptionValues<any>,
    protected readonly typewriterOptions: QuicktypeTypewriterSettings
  ) {
    super(targetLanguage, renderContext, typescriptOptions);
  }

  // Override emitMultiline, this way you can customize the indentation size of your template files
  emitMultiline(linesString: string) {
    emitMultiline(this, linesString, 4); // Replace 4 with your indentation size
  }

  // Override emitSource, this is the function that actually outputs code to the files. If you need to customize or prefer to output stuff through Quicktype this is the place!
  emitSource(givenOutputFilename: string): void {
    super.emitSource(givenOutputFilename);
    // executeRenderPlan will render code from the handlebars templates,
    executeRenderPlan(this, this.typewriterOptions.generators);
  }

  // Override makeNameForTopLevel, this is the function that defines the names for our top level classes, the events in our case. We add custom prefixes and suffixes support through this!
  makeNameForTopLevel(
    t: Type,
    givenName: string,
    maybeNamedType: Type | undefined
  ): Name {
    return makeNameForTopLevelWithPrefixAndSuffix(
      // This is important, we do this to bind `this` as the internal Quicktype implementation relies on it
      (...args) => {
        return super.makeNameForTopLevel(...args);
      },
      this.typewriterOptions,
      t,
      givenName,
      maybeNamedType
    );
  }
}
```

Now it's time to create our own `TargetLanguage`. Again this is just boilerplate, we will just extend the appropiate Quicktype language class and make it use our own renderer:

```ts
// We extend the TargetLanguage class for the language we will output, here for Swift
class TypewriterSwiftLanguage extends SwiftTargetLanguage {
  // override the constructor to receive our typewriter options
  constructor(
    protected readonly typewriterOptions: QuicktypeTypewriterSettings
  ) {
    super();
  }

  // override the makeRenderer to use the Renderer class we defined before
  protected makeRenderer(
    renderContext: RenderContext,
    untypedOptionValues: { [name: string]: any }
  ): TypewriterSwiftRenderer {
    return new TypewriterSwiftRenderer(
      this,
      renderContext,
      // This part is somewhat tricky, `swiftOptions` is an object defined quicktype-core each languague has its own object, it is a good idea to take a peek at quicktype to figure out what's its name. f.e. https://github.com/quicktype/quicktype/blob/b481ea541c93b7e3ca01aaa65d4ec72492fdf699/src/quicktype-core/language/Swift.ts#L48
      getOptionValues(swiftOptions, untypedOptionValues),
      this.typewriterOptions
    );
  }
}
```

We are done with Quicktype's boilerplate code. Let's get to our actual implementation. We will start by creating our code template. This is a Handlebars file inside `languages/templates` to which we pass in several variables:

- `version` -> Typewriter Version number
- `type` -> array of all the types generated for the tracking plan
  - `functionName` -> the type's function name
  - `eventName` -> event name
  - `typeName` -> event's generated type name

A simple template will look like this, iterating over all the types and outputing the functions for each one of them:

```hbs
import Segment extension Analytics {
{{#type}}
  func
  {{functionName}}(properties:
  {{typeName}}) { self.track(event: "{{eventName}}", properties: properties) }
{{/type}}
}
```

Time to wrap it up, as we mentioned each language generator just needs to implement [`LanguageGenerator`](src/languages/types.ts) as we mentioned, but you don't have to manually implement the properties with quicktype. We can use [`createQuicktypeLanguageGenerator`](src/languages/quicktype-utils.ts) to create a generator for us with all the pieces:

```ts
export const swift = createQuicktypeLanguageGenerator({
  name: "swift",
  // We pass in the class we created before for our language
  quicktypeLanguage: TypewriterSwiftLanguage,
  // We define in this array the SDKs we support and where the templates for each one are located
  supportedSDKs: [
    {
      name: "Analytics.Swift",
      id: "swift",
      templatePath: "templates/swift/analytics.hbs",
    },
    // You can also define an empty SDK for generating types without additional code
    {
      name: "None (Types and validation only)",
      id: "none",
    },
  ],
  // We pass in any default values for the options
  defaultOptions: {
    "just-types": true,
  },
  // You can also add unsupported options for quicktype, that way they won't show up during configuration nor let the user set them in the config file
  unsupportedOptions: ["framework"],
  // Customize here how your functionNames and typeNames should look like,
  nameModifiers: {
    functionName: camelCase,
  },
});
```

Finally let's add the language to the supported languages so that it shows up during the config wizard and it gets generated during build: add your exported language to the package exports `src/languages/index.ts`:

```ts
export { swift } from "./swift";
```

In `src/hooks/prerun/load-languages.ts` add this instance:

```ts
import { Hook } from "@oclif/core";
import { kotlin, supportedLanguages, swift, typescript } from "../../languages";

const hook: Hook<"init"> = async function (opts) {
  // We inject any new languages plugins might support here
  supportedLanguages.push(swift, kotlin, typescript);
};

export default hook;
```

##### Customizing Quicktype's output

If you need to do something more specific with Quicktype's rendering the `Renderer` is the right place to start. For example if we want to specify exactly the order of the emitted output we can override the `emitSourceStructure`, most of this code is taken verbatim from `TypescriptRenderer` but we add the `emitAnalytics` there to inject our analytics stuff:

```ts
  protected emitSourceStructure() {
    if (this.leadingComments !== undefined) {
      this.emitCommentLines(this.leadingComments);
    } else {
      this.emitUsageComments();
    }
    this.emitTypes();
    this.emitConvertModule();
    this.emitConvertModuleHelpers();
    executeRenderPlan(this, this.typewriterOptions.generators, {
      functionName: camelCase,
      typeName: pascalCase,
    });
    this.emitModuleExports();
  }
```

In `Quicktype` each `Renderer` might have custom functions to emit parts of the generated types. It is always a good idea to take a peek at the available methods in the class you're extending.

`ConvenienceRenderer` is a superclass that all renderers inherit and has most of the basic functionality you will need. Some pretty handy functions are:

- `emitMultiline`: outputs a code block with the right indentation
- `emitLine`: will output a single line to the file
- `forEachTopLevel` iterates over each of the top level types
- `changeIndent` to modify indentation levels
- `ensureBlankLine` to add empty lines
- `emitLineOnce` ensures that a line is only output once at most per file. This is very handy for imports.

If you want to dive deeper into the quicktype renderers, Quicktype has a [good guide](https://blog.quicktype.io/customizing-quicktype/) on how to extend them.

It's also handy to peek at the Quicktype code files for more ideas:

- [ConvenienceRenderer](https://github.com/quicktype/quicktype/blob/master/src/quicktype-core/ConvenienceRenderer.ts)
- [Renderer](https://github.com/quicktype/quicktype/blob/master/src/quicktype-core/ConvenienceRenderer.ts)
- [SwiftRenderer](https://github.com/quicktype/quicktype/blob/master/src/quicktype-core/language/Swift.ts)
- [TypescriptRenderer](https://github.com/quicktype/quicktype/blob/2543fa55d0d3208bbb0feb8377cecee69e721caa/src/quicktype-core/language/TypeScriptFlow.ts)

#### Using a custom renderer

If your use case is complex or QuickType doesn't support your language you can create your own language from scratch. You only need to implement the interface for `LanguageGenerator`:

```ts
export interface LanguageGenerator {
  /**
   * Language ID
   */
  id: string;
  /**
   * Language User-Friendly Name
   */
  name: string;
  /**
   * File extension
   */
  extension: string;
  /**
   * Options for the language generation.
   * They are passed in an inquirer.js (https://github.com/SBoudrias/Inquirer.js) friendly version to be asked during configuration
   */
  options?: QuestionCollection;
  /**
   * Key-value pairs of supported SDKs by the language generator.
   * Key is the user friendly string
   * Value is used in the configuration
   */
  supportedSDKs: {
    [key: string]: string;
  };
  /**
   * Generates code from a set of Segment Protocol Rules
   * @param rules Segment PublicAPI rules object
   * @param options header, sdk and additional renderer options (optional)
   * @returns generated code as string
   */
  generate: (
    rules: SegmentAPI.RuleMetadata[],
    options: GeneratorOptions
  ) => Promise<string>;
}
```

A good example is the [`javascript`](src/languages/javascript.ts) generator, which just wraps the typescript generator and compiles to TS according to its own custom options.
