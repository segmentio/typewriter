import { CliUx } from '@oclif/core';
import chalk from 'chalk';
import figures from 'figures';
import { orderBy } from 'lodash';
import { normalize } from 'path';
import terminalLink from 'terminal-link';

import { fetchTrackingPlans, SegmentAPI, validateToken } from '../api';
import { BaseCommand } from '../base-command';
import { saveGlobalToken, saveWorkspaceConfig, tokenMethodToUserString, TrackingPlanConfig } from '../config';
import { LanguageGenerator, supportedLanguages } from '../languages';
import { toCommandConfig } from '../telemetry';

/**
 * Intro message that explains the features of the CLI
 */
export const MESSAGE_INTRO =
  `Typewriter is a tool for generating strongly-typed ${terminalLink(
    'Segment',
    'https://segment.com',
  )} analytics libraries from a ${terminalLink(
    'Tracking Plan',
    'https://segment.com/docs/protocols/tracking-plan/',
  )}.` +
  '\n' +
  chalk.gray(
    `Learn more from ${terminalLink(
      "Typewriter's documentation here",
      'https://segment.com/docs/protocols/typewriter',
    )}.`,
  ) +
  '\n' +
  chalk.gray(
    `To get started you'll need a ${chalk.yellow(
      'typewriter.yml',
    )} file. The quickstart below will walk you through creating one.`,
  );

export default class Init extends BaseCommand {
  static aliases: string[] = ['initialize', 'quickstart'];
  static description = '';
  static examples = ['<%= config.bin %> <%= command.id %>'];

  /**
   * Fetches tracking plans from the Segment API and returns a list of options for the user to choose from.
   * @returns Tracking plan options
   */
  private getTrackingPlanChoices = async (apiToken: string) => {
    // We load this from Segment using the API token supplied above so let's load i
    const trackingPlans = await fetchTrackingPlans(apiToken);
    return orderBy(
      trackingPlans.map((plan) => ({
        name: plan.name,
        value: plan,
      })),
      'name',
      'asc',
    );
  };

  /**
   * Formats a question with tips that show underneath it.
   * e.g.
   *
   * ? Enter a Segment Public API token
   * → A Public API token is used to download Tracking Plans from Segment.
   * → Documentation on generating an API token can be found here
   * @param question Question string
   * @param tips list of tips string to show below the question
   * @returns a formatted question string
   */
  private formatQuestion(question: string, tips?: string[]): string {
    let tipsText = '';
    if (tips !== undefined) {
      tipsText = tips.map((tip) => chalk.gray(`${figures.arrowRight} ${tip}`)).join('\n');
    }

    return [question, tipsText, chalk.white(figures.pointer)].join('\n');
  }

  /**
   * Validates a user API token. Returns a user friendly error message if the token is invalid.
   * @param token Segment PAPI token
   * @returns true if the token is valid, a user friendly string if there's an error
   */
  private async validateToken(token: string): Promise<boolean | string> {
    if (!token) {
      return 'You must enter an API token.';
    }

    try {
      const result = await validateToken(token);
      if (!result.isValid) {
        return `Input is not a valid Segment Public API token.`;
      }
      return result.isValid;
    } catch (error) {
      return (
        'Unable to validate token\n' +
        `Failed due to an ${(error as Record<string, unknown>).code} error (${JSON.stringify(error)}).`
      );
    }
  }

