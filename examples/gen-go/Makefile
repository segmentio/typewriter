DEFAULT_GOAL: run

Q=@

.PHONY: deps
deps:
	$Qdep ensure

.PHONY: clean
clean:
	$Qrm -rf vendor/ && dep ensure

.PHONY: run
run:
	$Qgo run cmd/main.go ${ARGS}

.PHONY: vet
vet:
	$Qgo vet ./...

.PHONY: fmtfix
fmtfix:
	$Qgofmt -w $(shell find . -iname '*.go' | grep -v vendor)

ROOT_PATH := ../..
LOCAL_INPUT_PATH := ${ROOT_PATH}/examples/local-tracking-plans/tracking-plan.json
OUTPUT_PATH := pkg/analytics/generated

.PHONY: build
build:
	$Qecho "Building Typewriter..."
	$Qcd ${ROOT_PATH} && yarn build

.PHONY: typewriter
typewriter:
	$Qecho "Generating Typewriter Golang client..."
	$Qrm -rf ${OUTPUT_PATH}
	$Qmkdir -p ${OUTPUT_PATH}

	$Qnode ${ROOT_PATH}/dist/src/index.js gen-go \
		--inputPath ${LOCAL_INPUT_PATH} \
		--outputPath ${OUTPUT_PATH}

	$Qmake fmtfix

	$Qecho "Done."
