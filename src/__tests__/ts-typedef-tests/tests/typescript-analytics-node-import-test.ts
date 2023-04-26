import { Analytics } from "@segment/analytics-node";
import typewriter from "../build/typescript-analytics-node";

() => {
  // assert expects a node analytics instance
  typewriter.setTypewriterOptions({
    analytics: new Analytics({ writeKey: "foo" }),
  });

  // @ts-expect-error - should require user ID OR anonId
  typewriter.everyNullableOptionalType({
    properties: { "optional array with properties": [] },
  });

  // should require user ID OR anonId
  typewriter.everyNullableOptionalType({
    userId: "foo",
    properties: { "optional array with properties": [] },
  });

  // should require user ID OR anonId
  typewriter.everyNullableOptionalType({
    anonymousId: "foo",
    properties: { "optional array with properties": [] },
  });

  // @ts-expect-error - should require a properties object
  typewriter.everyNullableOptionalType({
    anonymousId: "foo",
  });

  // assert empty properties
  typewriter.everyNullableOptionalType({
    anonymousId: "foo",
    properties: {},
  });

  // assert context can be passed
  typewriter.everyNullableOptionalType({
    anonymousId: "foo",
    context: {
      traits: {
        age: 99,
      },
      active: true,
    },
    properties: {},
  });
};
