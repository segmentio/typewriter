# typewriter

This branch represents a POC for refactoring Typewriter for ease-of-use and ease-of-development.

For Segmenters: https://paper.dropbox.com/doc/Refactoring-Typewriter-FtUl1rmfXyuoVcI8uS5yM

## Current State

This is currently a POC that refactors the TypeScript generator to use a custom JSON Schema AST.

## JSON Schema Support

JSON Schema is a large spec, but Typewriter aims to support just the subset of JSON Schema that is relevant code generation across multiple languages:

- Field Types: `string`, `integer`, `number`, `boolean`, `any`, `array`, `object`
- Union Types
- Enums: `enum`/`const`
- Required vs. optional `object` properties
- `null`-able fields
- Descriptions
- Nested objects and arrays

It also aims to handle:
- language-specific name sanitization
- name conflicts from loading `N` schemas
- shared interfaces, when identical

The following JSON Schema constructs cannot be reliably code-gened into compile-time types, so we don't plan to support them:
- combined schemas: `oneOf`, `anyOf`, `allOf`, `not`
- various type-specific vields:
  - `string`: `length`, `pattern`, `format`
  - `integer`/`number`: `multipleOf`, `minimum`/`exclusiveMinimum`/`maximum`/`exclusiveMaximum`
  - `object`: `additionalProperties`, `propertyNames`, `minProperties`, `maxProperties`, `dependencies`, `patternProperties`
  - `array`: `contains`, tuple validation, `additionalItems`, `minItems`, `maxItems`, `uniqueItems`
- media encodings: `contentMediaType`, `contentEncoding`
- conditional schemas: `if`/`then`/`else`

We could explore supporting the following JSON Schema constructs in the future:
- annotations: `default` (default values) and `examples` (documentation of example values)
- definitions and references: `definitions`, `$ref`

However, Typewriter will still perform full JSON Schema validation at run-time, so you can catch these errors using unit tests.
