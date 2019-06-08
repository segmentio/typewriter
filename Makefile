# Test launches our end-to-end integration testing for each client library. 
test:
	@### Boot the sidecar API to capture API requests.
	@make docker

	@### JavaScript browser
	@# TODO

	@### TypeScript browser
	@# TODO

	@### JavaScript node
	@make test-javascript-node	

	@### TypeScript node
	@make test-typescript-node

test-javascript-node:
	@echo "\n>>>	🏃 Running JavaScript Node client test suite...\n"
	@yarn run -s dev --config=./tests/e2e/javascript-node
	@cd tests/e2e/javascript-node && \
		yarn && \
		yarn run -s test

test-typescript-node:
	@echo "\n>>>	🏃 Running TypeScript Node client test suite...\n"
	@yarn run -s dev --config=./tests/e2e/typescript-node
	@cd tests/e2e/typescript-node && \
		yarn && \
		yarn run -s test

test-ios:
	@echo "\n>>>	🏃 Running iOS client test suite...\n"
	@yarn run -s dev --config=./tests/e2e/ios
	@cd tests/e2e/ios && \
		pod install && \
		xcodebuild \
			-workspace TypewriterExample.xcworkspace \
			-scheme TypewriterExampleTests \
			-sdk iphonesimulator \
			-destination 'platform=iOS Simulator,name=iPhone Xʀ,OS=12.2' \
			test

docker:
	@docker-compose -f tests/e2e/docker-compose.yml up -d
	@# Make sure the snapshotter is available and all messages have been cleared from any previous tests:
	@sleep 3
	@curl -f "http://localhost:8765/messages" > /dev/null 2>&1

teardown:
	@docker-compose -f tests/e2e/docker-compose.yml down

# Update updates all e2e tests to use the latest "Typewriter E2E Tracking Plan"
update:
	@yarn dev --config=tests/e2e/javascript-node update
