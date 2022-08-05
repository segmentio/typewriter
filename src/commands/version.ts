import chalk from 'chalk';
import { CliUx } from '@oclif/core';
import latest, { Options } from 'latest-version';
import semver from 'semver';
import { BaseCommand } from '../base-command';

export default class Version extends BaseCommand {
  static description = 'describe the command here';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  public async run(): Promise<void> {
    let latestVersion: string = '';
    const { name, version } = this.config;

    // Start the spinner while checking versions
    CliUx.ux.action.start(chalk.grey('(checking for new versions)'));

    try {
      let options: Options = {};

      // If the user is on a pre-release, check if there's a new pre-release.
      // Otherwise, only compare against stable versions.
      const prerelease = semver.prerelease(version);
      if (prerelease && prerelease.length > 0) {
        options = { version: 'next' };
      }

      latestVersion = await latest(name, options);
    } catch (error) {
      // If we can't access NPM, then ignore this version check.
      this.error(error as Error);
    }

    // Stop spinner
    CliUx.ux.action.stop();

    // TODO: This isn't even checking if the version is newer!
    const isLatest = latestVersion === '' || latestVersion === version;

    const newVersionText = !isLatest ? `(new! ${latestVersion})` : '';

    CliUx.ux.info(`Version: ${version} ${chalk.yellow(newVersionText)}`);
  }
}
