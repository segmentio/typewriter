import { Flags, loadHelpClass } from '@oclif/core';
import { BaseCommand } from '../base-command';

export default class HelpCommand extends BaseCommand {
  static description = 'Display help for <%= config.bin %>.';

  static flags = {
    ...BaseCommand.flags,
    'nested-commands': Flags.boolean({
      description: 'Include all nested commands in the output.',
      char: 'n',
    }),
  };

  static args = [
    {
      name: 'command',
      required: false,
      description: 'Command to show help for.',
    },
  ];

  public async run(): Promise<void> {
    const { argv } = await this.parse(HelpCommand);
    const Help = await loadHelpClass(this.config);
    const help = new Help(this.config, this.config.pjson.helpOptions);
    await help.showHelp(argv);

    this.segmentClient.helpCommand({
      command: argv[0],
    });
  }
}
