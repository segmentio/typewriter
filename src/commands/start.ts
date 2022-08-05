import { Command, Flags } from '@oclif/core';
import { BaseCommand } from '../base-command';
import Build from './build';
import Init from './init';

export default class Start extends BaseCommand {
  static hidden: boolean = false;

  static flags = {
    ...BaseCommand.flags,
    ...Build.flags,
    ...Init.flags,
  };

  public async run(): Promise<void> {
    // If there's a config file already run the build
    if (this.workspaceConfig !== undefined) {
      await Build.run(this.argv);
    } else {
      await Init.run(this.argv);
    }
  }
}
