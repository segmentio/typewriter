DESTINATION ?= "platform=iOS Simulator,name=iPhone X"
XC_OBJECTIVE_C_ARGS := -workspace TypewriterExample.xcworkspace -scheme TypewriterExample -destination $(DESTINATION)
XC_SWIFT_ARGS := -workspace TypewriterSwiftExample.xcworkspace -scheme TypewriterSwiftExample -destination $(DESTINATION)

# update: updates typewriter and all e2e tests to use the latest Tracking Plans.
.PHONY: update
update:
	@yarn dev
	@yarn dev --config=example
	@yarn dev --config=tests/e2e/javascript-node
	@yarn dev --config=tests/e2e/typescript-node
	@yarn dev --config=tests/e2e/web-javascript
	@yarn dev --config=tests/e2e/web-typescript
	@yarn dev --config=tests/e2e/ios
	@yarn dev --config=tests/e2e/ios-swift
	@# Changes to the Tracking Plan JSON files will need to be run through our
	@# linter again to reduce git deltas.
	@git add -A && yarn lint-staged

# e2e: launches our end-to-end test for each client library. 
.PHONY: e2e
e2e:
	@### Boot the sidecar API to capture API requests.
	@make docker

	@### Example App
	@make build-example

	@### JavaScript node
	@make test-javascript-node
	@### TypeScript node
	@make test-typescript-node

	@### JavaScript web
	@make test-web-javascript
	@### TypeScript web
	@make test-web-typescript

	@### Objective-C iOS
	@make test-ios
	@### Swift iOS
	@make test-ios-swift

	@### Android
	@# TODO

# docker: launches the sidecar for e2e snapshot testing
.PHONY: docker
docker:
	@docker-compose -f tests/e2e/docker-compose.yml up -d
	@# Make sure the snapshotter is available and all messages have been cleared from any previous tests:
	@sleep 3
	@make clear-snapshotter

.PHONY: clear-snapshotter
clear-snapshotter:
	@curl -f "http://localhost:8765/messages" > /dev/null 2>&1

# teardown: shuts down the sidecar.
.PHONY: teardown
teardown:
	@docker-compose -f tests/e2e/docker-compose.yml down

.PHONY: build-example
build-example:
	@yarn run -s dev build --config=./example && \
		cd example && \
		yarn && \
		yarn build

.PHONY: test-javascript-node
test-javascript-node:
	@echo "\n>>>	🏃 Running JavaScript Node client test suite...\n"
	@make clear-snapshotter && \
		yarn run -s dev build --config=./tests/e2e/javascript-node && \
		cd tests/e2e/javascript-node && \
		yarn && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=javascript IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts
	@make clear-snapshotter && \
		yarn run -s dev prod --config=./tests/e2e/javascript-node && \
		cd tests/e2e/javascript-node && \
		yarn && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=javascript IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-typescript-node
test-typescript-node:
	@echo "\n>>>	🏃 Running TypeScript Node client test suite...\n"
	@make clear-snapshotter && \
		yarn run -s dev build --config=./tests/e2e/typescript-node && \
		cd tests/e2e/typescript-node && \
		yarn && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=typescript IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts
	@make clear-snapshotter && \
		yarn run -s dev prod --config=./tests/e2e/typescript-node && \
		cd tests/e2e/typescript-node && \
		yarn && \
		yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=typescript IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-web-javascript
test-web-javascript:
	@echo "\n>>>	🏃 Running JavaScript analytics.js client test suite...\n"
	@make clear-snapshotter && \
		yarn run -s dev build --config=./tests/e2e/web-javascript && \
		cd tests/e2e/web-javascript && \
		yarn && \
		yarn run -s build && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics.js LANGUAGE=javascript IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts
	@make clear-snapshotter && \
		yarn run -s dev prod --config=./tests/e2e/web-javascript && \
		cd tests/e2e/web-javascript && \
		yarn && \
		yarn run -s build && \
		yarn run -s test && \
		cd ../../.. && \
		SDK=analytics.js LANGUAGE=javascript IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-web-typescript
test-web-typescript:
	@echo "\n>>>	🏃 Running TypeScript analytics.js client test suite...\n"
	@make clear-snapshotter && \
		yarn run -s dev build --config=./tests/e2e/web-typescript && \
		cd tests/e2e/web-typescript && \
		yarn && \
		yarn run -s build && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics.js LANGUAGE=typescript IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts
	@make clear-snapshotter && \
		yarn run -s dev prod --config=./tests/e2e/web-typescript && \
		cd tests/e2e/web-typescript && \
		yarn && \
		yarn run -s build && \
		yarn run -s test && \
		cd ../../.. && \
		SDK=analytics.js LANGUAGE=typescript IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

# We split up test-ios in order for CI to cache the setup step.
.PHONY: test-ios
test-ios: setup-ios-tests run-ios-tests

.PHONY: setup-ios-tests
setup-ios-tests:
	@# TODO: verify that xcodebuild and xcpretty are available
	@cd tests/e2e/ios && \
		pod install

.PHONY: run-ios-tests
run-ios-tests:
	@echo "\n>>>	🏃 Running iOS Objective-C client test suite...\n"
	@make clear-snapshotter && \
		yarn run -s dev build --config=./tests/e2e/ios && \
		cd tests/e2e/ios && \
		set -o pipefail && xcodebuild test $(XC_OBJECTIVE_C_ARGS) | xcpretty && \
		SDK=analytics-ios LANGUAGE=objective-c IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts
	@make clear-snapshotter && \
		yarn run -s dev prod --config=./tests/e2e/ios && \
		cd tests/e2e/ios && \
		set -o pipefail && xcodebuild test $(XC_OBJECTIVE_C_ARGS) | xcpretty && \
		SDK=analytics-ios LANGUAGE=objective-c IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

# We split up test-ios in order for CI to cache the setup step.
.PHONY: test-ios-swift
test-ios-swift: setup-ios-swift-tests run-ios-swift-tests

.PHONY: setup-ios-swift-tests
setup-ios-swift-tests:
	@# TODO: verify that xcodebuild and xcpretty are available
	@cd tests/e2e/ios-swift && \
		pod install

.PHONY: run-ios-swift-tests
run-ios-swift-tests:
	@echo "\n>>>	🏃 Running iOS Swift client test suite...\n"
	@make clear-snapshotter && \
		yarn run -s dev build --config=./tests/e2e/ios-swift && \
		cd tests/e2e/ios-swift && \
		set -o pipefail && xcodebuild test $(XC_SWIFT_ARGS) | xcpretty && \
		SDK=analytics-ios LANGUAGE=swift IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts
	@make clear-snapshotter && \
		yarn run -s dev prod --config=./tests/e2e/ios-swift && \
		cd tests/e2e/ios-swift && \
		set -o pipefail && xcodebuild test $(XC_SWIFT_ARGS) | xcpretty && \
		SDK=analytics-ios LANGUAGE=swift IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts
