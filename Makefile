# Test launches our end-to-end integration testing for each client library. 
test:
	@# Boot the sidecar API to capture API requests.
	@# TODO

	@### JavaScript browser
	@# TODO

	@### TypeScript browser
	@# TODO

	@### JavaScript node
	make test-javascript-node	

	@### TypeScript node
	@# TODO

test-javascript-node:
	@echo "\n>>>	🏃 Running JavaScript Node client test suite...\n"
	@yarn run -s dev --config=./tests/e2e/javascript-node
	@cd tests/e2e/javascript-node && \
		yarn && \
		yarn run -s test
