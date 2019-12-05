DESTINATION ?= "platform=iOS Simulator,name=iPhone 11"
XC_OBJECTIVE_C_ARGS := -workspace TypewriterExample.xcworkspace -scheme TypewriterExample -destination $(DESTINATION)
XC_SWIFT_ARGS := -workspace TypewriterSwiftExample.xcworkspace -scheme TypewriterSwiftExample -destination $(DESTINATION)

.PHONY: update build prod bulk
build: COMMAND=build
build: bulk
prod: COMMAND=prod
prod: bulk
update: COMMAND=update
update: bulk
bulk:
	@echo " >> Building typewriter"
	@yarn build
	@echo " >> Running 'typewriter $(COMMAND)' on 'typewriter'"
	@NODE_ENV=development node ./dist/src/cli/index.js $(COMMAND)
	@echo " >> Running 'typewriter $(COMMAND)' on 'example'"
	@NODE_ENV=development node ./dist/src/cli/index.js $(COMMAND) --config=example
	@echo " >> Running 'typewriter $(COMMAND)' on 'tests/e2e/node-javascript'"
	@NODE_ENV=development node ./dist/src/cli/index.js $(COMMAND) --config=tests/e2e/node-javascript
	@echo " >> Running 'typewriter $(COMMAND)' on 'tests/e2e/node-typescript'"
	@NODE_ENV=development node ./dist/src/cli/index.js $(COMMAND) --config=tests/e2e/node-typescript
	@echo " >> Running 'typewriter $(COMMAND)' on 'tests/e2e/web-javascript'"
	@NODE_ENV=development node ./dist/src/cli/index.js $(COMMAND) --config=tests/e2e/web-javascript
	@echo " >> Running 'typewriter $(COMMAND)' on 'tests/e2e/web-typescript'"
	@NODE_ENV=development node ./dist/src/cli/index.js $(COMMAND) --config=tests/e2e/web-typescript
	@echo " >> Running 'typewriter $(COMMAND)' on 'tests/e2e/ios-objc'"
	@NODE_ENV=development node ./dist/src/cli/index.js $(COMMAND) --config=tests/e2e/ios-objc
	@echo " >> Running 'typewriter $(COMMAND)' on 'tests/e2e/ios-swift'"
	@NODE_ENV=development node ./dist/src/cli/index.js $(COMMAND) --config=tests/e2e/ios-swift
	@# Changes to the Tracking Plan JSON files will need to be run through our
	@# linter again to reduce git deltas.
	@make lint

# e2e: launches our end-to-end test for each client library. 
.PHONY: e2e
e2e:
	@### Boot the sidecar API to capture API requests.
	@make docker

	@### Example App
	@make build-example

	@### JavaScript node
	@make test-node-javascript
	@### TypeScript node
	@make test-node-typescript

	@### JavaScript web
	@make test-web-javascript
	@### TypeScript web
	@make test-web-typescript

	@### Objective-C iOS
	@make test-ios-objc
	@### Swift iOS
	@make test-ios-swift

	@### Android
	@# TODO

.PHONY: lint
lint:
	@yarn run eslint --fix 'src/**/*.ts' 'src/**/*.tsx'
	@yarn run -s prettier --write --loglevel warn '**/*.json' '**/*.yml'

# docker: launches segmentio/mock which we use to mock the Segment API for e2e testing.
.PHONY: docker
docker:
	@docker-compose -f tests/e2e/docker-compose.yml up -d
	@while [ "`docker inspect -f {{.State.Health.Status}} e2e_mock_1`" != "healthy" ]; do sleep 1; done
	@make clear-mock

# clear-mock: Clears segmentio/mock to give an e2e test a clean slate.
.PHONY: clear-mock
clear-mock:
	@curl -f "http://localhost:8765/messages" > /dev/null 2>&1 || (echo "Failed to clear segmentio/mock. Is it running? Try 'make docker'"; exit 1)

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

.PHONY: test-node-javascript
test-node-javascript: test-node-javascript-dev test-node-javascript-prod

.PHONY: test-node-javascript-dev
test-node-javascript-dev:
	@echo "\n>>>	🏃 Running dev JavaScript Node client test suite...\n"
	@make clear-mock && \
		yarn run -s dev build --config=./tests/e2e/node-javascript && \
		cd tests/e2e/node-javascript && \
		yarn && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=javascript IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-node-javascript-prod
test-node-javascript-prod:
	@echo "\n>>>	🏃 Running prod JavaScript Node client test suite...\n"
	@make clear-mock && \
		yarn run -s dev prod --config=./tests/e2e/node-javascript && \
		cd tests/e2e/node-javascript && \
		yarn && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=javascript IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-node-typescript
test-node-typescript: test-node-typescript-dev test-node-typescript-prod

.PHONY: test-node-typescript-dev
test-node-typescript-dev:
	@echo "\n>>>	🏃 Running dev TypeScript Node client test suite...\n"
	@make clear-mock && \
		yarn run -s dev build --config=./tests/e2e/node-typescript && \
		cd tests/e2e/node-typescript && \
		yarn && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=typescript IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-node-typescript-prod
