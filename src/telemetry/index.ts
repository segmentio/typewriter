import { Config } from "@oclif/core";
import { Analytics } from "@segment/analytics-node";
import { machineIdSync } from "node-machine-id";
import { TokenMethod, WorkspaceConfig } from "../config";
import typewriterClient, {
  Callback,
  CommandBuildConfig,
  CommandInitConfig,
  TokenType,
  TrackMessage,
} from "./segment";

// Initialize the segment client and the typewriter client with our Write Key for telemetry

const writeKey =
  process.env.NODE_ENV === "production"
    ? // Production: https://app.segment.com/segment_prod/sources/typewriter_next/overview
      "3Q4zXqkF8lcxeMyvfaiEBLhznBrppBWi"
    : // Development: https://app.segment.com/segment_prod/sources/typewriter_next_dev/overview
      "WoCqTlHJKOb9D8NepuSLItTGEkXxLKVV";

const segmentClient = new Analytics({
  writeKey,
  maxEventsInBatch: 1,
  // We won't do anything if the analytics client is unable to contact Segment, just prevent a crash
  // @ts-ignore errorHandler is not showing up in the analytics-node types but it is publicly supported
  errorHandler: () => {},
});

typewriterClient.setTypewriterOptions({
  analytics: segmentClient,
});

/**
 * Adds the Typewriter CLI app context data to the event
 * @param message event
 * @param config OCLIF Config
 * @returns an event with context filled in
 */
const withContext = <P>(
  message: Omit<TrackMessage<P>, "anonymousId">,
  config: Config,
  anonymousId: string
): TrackMessage<P> => {
  return {
    ...message,
    anonymousId,
    context: {
      ...(message.context || {}),
      app: {
        name: config.pjson.name,
        version: config.pjson.version,
      },
    },
  };
};

/**
 * Formats the Workspace config into the tracking plan valid command config object
 * @param config OCLIF Config
 * @param tokenMethod Auth Token method used in the command
 * @returns a tracking plan compatible config object
 */
const toCommandConfig = (
  config: WorkspaceConfig,
  tokenMethod?: TokenMethod
): CommandBuildConfig | CommandInitConfig => {
  const { language, sdk, ...opts } = config.client;
  return {
    language,
    sdk,
    languageOptions: opts,
    trackingPlans: config.trackingPlans.map((plan) => ({
      id: plan.id,
      path: plan.path,
    })),
    tokenType:
      tokenMethod !== undefined ? toTelemetryTokenType(tokenMethod) : undefined,
  };
};

/**
 * Maps between the CLI TokenMethod enum to the TokenType from the tracking plan
 * @param token Auth Token method used in the command
 * @returns a TokenType
 */
const toTelemetryTokenType = (token: TokenMethod): TokenType => {
  const map: { [k in TokenMethod]: TokenType } = {
    [TokenMethod.Pipe]: TokenType.Input,
    [TokenMethod.File]: TokenType.Global,
    [TokenMethod.Script]: TokenType.Script,
  };
  return map[token];
};

const addContextParams = <T>(
  fn: (message: TrackMessage<T>, callback?: Callback) => void,
  config: Config,
  anonymousId: string
) => {
  return (
    message: Omit<TrackMessage<T>, "anonymousId">,
    callback?: Callback
  ): void => {
    fn(withContext(message, config, anonymousId), callback);
  };
};

const getSegmentClient = (config: Config) => {
  let anonymousId = "unknown";
  try {
    anonymousId = machineIdSync();
  } catch (error) {
    typewriterClient.commandError(
      withContext(
        {
          error: `Failed to generate an anonymous id: ${error}`,
        },
        config,
        anonymousId
      )
    );
  }

  return {
    buildCommand: addContextParams(
      typewriterClient.commandBuild,
      config,
      anonymousId
    ),
    helpCommand: addContextParams(
      typewriterClient.commandHelp,
      config,
      anonymousId
    ),
    initCommand: addContextParams(
      typewriterClient.commandInit,
      config,
      anonymousId
    ),
    commandError: addContextParams(
      typewriterClient.commandError,
      config,
      anonymousId
    ),
    closeAndFlush: () => {
      return segmentClient.closeAndFlush();
    },
  };
};

export { segmentClient, getSegmentClient, withContext, toCommandConfig };
export * from "./segment";
