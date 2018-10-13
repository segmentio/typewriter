.DEFAULT_GOAL: typewriter-local

ROOT_PATH := ../../..
LOCAL_INPUT_PATH := ${ROOT_PATH}/examples/local-tracking-plans/tracking-plan-mobile.json
OUTPUT_PATH := TypewriterExample/Analytics
TRACKING_PLAN_ID := rs_1AnzsusuSkTIlWw7Pq7MCcmVeo2

.PHONY: build
build:
	@echo "Building Typewriter..."
	@cd ${ROOT_PATH} && yarn build

.PHONY: typewriter-remote
typewriter-remote: build
	@echo "Generating Typewriter iOS Objective-C client..."
	@rm -rf ${OUTPUT_PATH}
	@mkdir -p ${OUTPUT_PATH}
	@node ${ROOT_PATH}/dist/index.js gen-ios \
		--id "${TRACKING_PLAN_ID}" \
		--token "${SEGMENT_SCHEMA_TEST_READ_ONLY_API_KEY}" \
		--outputPath ${OUTPUT_PATH} \
		--language 'objectivec' \
		--trackingPlan 'Kicks App'
	@echo "Done."

.PHONY: typewriter-local
typewriter-local: build
	@echo "Generating Typewriter iOS Objective-C client..."
	@rm -rf ${OUTPUT_PATH}
	@mkdir -p ${OUTPUT_PATH}
	@node ${ROOT_PATH}/dist/index.js gen-ios \
		--inputPath ${LOCAL_INPUT_PATH} \
		--outputPath ${OUTPUT_PATH} \
		--language 'objectivec' \
		--trackingPlan 'Kicks App'
	@echo "Done."