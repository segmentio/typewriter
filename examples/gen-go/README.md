# Typewriter in Golang

This example repo demonstrates how to setup and use Typewriter in a Golang environment, as a strongly-typed wrapper for [`analytics-go`](https://segment.com/docs/sources/server/go/).

## Setup

Install dependencies:

```
$ make deps
```

Update the Segment write key in [`main.go`](./cmd/main.go#L13) for the source you want to report analytics to:

```go
var segmentWriteKey = "<your Source write key>"
```

Run the program:

```
$ go run cmd/main.go "Test Product"
```

Once you run the program, go to the debugger to see events coming in!

## Typewriter Usage

The generated Typewriter client is available in [`pkg/analytics/generated/main.go`](pkg/typewriter/generated/main.go).

The JSON schema used to generate this client is available in [`local-tracking-plans/tracking-plan.json`](../../local-tracking-plans/tracking-plan.json).

You can regenerate the Typewriter client with `make typewriter`.

## Instrumentation

See [`README.md`](/README.md) for more information on instrumenting your Golang service with Typewriter.
