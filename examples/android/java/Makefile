.DEFAULT_GOAL: typewriter

ROOT_PATH := ../../..
LOCAL_INPUT_PATH := ${ROOT_PATH}/examples/local-tracking-plans/tracking-plan-mobile.json
OUTPUT_PATH := app/src/main/java/com/segment/analytics

.PHONY: build
build:
	@echo "Building Typewriter..."
	@cd ${ROOT_PATH} && yarn build

.PHONY: typewriter
typewriter:
	@echo "Generating Typewriter Android Java client..."
	@rm -rf ${OUTPUT_PATH}
	@mkdir -p ${OUTPUT_PATH}

	@node ${ROOT_PATH}/dist/src/index.js gen-android \
		--inputPath ${LOCAL_INPUT_PATH} \
		--outputPath ${OUTPUT_PATH} \
		--package 'com.segment.analytics' \
		--language 'java' \
		--trackingPlan 'Kicks App'

	@echo "Done."
