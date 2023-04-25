# Type definition "integration" tests for the typescript SDKs

```
npx ts-node src/__tests__/ts-typedef-tests/run.ts
```
These tests confirm:
- That the typescript clients have no type errors
- That the typescript clients typings behaves as expected

Running the tests...
1. Build typescript client using cli
2. Imports that client into a type definition test that asserts that it's typed correctly
3. Type checks both the client (artifact) and the type definition 
