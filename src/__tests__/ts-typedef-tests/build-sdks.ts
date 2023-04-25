import fs from "node:fs";
import path from "node:path";
import { setupEnv } from "../__helpers__/environment";
import { run } from "../__helpers__/oclif-runner";

const TEST_ENV_PATH = "production";

const configurations = [
  ["typescript", "analytics-node", "segment.ts"],
  ["typescript", "analytics-js", "segment.ts"],
];

export const buildSDKs = async () => {
  for (const config of configurations) {
    const [language, sdk, filename, plan, id, outputPath, legacyId] = config;
    const testPath = await setupEnv(
      TEST_ENV_PATH,
      language,
      sdk,
      plan,
      id,
      outputPath,
      legacyId
    );
    await run(["production", "-c", testPath]);
    // basically, we write the test files to a new build path relative to this script.
    // typechecking ./test-env directly is a little complicated because of .tsconfig configuration + hashed directory name
    const output = fs
      .readFileSync(path.join(testPath, filename), {
        encoding: "utf-8",
      })
      .replace(/version:.*\d.*/g, "");

    const BUILD_PATH = path.resolve(__dirname, "build");
    if (!fs.existsSync(BUILD_PATH)) {
      fs.mkdirSync(BUILD_PATH);
    }
    fs.writeFileSync(
      path.resolve(BUILD_PATH, `${language}-${sdk}.ts`),
      output,
      { encoding: "utf-8" }
    );
  }
};