  public async run(): Promise<void> {
    if (this.workspaceConfig !== undefined) {
      this.log(
        `Found a workspace config file in your current directory ${this.configPath}. We will use this values by default if you don't change them.`,
      );
    }

    // Show intro message
    this.log(MESSAGE_INTRO);

    // Ask user for input to continue
    const { confirmation } = await this.prompt({
      type: 'input',
      name: 'confirmation',
      message: `Ready?`,
    });

    if (confirmation === false) {
      this.exit();
    }

    // If we have a token already check if the user wants to reuse it
    let useCurrentToken = this.tokenMetadata !== undefined;
    let token: string | undefined;
    if (this.tokenMetadata !== undefined) {
      const { useToken } = await this.prompt({
        type: 'list',
        name: 'useToken',
        default: true,
        message: this.formatQuestion(
          `Found a Segment Token for workspace ${this.tokenMetadata.workspace?.name} on ${tokenMethodToUserString(
            this.tokenMetadata.method,
            this.configPath,
          )}`,
        ),
        choices: [
          {
            name: 'Use this token',
            value: true,
          },
          {
            name: 'Enter a new token',

            value: false,
          },
        ],
      });
      useCurrentToken = useToken;
      if (useCurrentToken) {
        token = this.tokenMetadata.token;
      }
    }

    // If we don't have a token or the user wants to enter a new one, ask for one and validate before continue
    if (this.tokenMetadata === undefined || useCurrentToken === false) {
      const { apiToken } = await this.prompt({
        type: 'password',
        name: 'apiToken',
        message: this.formatQuestion('Enter a Segment Public API token', [
          `A Public API token is used to download Tracking Plans from Segment.`,
          `Documentation on generating an API token can be found ${terminalLink(
            'here',
            'https://segment.com/docs/protocols/typewriter/#api-token-configuration',
          )}`,
        ]),
        mask: '*',
        validate: this.validateToken,
      });
      token = apiToken;
    }

    // Ask if the user wants to store this token in the global ~/.typewriter
    // We don't do this automatically cause the user can have multiple workspaces, or supply the token as an input/pipe it
    const { shouldStoreToken } = await this.prompt({
      type: 'confirm',
      name: 'shouldStoreToken',
      message: this.formatQuestion('Would you like to store this token for future use?', [
        `This token will be stored in ~/.typewriter`,
        `If you choose not to store this token, you will need to enter it each time you run typewriter.`,
        `Do not store the token if you plan to use a script to retrieve the token before running typewriter.`,
      ]),
      default: true,
    });

    // Load the tracking plans for the user workspace
    CliUx.ux.action.start('Loading Tracking Plans');
    let planChoices: Awaited<ReturnType<typeof this.getTrackingPlanChoices>>;
    try {
      planChoices = await this.getTrackingPlanChoices(token!);
      if (planChoices.length === 0) {
        this.error('No tracking plans found. Create a tracking plan first.');
      }
    } catch (error) {
      this.debug('Error loading tracking plans', error);
      this.error('Unable to load tracking plans. Check your token and try again.');
    } finally {
      CliUx.ux.action.stop();
    }

    const trackingPlanConfigs: TrackingPlanConfig[] = [];
    // Ask the user to select a tracking plan for the workspace
    const { trackingPlans } = await this.prompt<{ trackingPlans: SegmentAPI.TrackingPlan[] }>({
      type: 'checkbox',
      name: 'trackingPlans',
      message: this.formatQuestion('Tracking Plan:', [
        'Typewriter will generate a client from this Tracking Plan',
        'This Tracking Plan is saved locally in a plan.json file',
      ]),
      choices: planChoices,
      default: this.workspaceConfig?.trackingPlans.map((t) => t.id),
      validate: (selection: SegmentAPI.TrackingPlan[]) => {
        if (selection === undefined || selection.length === 0) {
          return 'You must select at least one tracking plan';
        }
        return true;
      },
    });

    // Ask the user where to save the generated client for each tracking plan
    for (const trackingPlan of trackingPlans) {
      const { path } = await this.prompt({
        type: 'input',
        name: 'path',
        message: this.formatQuestion(
          `Enter a directory for the Tracking Plan ${chalk.green(trackingPlan.name)} output:`,
          [
            'The generated client will be stored in this directory.',
            'Directories will be automatically created, if needed.',
          ],
        ),
        filter: normalize,
        default: this.workspaceConfig?.trackingPlans.find((t) => t.id === trackingPlan.id)?.path,
      });
      trackingPlanConfigs.push({
        id: trackingPlan.id,
        name: trackingPlan.name,
        path: path,
      });
    }

    // Ask the user to select a language and SDK
    const { language } = await this.prompt<{ language: LanguageGenerator }>([
      {
        type: 'list',
        name: 'language',
        message: `Choose a Language:`,
        choices: supportedLanguages.map((lang) => ({
          name: lang.name,
          value: lang,
        })),
        default: supportedLanguages.find((lang) => lang.id === this.workspaceConfig?.client.language),
      },
    ]);

    const { sdk } = await this.prompt<{ sdk: string }>([
      {
        type: 'list',
        name: 'sdk',
        message: `Choose an SDK:`,
        choices: Object.entries(language.supportedSDKs).map(([key, value]) => ({
          name: key,
          value,
        })),
        default: this.workspaceConfig?.client.sdk,
      },
    ]);

    // Languages can have additional prompts as per quicktype: https://github.com/quicktype/quicktype
    // Some of them are advanced options, others are required
    let languagePrompts: Record<string, unknown> = {};

    if (language.requiredOptions !== undefined) {
      languagePrompts = await this.prompt(language.requiredOptions);
    }

    if (language.advancedOptions !== undefined) {
      const { languageFineTune } = await this.prompt<{ languageFineTune: boolean }>({
        type: 'confirm',
        name: 'languageFineTune',
        message: this.formatQuestion(`Do you want to review the advanced options for ${language.name}?`, [
          `Typewriter uses ${terminalLink('quicktype', 'https://app.quicktype.io/')} to generate the classes.`,
          `You can fine tune the generated classes by using any of the quicktype options.`,
        ]),
        default: false,
      });

      if (languageFineTune === true) {
        languagePrompts = {
          ...languagePrompts,
          ...(await this.prompt(language.advancedOptions)),
          // Prefixes and Suffixes
          ...(await this.prompt<{
            typePrefix?: string;
            typeSuffix?: string;
            functionPrefix?: string;
            functionSuffix: string;
          }>([
            {
              type: 'input',
              name: 'typePrefix',
              message: `Event Class Type Prefix:`,
              default: undefined,
            },
            {
              type: 'input',
              name: 'typeSuffix',
              message: `Event Class Type Suffix:`,
              default: undefined,
            },
            {
              type: 'input',
              name: 'functionPrefix',
              message: `Functions Prefix:`,
              default: undefined,
            },
            {
              type: 'input',
              name: 'functionSuffix',
              message: `Functions Suffix:`,
              default: undefined,
            },
          ]).then((results) => ({
            // Format the results into a valid configuration object
            prefixes: {
              functionName: results.functionPrefix,
              typeName: results.typePrefix,
            },
            suffixes: {
              functionName: results.functionSuffix,
              typeName: results.typeSuffix,
            },
          }))),
        };
      }
    }

    this.log('\n');
    this.log('Configuration Summary:');

    CliUx.ux.table(
      [
        {
          name: 'Tracking Plans',
          value: trackingPlanConfigs.map((t) => t.name).join(','),
        },
        {
          name: 'Paths',
          value: trackingPlanConfigs.map((t) => t.path).join(','),
        },
        {
          name: 'Language',
          value: language.name,
        },
        {
          name: 'SDK',
          value: sdk,
        },
        ...Object.entries(languagePrompts).map(([key, value]) => ({
          name: key,
          value: value,
        })),
      ],
      {
        name: {
          header: 'Name',
        },
        value: {
          header: 'Value',
        },
      },
    );
    this.log('\n');

    const { showSummary } = await this.prompt<{ showSummary: boolean }>({
      type: 'confirm',
      name: 'showSummary',
      message: 'Save these settings?',
    });

    if (!showSummary) {
      this.exit(0);
    }

    if (shouldStoreToken === true) {
      try {
        await saveGlobalToken(token!);
      } catch (error) {
        this.error(
          'Unable to write token to ~/.typewriter\n' +
            `Failed due to an ${(error as Record<string, unknown>).code} error (${
              (error as Record<string, unknown>).errno
            }).`,
        );
      }
    }

    const mergedConfig = {
      ...this.workspaceConfig,
      client: {
        ...this.workspaceConfig?.client,
        language: language.id,
        sdk: sdk,
        languageOptions: { ...languagePrompts },
      },
      trackingPlans: trackingPlanConfigs,
    };

    await saveWorkspaceConfig(mergedConfig, this.configPath);

    this.segmentClient.initCommand({
      properties: {
        config: toCommandConfig(mergedConfig, this.tokenMetadata!.method),
        hasConfig: this.workspaceConfig !== undefined,
      },
    });
  }
}
