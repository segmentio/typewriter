import { CliUx } from '@oclif/core';
import chalk from 'chalk';
import { loadTrackingPlans } from '../api';
import { BaseCommand } from '../base-command';

export default class Update extends BaseCommand {
  static description = 'Download the latest tracking plan data';

  static aliases: string[] = ['u'];

  static examples = ['<%= config.bin %> <%= command.id %>'];

  public async run(): Promise<void> {
    // Check we have all the information we need
    if (this.apiToken === undefined) {
      this.warn(`No API token found at ${this.configPath}. Using local copy of tracking plans instead.`);
    }

    if (this.workspaceConfig === undefined) {
      this.error(`No workspace config found at ${this.configPath}. Run init first to generate a configuration file.`);
    }

    const configPlans = this.workspaceConfig?.trackingPlans ?? [];

    if (configPlans.length === 0) {
      this.error(`No tracking plans found on ${this.configPath}. Run init first to generate a config file.`);
    }

    CliUx.ux.action.start('Loading tracking plans');

    const trackingPlans = await loadTrackingPlans(
      this.apiToken!,
      this.configPath,
      this.workspaceConfig.trackingPlans,
      true,
    );

    this.debug('Loaded Tracking Plans:\n', trackingPlans);

    CliUx.ux.action.stop(chalk.green(`Loaded`));
  }
}
