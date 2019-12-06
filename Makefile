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
test-ios-objc:
	@# TODO: verify that xcodebuild and xcpretty are available
	@cd tests/e2e/ios-objc && pod install
	@make test-ios-objc-dev test-ios-objc-prod

.PHONY: test-ios-swift
test-ios-swift:
	@# TODO: verify that xcodebuild and xcpretty are available
	@cd tests/e2e/ios-swift && pod install
	@make test-ios-swift-dev test-ios-swift-prod

.PHONY: test-ios-objc-dev test-ios-objc-prod test-ios-objc-runner test-ios-swift-dev test-ios-swift-prod test-ios-swift-runner test-ios-runner
test-ios-objc-dev: IS_DEVELOPMENT=true
test-ios-objc-dev: TYPEWRITER_COMMAND=build
test-ios-objc-dev: test-ios-objc-runner

test-ios-objc-prod: IS_DEVELOPMENT=false
test-ios-objc-prod: TYPEWRITER_COMMAND=prod
test-ios-objc-prod: test-ios-objc-runner

test-ios-objc-runner: LANGUAGE=objc
test-ios-objc-runner: XC_ARGS=$(XC_OBJECTIVE_C_ARGS)
test-ios-objc-runner: test-ios-runner

test-ios-swift-dev: IS_DEVELOPMENT=true
test-ios-swift-dev: TYPEWRITER_COMMAND=build
test-ios-swift-dev: test-ios-swift-runner

test-ios-swift-prod: IS_DEVELOPMENT=false
test-ios-swift-prod: TYPEWRITER_COMMAND=prod
test-ios-swift-prod: test-ios-swift-runner

test-ios-swift-runner: LANGUAGE=swift
test-ios-swift-runner: XC_ARGS=$(XC_SWIFT_ARGS)
test-ios-swift-runner: test-ios-runner

test-ios-runner:
	@echo "\n>>>	🏃 Running iOS client test suite ($(TYPEWRITER_COMMAND), $(LANGUAGE))...\n"
	@make clear-mock
	@yarn run -s dev $(TYPEWRITER_COMMAND) --config=./tests/e2e/ios-$(LANGUAGE)
	@cd tests/e2e/ios-$(LANGUAGE) && set -o pipefail && xcodebuild test $(XC_ARGS) | xcpretty
	@SDK=analytics-ios LANGUAGE=$(LANGUAGE) IS_DEVELOPMENT=$(IS_DEVELOPMENT) yarn run -s jest ./tests/e2e/suite.test.ts

.PHONY: precommit
precommit:
	@make build

	@# Lint the working directory:
	@yarn run lint-staged

.PHONY: update-bridging-header
update-bridging-header:
	@echo "// Generated Typewriter Headers:" > \
		tests/e2e/ios-swift/TypewriterSwiftExample/TypewriterSwiftExample-Bridging-Header.h
	@ls -l tests/e2e/ios-swift/TypewriterSwiftExample/Analytics | \
		grep '.h$$' | \
		sed -e 's/^.*SEG/#import "Analytics\/SEG/' | \
		sed -e 's/$$/"/' >> \
		tests/e2e/ios-swift/TypewriterSwiftExample/TypewriterSwiftExample-Bridging-Header.h

# Used by CI to run mock on macos executor.
.PHONY: start-mock-bg
start-mock-bg:
	git clone https://github.com/segmentio/mock.git
	cd mock
	yarn
	yarn dev &
	cd ..
	sleep 5
