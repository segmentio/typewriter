package main

import (
	"fmt"
	"github.com/segmentio/analytics-go"
	"github.com/segmentio/ksuid"
  "github.com/segmentio/typewriter/examples/gen-go/pkg/typewriter/generated"
  "os"
	"strings"
	"time"
)

// https://app.segment.com/schema-test/sources/typewriter_golang_example/overview
var segmentWriteKey = "N9Zfr9UBiG2rTTmyt5tjbue0dqJZUs9z"

func main() {
	if len(os.Args) < 2 {
		fmt.Println("go run cmd/main.go [Product Name]")
		os.Exit(1)
	}
	name := strings.Join(os.Args[1:], " ")

	client, _ := analytics.NewWithConfig(segmentWriteKey, analytics.Config{
		Interval:  30 * time.Second,
		BatchSize: 100,
		Verbose:   true,
	})
	defer client.Close()

	typewriterClient := typewriter.New(client)

	// Standard analytics-go
	err := client.Enqueue(analytics.Track{
		Event:  "Order Completed",
		UserId: "123456",
		Properties: map[string]interface{}{
			"order_id": ksuid.New(),
			"currency": "USD",
			"products": []interface{}{
				map[string]interface{}{
					"brand": "Kicks App",
					"name":  name,
					"price": 9.99,
				},
			},
			"total": 9.99,
		},
	})
	if err != nil {
		fmt.Println("error with analytics-go client:", err)
	}

	// Typewriter
	err = typewriterClient.OrderCompleted(typewriter.TrackOptions{
	  UserId: "123456",
	  Properties: typewriter.OrderCompleted{
	    OrderID: ksuid.New().String(),
	    Currency: typewriter.String("USD"),
	    Products: []typewriter.Product{
	      {
	        Brand: typewriter.String("Kicks App"),
	        Name: &name,
	        Price: typewriter.Float(9.99),
        },
      },
      Total: typewriter.Float(9.99),
    },
  })
  if err != nil {
    fmt.Println("error with typewriter client:", err)
  }
}
