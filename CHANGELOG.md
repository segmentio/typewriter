## [6.1.4](https://github.com/segmentio/typewriter/compare/6.1.3...6.1.4) (2019-06-04)


### Bug Fixes

* **iOS:** assign -> copy for numeric types ([#61](https://github.com/segmentio/typewriter/issues/61)) ([7a2ec99](https://github.com/segmentio/typewriter/commit/7a2ec99))



## [6.1.3](https://github.com/segmentio/typewriter/compare/6.1.2...6.1.3) (2019-03-06)


### Bug Fixes

* handle empty events without compile errors in mobile clients [SCH-1641] ([#56](https://github.com/segmentio/typewriter/issues/56)) ([326e8cc](https://github.com/segmentio/typewriter/commit/326e8cc))
* handle values with multiple types (including null) [SCH-1643] ([#57](https://github.com/segmentio/typewriter/issues/57)) ([6cce0f7](https://github.com/segmentio/typewriter/commit/6cce0f7))



## [6.1.2](https://github.com/segmentio/typewriter/compare/6.1.1...6.1.2) (2019-02-26)



## [6.1.1](https://github.com/segmentio/typewriter/compare/6.1.0...6.1.1) (2019-01-31)


### Bug Fixes

* export analytics options ([#53](https://github.com/segmentio/typewriter/issues/53)) ([2b15c20](https://github.com/segmentio/typewriter/commit/2b15c20))



# [6.1.0](https://github.com/segmentio/typewriter/compare/6.0.0...6.1.0) (2019-01-31)


### Features

* custom error handlers ([#52](https://github.com/segmentio/typewriter/issues/52)) ([7f073d8](https://github.com/segmentio/typewriter/commit/7f073d8))



# [6.0.0](https://github.com/segmentio/typewriter/compare/5.1.8...6.0.0) (2019-01-30)


### Bug Fixes

* javascript clients accepted context rather than options ([#51](https://github.com/segmentio/typewriter/issues/51)) ([5222145](https://github.com/segmentio/typewriter/commit/5222145))


### BREAKING CHANGES

* if you previously passed `context` directly as the final
  parameter to the `analytics.js` or `analytics-node` clients, then you'll
  need to update it, like so:

  If you made a call like:

  ```
  typewriter.thingHappened({ when: 'now' }, { groupId: 123 })
  ```

  Then you would need to update it to:

  ```
  typewriter.thingHappened({ when: 'now' }, {
    context: { groupId: 123 }
  })
  ```

  This allows you to pass `integrations` and other fields in through this
  object, and aligns the TypeScript declarations with the underlying library.



## [5.1.8](https://github.com/segmentio/typewriter/compare/5.1.7...5.1.8) (2019-01-29)


### Bug Fixes

* all SegmentOptions should be optional ([#50](https://github.com/segmentio/typewriter/issues/50)) ([e332779](https://github.com/segmentio/typewriter/commit/e332779))



## [5.1.7](https://github.com/segmentio/typewriter/compare/5.1.6...5.1.7) (2019-01-29)


### Bug Fixes

* location should be optional ([#49](https://github.com/segmentio/typewriter/issues/49)) ([e27cfe8](https://github.com/segmentio/typewriter/commit/e27cfe8))



## [5.1.6](https://github.com/segmentio/typewriter/compare/5.1.5...5.1.6) (2019-01-29)


### Bug Fixes

* include `context` typedef for both node and ajs top levels ([#48](https://github.com/segmentio/typewriter/issues/48)) ([37f88c1](https://github.com/segmentio/typewriter/commit/37f88c1))



## [5.1.5](https://github.com/segmentio/typewriter/compare/5.1.4...5.1.5) (2019-01-29)


### Bug Fixes

* optional message parameter in JS clients ([#47](https://github.com/segmentio/typewriter/issues/47)) ([177069d](https://github.com/segmentio/typewriter/commit/177069d))



## [5.1.4](https://github.com/segmentio/typewriter/compare/5.1.3...5.1.4) (2019-01-25)


### Bug Fixes

* apply strictNullCheck fix in analytics.js client ([#46](https://github.com/segmentio/typewriter/issues/46)) ([fb368f6](https://github.com/segmentio/typewriter/commit/fb368f6)), closes [#43](https://github.com/segmentio/typewriter/issues/43)
* move husky to dev dependencies ([#45](https://github.com/segmentio/typewriter/issues/45)) ([5a6ef07](https://github.com/segmentio/typewriter/commit/5a6ef07))



## [5.1.3](https://github.com/segmentio/typewriter/compare/5.1.2...5.1.3) (2019-01-23)


### Bug Fixes

* update release-it 7 -> 10 ([#44](https://github.com/segmentio/typewriter/issues/44)) ([2706d9f](https://github.com/segmentio/typewriter/commit/2706d9f))



## [5.1.1](https://github.com/segmentio/typewriter/compare/5.1.0...5.1.1) (2019-01-11)


### Bug Fixes

* move typescript to a production dep ([#40](https://github.com/segmentio/typewriter/issues/40)) ([a042b6b](https://github.com/segmentio/typewriter/commit/a042b6b))



# [5.1.0](https://github.com/segmentio/typewriter/compare/5.0.2...5.1.0) (2019-01-08)


### Features

* update Typewriter to support JSON Schema draft-07 [SCH-1381] ([#36](https://github.com/segmentio/typewriter/issues/36)) ([a92628a](https://github.com/segmentio/typewriter/commit/a92628a))



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



