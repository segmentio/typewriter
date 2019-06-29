SDK ?= "iphonesimulator"
DESTINATION ?= "platform=iOS Simulator,name=iPhone X"
PROJECT := TypewriterExample
XC_ARGS := -workspace $(PROJECT).xcworkspace -scheme $(PROJECT) -destination $(DESTINATION)

# update: updates typewriter and all e2e tests to use the latest Tracking Plans.
.PHONY: update
update:
	@yarn dev update
	@yarn dev --config=example update
	@yarn dev --config=tests/e2e/javascript-node update
	@yarn dev --config=tests/e2e/typescript-node update
	@yarn dev --config=tests/e2e/ios update

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

	@### JavaScript browser
	@# TODO

	@### TypeScript browser
	@# TODO

	@### iOS
	@make test-ios

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
	@yarn run -s dev --config=./example && \
		cd example && \
		yarn && \
		yarn build

.PHONY: test-javascript-node
test-javascript-node:
	@echo "\n>>>	🏃 Running JavaScript Node client test suite...\n"
	@make clear-snapshotter && \
		yarn run -s dev --config=./tests/e2e/javascript-node && \
		cd tests/e2e/javascript-node && \
		yarn && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=javascript IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts
	@make clear-snapshotter && \
		yarn run -s dev --config=./tests/e2e/javascript-node prod && \
		cd tests/e2e/javascript-node && \
		yarn && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=javascript IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-typescript-node
test-typescript-node:
	@echo "\n>>>	🏃 Running TypeScript Node client test suite...\n"
	@make clear-snapshotter && \
		yarn run -s dev --config=./tests/e2e/typescript-node && \
		cd tests/e2e/typescript-node && \
		yarn && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=typescript IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts
	@make clear-snapshotter && \
		yarn run -s dev --config=./tests/e2e/typescript-node prod && \
		cd tests/e2e/typescript-node && \
		yarn && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=typescript IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

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
	@echo "\n>>>	🏃 Running iOS client test suite...\n"
	@make clear-snapshotter && \
		yarn run -s dev --config=./tests/e2e/ios && \
		cd tests/e2e/ios && \
		set -o pipefail && xcodebuild test $(XC_ARGS) | xcpretty && \
		SDK=analytics-ios LANGUAGE=objective-c IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts
	@make clear-snapshotter && \
		yarn run -s dev --config=./tests/e2e/ios prod && \
		cd tests/e2e/ios && \
		set -o pipefail && xcodebuild test $(XC_ARGS) | xcpretty && \
		SDK=analytics-ios LANGUAGE=objective-c IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: clean
clean:
	@find tests/e2e/ios/TypewriterExample/Analytics/ -type f -not -name 'plan.json' -print0 | xargs -0 -I {} rm {}
