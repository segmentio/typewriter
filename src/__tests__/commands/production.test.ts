import fs from "node:fs";
import path from "node:path";

import { setupEnv } from "../__helpers__/environment";
import { run } from "../__helpers__/oclif-runner";

const TEST_ENV_PATH = "production";

describe("prod", () => {
  const configurations = [
    ["typescript", "analytics-node", "segment.ts"],
    ["typescript", "analytics-js", "segment.ts"],
  ];

  for (const config of configurations) {
    const [language, sdk, filename, plan, id, outputPath, legacyId] = config;
    it(`builds production client Language: ${language}, SDK:${sdk}`, async () => {
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
      const output = fs
      .readFileSync(path.join(testPath, filename), {
        encoding: "utf-8",
      })
      .replace(/version:.*\d.*/g, "")
      expect(output).toMatchSnapshot();
    });
  }
});
