import fs from 'fs';
import { promisify } from 'util';
import { resolve, dirname } from 'path';
import { Document, Node, parse } from 'yaml';
import { homedir } from 'os';
import { WorkspaceConfig, validateConfig, TrackingPlanConfig } from './schema';
import { validateToken, SegmentAPI } from '../api';
import { wrapError } from '../common';
import { runScript, Scripts } from './scripts';
import { CLIError } from '@oclif/core/lib/errors';
import { debug as debugRegister } from 'debug';
import { NodeType } from 'yaml/dist/nodes/Node';

const debug = debugRegister('typewriter:config');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

export const CONFIG_NAME = 'typewriter.yml';

/**
 * getConfig looks for, and reads, a typewriter.yml configuration file.
 * If it does not exist, it will return undefined. If the configuration
 * if invalid, an Error will be thrown.
 * Note: path is relative to the directory where the typewriter command
 * was run.
 * @param path
 * @returns
 */
export async function getUserConfig(path: string): Promise<WorkspaceConfig | undefined> {
  // Check if a typewriter.yml exists.
  const configPath = await getPath(path);
  if (!(await exists(configPath))) {
    debug('getUserConfig', 'No config file found at', configPath);
    return undefined;
  }

  // If so, read it's contents.
  let file: string;
  try {
    file = await readFile(configPath, {
      encoding: 'utf-8',
    });
  } catch (error) {
    throw wrapError(
      'Unable to open typewriter.yml',
      error as Error,
      `Failed due to an ${(error as Record<string, unknown>).code} error (${
        (error as Record<string, unknown>).errno
      }).`,
      configPath,
    );
  }

  const rawConfig: Record<string, unknown> = parse(file) as Record<string, unknown>;
  debug('Loaded raw config', rawConfig);

  return validateConfig(rawConfig);
}

/**
 * saveConfig writes a config out to a typewriter.yml file.
 * Note path is relative to the directory where the typewriter command
 * was run.
 * @param config
 * @param path
 */
export async function saveWorkspaceConfig(config: WorkspaceConfig, path: string): Promise<void> {
  const CONFIG_HEADER =
    'Segment Typewriter Configuration (https://segment.com/docs/protocols/typewriter)\nJust run `npx typewriter@next` to re-generate a client with the latest versions of these events.';

  const doc = new Document(config);
  doc.commentBefore = CONFIG_HEADER;

  // Add comment to client node
  const clientNode = doc.get('client') as Node<typeof config.client>;
  clientNode.commentBefore =
    'You can find more documentation on configuring this client in the Segment docs\nSee: https://segment.com/docs/protocols/typewriter';

  // Add comment to each tracking plan
  const trackingPlans = doc.get('trackingPlans') as NodeType<typeof config.trackingPlans>;
  for (const plan of trackingPlans.items) {
    const id = plan.get('id')?.toString();
    // We only pass in the name to fill the comment template, we don't need it in the config file anymore after retrieving the value
    const name = plan.get('name')?.toString();
    plan.delete('name');

    plan.commentBefore = `Tracking Plan: ${name}\nhttps://api.segmentapis.com/tracking-plans/${id}`;
  }

  const file = doc.toString();

  await writeFile(await getPath(path), file);
}

/**
 * resolveRelativePath resolves a relative path from the directory of the `typewriter.yml` config
 * file. It supports file and directory paths.
 * @param configPath
 * @param path
 * @param otherPaths
 * @returns
 */
export function resolveRelativePath(configPath: string | undefined, path: string, ...otherPaths: string[]): string {
  // Resolve the path based on the optional --config flag.
  return configPath
    ? resolve(configPath.replace(/typewriter\.yml$/, ''), path, ...otherPaths)
    : resolve(path, ...otherPaths);
}

export async function verifyDirectoryExists(path: string, type: 'directory' | 'file' = 'directory'): Promise<void> {
  // If this is a file, we need to verify it's parent directory exists.
  // If it is a directory, then we need to verify the directory itself exists.
  const dirPath = type === 'directory' ? path : dirname(path);
  if (!(await exists(dirPath))) {
    await mkdir(dirPath, {
      recursive: true,
    });
  }
}

export enum TokenMethod {
  Script = 'script',
  File = 'file',
  Pipe = 'pipe',
}

