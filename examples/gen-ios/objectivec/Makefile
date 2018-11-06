.DEFAULT_GOAL: typewriter-local

ROOT_PATH := ../../..
LOCAL_INPUT_PATH := ${ROOT_PATH}/examples/local-tracking-plans/tracking-plan.json
OUTPUT_PATH := TypewriterExample/Analytics

.PHONY: build
build:
	@echo "Building Typewriter..."
	@cd ${ROOT_PATH} && yarn build

.PHONY: typewriter-remote
typewriter-remote:
	@echo "Generating Typewriter iOS Objective-C client..."
	@rm -rf ${OUTPUT_PATH}
	@mkdir -p ${OUTPUT_PATH}
	@node ${ROOT_PATH}/dist/src/index.js gen-ios \
		--trackingPlanId "rs_1AnzsusuSkTIlWw7Pq7MCcmVeo2" \
    --workspaceSlug "schema-test" \
		--token "${SEGMENT_SCHEMA_TEST_READ_ONLY_API_TOKEN}" \
		--outputPath ${OUTPUT_PATH} \
		--language 'objectivec' \
		--trackingPlan 'Kicks App'
	@echo "Done."

.PHONY: typewriter-local
typewriter-local:
	@echo "Generating Typewriter iOS Objective-C client..."
	@rm -rf ${OUTPUT_PATH}
	@mkdir -p ${OUTPUT_PATH}
	@node ${ROOT_PATH}/dist/src/index.js gen-ios \
		--inputPath ${LOCAL_INPUT_PATH} \
		--outputPath ${OUTPUT_PATH} \
		--language 'objectivec' \
		--trackingPlan 'Kicks App'
	@echo "Done."