test-node-typescript-prod:
	@echo "\n>>>	🏃 Running prod TypeScript Node client test suite...\n"
	@make clear-mock && \
		yarn run -s dev prod --config=./tests/e2e/node-typescript && \
		cd tests/e2e/node-typescript && \
		yarn && \
		yarn run -s test && \
		cd ../../.. && \
		SDK=analytics-node LANGUAGE=typescript IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-web-javascript
test-web-javascript: test-web-javascript-dev test-web-javascript-prod

.PHONY: test-web-javascript-dev
test-web-javascript-dev:
	@echo "\n>>>	🏃 Running dev JavaScript analytics.js client test suite...\n"
	@make clear-mock && \
		yarn run -s dev build --config=./tests/e2e/web-javascript && \
		cd tests/e2e/web-javascript && \
		yarn && \
		yarn run -s build && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics.js LANGUAGE=javascript IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-web-javascript-prod
test-web-javascript-prod:
	@echo "\n>>>	🏃 Running prod JavaScript analytics.js client test suite...\n"
	@make clear-mock && \
		yarn run -s dev prod --config=./tests/e2e/web-javascript && \
		cd tests/e2e/web-javascript && \
		yarn && \
		yarn run -s build && \
		yarn run -s test && \
		cd ../../.. && \
		SDK=analytics.js LANGUAGE=javascript IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-web-typescript
test-web-typescript: test-web-typescript-dev test-web-typescript-prod

.PHONY: test-web-typescript-dev
test-web-typescript-dev:
	@echo "\n>>>	🏃 Running dev TypeScript analytics.js client test suite...\n"
	@make clear-mock && \
		yarn run -s dev build --config=./tests/e2e/web-typescript && \
		cd tests/e2e/web-typescript && \
		yarn && \
		yarn run -s build && \
		NODE_ENV=test yarn run -s test && \
		cd ../../.. && \
		SDK=analytics.js LANGUAGE=typescript IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts
	
.PHONY: test-web-typescript-prod
test-web-typescript-prod:
	@echo "\n>>>	🏃 Running prod TypeScript analytics.js client test suite...\n"
	@make clear-mock && \
		yarn run -s dev prod --config=./tests/e2e/web-typescript && \
		cd tests/e2e/web-typescript && \
		yarn && \
		yarn run -s build && \
		yarn run -s test && \
		cd ../../.. && \
		SDK=analytics.js LANGUAGE=typescript IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-ios-objc
test-ios-objc: test-ios-objc-dev test-ios-objc-prod

.PHONY: test-ios-objc-dev
test-ios-objc-dev:
	@echo "\n>>>	🏃 Running dev iOS Objective-C client test suite...\n"
	@# TODO: verify that xcodebuild and xcpretty are available
	@cd tests/e2e/ios-objc && \
		pod install
	@make clear-mock && \
		yarn run -s dev build --config=./tests/e2e/ios-objc && \
		cd tests/e2e/ios-objc && \
		set -o pipefail && xcodebuild test $(XC_OBJECTIVE_C_ARGS) | xcpretty && \
		SDK=analytics-ios LANGUAGE=objective-c IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-ios-objc-prod
test-ios-objc-prod:
	@echo "\n>>>	🏃 Running prod iOS Objective-C client test suite...\n"
	@# TODO: verify that xcodebuild and xcpretty are available
	@cd tests/e2e/ios-objc && \
		pod install
	@make clear-mock && \
		yarn run -s dev prod --config=./tests/e2e/ios-objc && \
		cd tests/e2e/ios-objc && \
		set -o pipefail && xcodebuild test $(XC_OBJECTIVE_C_ARGS) | xcpretty && \
		SDK=analytics-ios LANGUAGE=objective-c IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-ios-swift
test-ios-swift: test-ios-swift-dev test-ios-swift-prod

.PHONY: test-ios-swift-dev
test-ios-swift-dev:
	@echo "\n>>>	🏃 Running dev iOS Swift client test suite...\n"
	@# TODO: verify that xcodebuild and xcpretty are available
	@cd tests/e2e/ios-swift && \
		pod install
	@make clear-mock && \
		yarn run -s dev build --config=./tests/e2e/ios-swift && \
		cd tests/e2e/ios-swift && \
		set -o pipefail && xcodebuild test $(XC_SWIFT_ARGS) | xcpretty && \
		SDK=analytics-ios LANGUAGE=swift IS_DEVELOPMENT=true yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: test-ios-swift-prod
test-ios-swift-prod:
	@echo "\n>>>	🏃 Running prod iOS Swift client test suite...\n"
	@# TODO: verify that xcodebuild and xcpretty are available
	@cd tests/e2e/ios-swift && \
		pod install
	@make clear-mock && \
		yarn run -s dev prod --config=./tests/e2e/ios-swift && \
		cd tests/e2e/ios-swift && \
		set -o pipefail && xcodebuild test $(XC_SWIFT_ARGS) | xcpretty && \
		SDK=analytics-ios LANGUAGE=swift IS_DEVELOPMENT=false yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: precommit
precommit:
	@make build

	@# Lint the working directory:
	@yarn run lint-staged
