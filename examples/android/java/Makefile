.DEFAULT_GOAL: typewriter-local

ROOT_PATH := ../../..
LOCAL_INPUT_PATH := ${ROOT_PATH}/examples/local-tracking-plans/tracking-plan-mobile.json
OUTPUT_PATH := app/src/main/java/com/segment/analytics

.PHONY: build
build:
	@echo "Building Typewriter..."
	@cd ${ROOT_PATH} && yarn build

.PHONY: typewriter-remote
typewriter-remote: build
	@echo "Generating Typewriter Android Java client..."
	@rm -rf ${OUTPUT_PATH}
	@mkdir -p ${OUTPUT_PATH}
	@node ${ROOT_PATH}/dist/index.js gen-android \
		--trackingPlanId "rs_1AnzsusuSkTIlWw7Pq7MCcmVeo2" \
    --workspaceSlug "schema-test" \
		--token "${SEGMENT_SCHEMA_TEST_READ_ONLY_API_TOKEN}" \
		--outputPath ${OUTPUT_PATH} \
		--package 'com.segment.analytics' \
		--language 'java' \
		--trackingPlan 'Kicks App'
	@echo "Done."

.PHONY: typewriter-local
typewriter-local: build
	@echo "Generating Typewriter Android Java client..."
	@rm -rf ${OUTPUT_PATH}
	@mkdir -p ${OUTPUT_PATH}
	@node ${ROOT_PATH}/dist/index.js gen-android \
		--inputPath ${LOCAL_INPUT_PATH} \
		--outputPath ${OUTPUT_PATH} \
		--package 'com.segment.analytics' \
		--language 'java' \
		--trackingPlan 'Kicks App'
	@echo "Done."
