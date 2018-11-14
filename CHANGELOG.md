# [4.0.0](https://github.com/segmentio/typewriter/compare/3.2.5...4.0.0) (2018-11-14)


### Bug Fixes

* hide AJV warnings for gen-js ([#30](https://github.com/segmentio/typewriter/issues/30)) ([6dd6e9e](https://github.com/segmentio/typewriter/commit/6dd6e9e))


### Features

* add changelog ([#29](https://github.com/segmentio/typewriter/issues/29)) ([25463a9](https://github.com/segmentio/typewriter/commit/25463a9))
* add Platform API sync command [SCH-1298] ([#31](https://github.com/segmentio/typewriter/issues/31)) ([c3c9d51](https://github.com/segmentio/typewriter/commit/c3c9d51))
* add TypeScript Declarations [SCH-1235] ([#26](https://github.com/segmentio/typewriter/issues/26)) ([42fdf8e](https://github.com/segmentio/typewriter/commit/42fdf8e))


### BREAKING CHANGES

* The `gen-ts` command has been removed. We no longer generate native `ts` clients, in favor of our JS client with TS declarations. You should now generate the TS client with `typewriter gen-js --declarations=ts`
* Protocols-related flags (`--token`, `--workspaceSlug`, and `--trackingPlanId`) have been removed from the various `gen-*` commands. Users should now use the `sync` command to fetch their Tracking Plans, and the `gen-* --inputPath` flag to generate a client from that local JSON Schema.



