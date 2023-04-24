import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs";
import { buildFixtures } from "./build-fixtures";

const execa = promisify(exec);

async function typecheck() {
  const cmd = [
    `node_modules/.bin/tsc`,
    `--project tsconfig.json`,
    `--pretty false`,
    `--noEmit`,
    `--lib "es2020","dom"`,
  ].join(" ");
  try {
    await execa(cmd);
  } catch (err: any) {
    if (!err || typeof err !== "object" || !err.stdout) {
      throw err;
    }
    const errors: string[] = err.stdout.toString().split("\n");
    return errors;
  }
}

const FIXTURE_ABS_PATH = path.resolve(__dirname, "fixtures");
const TESTS_ABS_PATH = path.resolve(__dirname, "tests");

const listFiles = (path: string) =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dir) => dir.name);

const typeCheckFiles = async (files: string[]) => {
  const errors: any[] = [];
  const maybeErrors = await typecheck();
  if (!maybeErrors?.length) {
    return;
  }
  for (const f of files) {
    const relevantErrors = maybeErrors.filter((msg) =>
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

const main = (async () => {
  try {
    await buildFixtures();
    // get files in fixture path
    const allFilesToCheck = [
      ...listFiles(FIXTURE_ABS_PATH),
      ...listFiles(TESTS_ABS_PATH),
    ];
    await typeCheckFiles(allFilesToCheck);
  } catch (errors) {
    console.error(JSON.stringify(errors));
    process.exit(1);
  }
})();
