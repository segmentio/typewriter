.DEFAULT_GOAL: typewriter

ROOT_PATH := ../../..
LOCAL_INPUT_PATH := ${ROOT_PATH}/examples/local-tracking-plans/tracking-plan.json
OUTPUT_PATH := TypewriterExample/Analytics

.PHONY: build
build:
	@echo "Building Typewriter..."
	@cd ${ROOT_PATH} && yarn build

.PHONY: typewriter
typewriter:
	@echo "Generating Typewriter iOS Objective-C client..."
	@rm -rf ${OUTPUT_PATH}
	@mkdir -p ${OUTPUT_PATH}

	@node ${ROOT_PATH}/dist/src/index.js gen-ios \
		--inputPath ${LOCAL_INPUT_PATH} \
		--outputPath ${OUTPUT_PATH} \
		--language 'objectivec' \
		--trackingPlan 'Kicks App'

	@echo "Done."
