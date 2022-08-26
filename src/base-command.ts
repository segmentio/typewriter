import { Command, Config, Flags } from "@oclif/core";
import { debug as debugRegister } from "debug";
import { createPromptModule, PromptModule } from "inquirer";
import tty from "tty";
import { fetchTrackingPlans, SegmentAPI } from "./api";
import { ttys } from "./common/ttys";
import {
  getToken,
  getUserConfig,
  TokenMetadata,
  WorkspaceConfig,
} from "./config";
import { supportedLanguages } from "./languages";
import { getSegmentClient } from "./telemetry";
import chalk from "chalk";

const DEFAULT_CONFIG_PATH = "./";

/**
 * Reads the stdin input
 * @returns string
 */
const readStdin = async () => {
  const { stdin } = process;
  let result: string | undefined;
  if (tty.isatty(0)) {
    return result;
  }
  result = "";
  stdin.setEncoding("utf8");
  for await (const chunk of stdin) {
    result += chunk;
  }

  return result;
};

/**
 * Base Command class.
 *
 * Handles loading the configuration and common flags, also adds support for pipes
 * All commands should extend this class!
 */
export abstract class BaseCommand extends Command {
  static examples = ["<%= config.bin %> <%= command.id %>"];

  /**
   * Workspace config data
   */
  workspaceConfig?: WorkspaceConfig;
  /**
   * Show verbose debug messages
   */
  isDebugEnabled: boolean = false;
  /**
   * Path to the workspace config
   */
  configPath: string = DEFAULT_CONFIG_PATH;
  /**
   * Segment Public API token
   */
  tokenMetadata?: TokenMetadata;
  /**
   * Piped input
   */
  pipedInput?: string;
  /**
   * A module of inquirer.js that is pipe friendly
   */
  prompt: PromptModule = createPromptModule({
    input: ttys.stdin,
    output: ttys.stdout,
  });

  segmentClient: ReturnType<typeof getSegmentClient>;

  public get apiToken(): string | undefined {
    return this.tokenMetadata?.token ?? undefined;
  }

  public get workspace(): SegmentAPI.Workspace | undefined {
    return this.tokenMetadata?.workspace;
  }

  static flags = {
    config: Flags.string({
      char: "c",
      description: "Path to the configuration file",
      multiple: false,
      default: DEFAULT_CONFIG_PATH,
    }),
    debug: Flags.boolean({
      description: "Enable verbose logging",
      default: false,
    }),
  };

  constructor(argv: string[], config: Config) {
    super(argv, config);
    this.segmentClient = getSegmentClient(config);
  }

  // Catch any error and report to segment
  protected override async catch(
    err: Error & { exitCode?: number | undefined }
  ): Promise<any> {
    this.segmentClient.commandError({
      command: this.id,
      error: `Error: ${err.message}\n${err.stack}`,
      errorCode: err.exitCode,
    });
    // We do a flush here manually cause oclif doesn't run the postrun hook for errors
    try {
      await this.segmentClient.flush();
    } catch {}
    return super.catch(err);
  }

  protected async init(): Promise<any> {
    await super.init();
    this.pipedInput = await readStdin();
    this.debug("Piped Input:", this.pipedInput);

    // Load common flags and arguments
    // We have to do this weird parse call cause of this bug in OCLIF when extending base commands with flags: https://github.com/oclif/oclif/issues/225
    const { flags } = await this.parse(this.constructor as typeof BaseCommand);

    this.configPath = flags.config;

    // We can enable debug either from the DEBUG environment variable or from the CLI flag.
    const isEnvDebugEnabled = debugRegister.enabled("typewriter");
    this.isDebugEnabled = flags.debug || isEnvDebugEnabled;
    if (!isEnvDebugEnabled && this.isDebugEnabled) {
      debugRegister.enable("*");
    }

    this.debug(`Debug enabled: ${this.isDebugEnabled}`);
    this.debug(`Config path: ${this.configPath}`);

    // Load user config if it exists.
    this.workspaceConfig = await getUserConfig(this.configPath);
    if (this.workspaceConfig === undefined) {
      this.debug(`No config found at ${this.configPath}`);
    } else {
      this.debug(`Workspace config: ${JSON.stringify(this.workspaceConfig)}`);
    }

    // Try to get the token for the user
    const tokenMetadata = await getToken(
      this.workspaceConfig,
      this.configPath,
      this.pipedInput
    );
    if (tokenMetadata?.token !== undefined) {
      this.tokenMetadata = tokenMetadata;
      this.debug(`Using API token: ${this.apiToken}`);
    } else {
      this.debug(`No valid API token found.`);
    }

    // TODO: Change the TP plan from ResourceId (ConfigAPI) to TrackingPlanId (PublicAPI)
    if (
      this.apiToken !== undefined &&
      this.workspaceConfig?.trackingPlans.some((tp) =>
        tp.id.trimStart().startsWith("rs_")
      )
    ) {
      this.warn(
        `Your ${chalk.green(
          "typewriter.yml"
        )} config file was generated with Typewriter v7, the Tracking Plan ID format has changed in v8, we will attempt to retrieve the new Tracking Plan IDs. You will receive a prompt to save this value for the next run`
      );
      // We will attempt to fix the tracking plan ids in memory, we won't replace anything without user confirmation as that is a one way operation
      this.debug(
        `Config file is in v7 ID format, attempting to retrieve the v8 Tracking Plan IDs`
      );
      try {
        const trackingPlans = await fetchTrackingPlans(this.apiToken);
        let hasMissing = false;
        if (trackingPlans !== undefined && trackingPlans.length > 0) {
          for (const trackingPlan of this.workspaceConfig.trackingPlans) {
            const newId = trackingPlans.find(
              (tp) => tp.resourceSchemaId === trackingPlan.id
            );
            if (newId !== undefined) {
              trackingPlan.legacyID = trackingPlan.id;
              trackingPlan.id = newId.id;
            } else {
              hasMissing = true;
              this.debug(
                `Could not find a Tracking Plan with ResourceID: ${trackingPlan.id}`
              );
            }
          }
        }

        if (hasMissing) {
          this.warn(
            `We couldn't find some tracking plan IDs automatically. We recommend reinitializing the config file by running ${chalk.green(
              "typewriter init"
            )}`
          );
        }
        // else {
        //   this.prompt({
        //     type: "confirm",
        //     name: `Do you want to save the updates to your config file? ${chalk.yellow(
        //       "(This is a one way operation, after this you won't be able to use Typewriter v7, you can use v8 without saving this changes)"
        //     )}`,
        //   });
        // }
        this.debug(`Converted v1 config to:`, this.workspaceConfig);
      } catch (e) {
        this.debug("Unable to list the tracking plans", e);
      }
    }

    this.debug(`Loaded supported languages:`, supportedLanguages);
  }

  protected async finally(_: Error | undefined): Promise<any> {
    await super.finally(_);
    // Close the TTY streams after the command is done else the command will hang.
    ttys.stdout?.destroy();
    ttys.stdin?.destroy();
  }
}