export function tokenMethodToUserString(method: TokenMethod, configPath?: string) {
  if (method === TokenMethod.Pipe) {
    return 'input';
  }
  if (method === TokenMethod.Script) {
    return `${configPath ?? '.'}/${CONFIG_NAME}`;
  }
  return '~/.typewriter';
}

export type TokenMetadata = {
  token?: string;
  method: TokenMethod;
  isValid?: boolean;
  workspace?: SegmentAPI.Workspace;
};

/**
 * getToken uses a Config to fetch a Segment API token. It will search for it in this order:
 *   1. The stdout from executing the optional token script from the config.
 *   2. cat ~/.typewriter
 * Returns undefined if no token can be found
 * @param config
 * @param configPath
 * @returns
 */
export async function getToken(
  config: Partial<WorkspaceConfig> | undefined,
  configPath: string,
  input?: string,
): Promise<TokenMetadata | undefined> {
  const tokenFns = [() => getInputToken(input), () => getScriptToken(config, configPath), () => getGlobalToken()];

  for (const tokenFn of tokenFns) {
    const metadata = await tokenFn();
    debug('getToken', metadata);
    if (metadata.isValid === true) {
      debug('Selecting Token', metadata);
      return metadata;
    }
  }

  return undefined;
}

/**
 * Formats a token received through input
 * @param input
 * @returns
 */
export async function getInputToken(input?: string, validate: boolean = true): Promise<TokenMetadata> {
  if (input !== undefined && input.trim() !== '') {
    const token = input.trim();
    const validationResult = validate ? await validateToken(token) : undefined;
    return {
      token,
      method: TokenMethod.Pipe,
      ...validationResult,
    };
  }
  return {
    method: TokenMethod.Pipe,
  };
}

/**
 * Finds if the current workspace has a script to generate a token and retrieves the value.
 * @param config
 * @param configPath
 * @returns
 */
export async function getScriptToken(
  config: Partial<WorkspaceConfig> | undefined,
  configPath: string,
  validate: boolean = true,
): Promise<TokenMetadata> {
  if (config?.scripts?.token === undefined) {
    return {
      method: TokenMethod.Script,
    };
  }

  // Attempt to read a token by executing the token script from the typewriter.yml config file.
  // Handle token script errors gracefully, f.e., in CI where you don't need it.

  // TODO: Warn that scripts will be deprecated
  const tokenScript = config.scripts.token;
  const stdout = await runScript(tokenScript, configPath, Scripts.Token);

  if (stdout === undefined || stdout.trim() === '') {
    throw new CLIError('No token was found in the stdout of the token script.', {
      suggestions: [
        `Make sure the script ${tokenScript} outputs a token to stdout.`,
        `Check your token script at ${configPath}`,
      ],
    });
  }

  const token = stdout.trim();
  const validationResult = validate ? await validateToken(token) : undefined;

  return {
    method: TokenMethod.Script,
    token,
    ...validationResult,
  };
}

/**
 * Retrieves the token stored in the user file: ~/.typewriter.
 * @param config
 * @param configPath
 * @returns
 */
export async function getGlobalToken(validate: boolean = true): Promise<TokenMetadata> {
  // Attempt to read a token from the ~/.typewriter token file.
  // Tokens are stored here during the `init` flow, if a user generates a token.
  try {
    const path = resolve(homedir(), '.typewriter');
    const token = (await readFile(path, 'utf-8')).trim();
    const validationResult = validate ? await validateToken(token) : undefined;
    return {
      method: TokenMethod.File,
      token,
      ...validationResult,
    };
  } catch (error) {
    // Ignore errors if ~/.typewriter doesn't exist
  }
  return {
    method: TokenMethod.File,
  };
}

/**
 * storeToken writes a token to ~/.typewriter.
 * @param token
 * @returns
 */
export async function saveGlobalToken(token: string): Promise<void> {
  const path = resolve(homedir(), '.typewriter');
  return writeFile(path, token, 'utf-8');
}

async function getPath(path: string): Promise<string> {
  path = path.replace(/typewriter\.yml$/, '');
  // TODO: recursively move back folders until you find it, ala package.json
  return resolve(path, CONFIG_NAME);
}
