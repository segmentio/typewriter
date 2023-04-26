import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs";

/**
 * Typecheck current project
 */
async function typecheck(): Promise<
  { ok: true } | { ok: false; errors: string[] }
> {
  const cmd = [
    `node_modules/.bin/tsc`,
    `--pretty false`,
    `--noEmit`,
    `--lib "es2020","dom"`,
  ].join(" ");
  try {
    await promisify(exec)(cmd);
    return { ok: true };
  } catch (err: any) {
    if (!err || typeof err !== "object" || !err.stdout) {
      // invariant - should not happen
      throw err;
    }
    const errors: string[] = err.stdout.toString().split("\n");
    return { ok: false, errors };
  }
}

/**
 * @example
 * listFiles("/foo") => ['/foo/bar.txt', '/foo/baz.txt']
 */
const listFiles = (path: string) =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dir) => dir.name);

/**
 * Typecheck and only return those errors relevant to specific files.
 */
const typecheckFiles = async (files: string[]) => {
  const errors: string[] = [];
  const result = await typecheck();
  if (result.ok) {
    return;
  }
  for (const f of files) {
    const relevantErrors = result.errors.filter((msg) =>
      msg.includes(path.basename(f))
    );
    if (relevantErrors.length) {
      errors.push(...relevantErrors);
    }
  }
  if (errors.length) {
    throw errors;
  }
};

/**
 * Run
 */
const _main = (async () => {
  try {
    const buildPath = path.resolve(__dirname, "build");
    const testPath = path.resolve(__dirname, "tests");
    if (!fs.existsSync(buildPath)) {
      throw new Error('please run "yarn build"');
    }
    const paths = [buildPath, testPath].flatMap(listFiles);
    await typecheckFiles(paths);
    console.log("Type-checking complete.");
  } catch (err: any) {
    console.error(err);
    process.exit(1);
  }
})();
