import { CliUx } from '@oclif/core';
import chalk from 'chalk';

import { BaseCommand } from '../base-command';
import { getGlobalToken, getInputToken, getScriptToken, TokenMetadata } from '../config';

const NO_TOKEN = '(None)';

export default class Token extends BaseCommand {
  static description = 'Displays current tokens';

  static aliases = ['tokens', 't'];

  static examples = ['<%= config.bin %> <%= command.id %>'];

  private formatTokenRow(name: string, token: TokenMetadata): { name: string; value: string; workspace: string } {
    const color = token.token === undefined ? chalk.grey : token.isValid ? chalk.green : chalk.red;
    return {
      name: color(name),
      value: color(token?.token ?? NO_TOKEN),
      workspace: color(token.workspace?.name ?? ''),
    };
  }

  public async run(): Promise<void> {
    const inputToken = await getInputToken(this.pipedInput, true);
    const scriptToken = await getScriptToken(this.workspaceConfig, this.configPath, true);
    const globalToken = await getGlobalToken(true);

    CliUx.ux.table(
      [
        this.formatTokenRow('Input', inputToken),
        this.formatTokenRow('Script', scriptToken),
        this.formatTokenRow('Global', globalToken),
      ],
      {
        name: {
          header: 'Location',
        },
        value: {
          header: 'Value',
        },
        workspace: {
          header: 'Workspace',
        },
      },
    );
  }
}
