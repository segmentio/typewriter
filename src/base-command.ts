import { Command, Config, Flags } from '@oclif/core';
import { debug as debugRegister } from 'debug';
import { createPromptModule, PromptModule } from 'inquirer';
import tty from 'tty';
import { SegmentAPI } from './api';
import { ttys } from './common/ttys';
import { getToken, getUserConfig, TokenMetadata, WorkspaceConfig } from './config';
import { supportedLanguages } from './languages';
import { getSegmentClient } from './telemetry';

const DEFAULT_CONFIG_PATH = './';

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
  result = '';
  stdin.setEncoding('utf8');
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
  static examples = ['<%= config.bin %> <%= command.id %>'];

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
      char: 'c',
      description: 'Path to the configuration file',
      multiple: false,
      default: DEFAULT_CONFIG_PATH,
    }),
    debug: Flags.boolean({
      description: 'Enable verbose logging',
      default: false,
    }),
  };

  constructor(argv: string[], config: Config) {
    super(argv, config);
    this.segmentClient = getSegmentClient(config);
  }

  // Catch any error and report to segment
  protected override async catch(err: Error & { exitCode?: number | undefined }): Promise<any> {
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
    this.debug('Piped Input:', this.pipedInput);

    // Load common flags and arguments
    // We have to do this weird parse call cause of this bug in OCLIF when extending base commands with flags: https://github.com/oclif/oclif/issues/225
    const { flags } = await this.parse(this.constructor as typeof BaseCommand);

    this.configPath = flags.config;

    // We can enable debug either from the DEBUG environment variable or from the CLI flag.
    const isEnvDebugEnabled = debugRegister.enabled('typewriter');
    this.isDebugEnabled = flags.debug || isEnvDebugEnabled;
    if (!isEnvDebugEnabled && this.isDebugEnabled) {
      debugRegister.enable('*');
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
    const tokenMetadata = await getToken(this.workspaceConfig, this.configPath, this.pipedInput);
    if (tokenMetadata?.token !== undefined) {
      this.tokenMetadata = tokenMetadata;
      this.debug(`Using API token: ${this.apiToken}`);
    } else {
      this.debug(`No valid API token found.`);
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
