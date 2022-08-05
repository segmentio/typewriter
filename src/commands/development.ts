import { Command, Flags } from '@oclif/core';
import { BaseCommand } from '../base-command';
import Build from './build';

export default class Development extends BaseCommand {
  static description = 'Generates types and functions for your tracking plan in development mode';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static aliases: string[] = ['dev', 'd'];

  static flags = {
    ...BaseCommand.flags,
    update: Flags.boolean({
      char: 'u',
      default: false,
      description: 'Download the latest Tracking Plan version from Segment',
    }),
  };

  public async run(): Promise<void> {
    await Build.run([...this.argv, '-m', 'dev']);
  }
}
