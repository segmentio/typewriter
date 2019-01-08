## [5.0.2](https://github.com/segmentio/typewriter/compare/5.0.1...5.0.2) (2019-01-08)


### Bug Fixes

* add integrations to node.js and support the AppsFlyer exception [SCH-1407] ([#39](https://github.com/segmentio/typewriter/issues/39)) ([a5819f5](https://github.com/segmentio/typewriter/commit/a5819f5))



## [5.0.1](https://github.com/segmentio/typewriter/compare/5.0.0...5.0.1) (2018-12-05)


### Bug Fixes

* upgrade quicktype ([#34](https://github.com/segmentio/typewriter/issues/34)) ([b01ee0e](https://github.com/segmentio/typewriter/commit/b01ee0e))



# [5.0.0](https://github.com/segmentio/typewriter/compare/4.0.0...5.0.0) (2018-11-21)


### Bug Fixes

* crash in Android example on back button ([#33](https://github.com/segmentio/typewriter/issues/33)) ([e60649c](https://github.com/segmentio/typewriter/commit/e60649c))


### Features

* add flag to disable run-time validation for gen-js ([#32](https://github.com/segmentio/typewriter/issues/32)) ([69a507e](https://github.com/segmentio/typewriter/commit/69a507e))


### BREAKING CHANGES

* the run-time flag, `options.propertyValidation`, which previously could be used to disable validation at run-time, has been removed. It's recommended that you use the build-time flag instead.



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



