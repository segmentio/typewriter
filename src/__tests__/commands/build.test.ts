import fs from "node:fs";
import path from "node:path";

import { setupEnv } from "../__helpers__/environment";
import { run } from "../__helpers__/oclif-runner";

const TEST_ENV_PATH = "build";

describe("build", () => {
  const configurations = [
    // Basic tests
    ["typescript", "analytics-node", "segment.ts"],
    ["javascript", "analytics-node", "segment.js"],
    ["typescript", "analytics-js", "segment.ts"],
    ["swift", "swift", "segment.swift"],
    ["typescript", "analytics-react-native", "segment.tsx"],
    ["kotlin", "kotlin", "segment.kt"],
    // V1 tests, compatibility tests
    [
      "typescript",
      "analytics-node",
      "segment.ts",
      "./src/__tests__/__data__/plan-v1.json",
      "rs_2CJh7QUSFvjOlQEvvxzpTt8x48X",
    ],
    // Soft-migration, where we store the legacyID in the file for faster access
    [
      "typescript",
      "analytics-node",
      "segment.ts",
      "./src/__tests__/__data__/plan-v1.json",
      "tp_2CJh7O9XUIirKFn4pabvhz8Cn9K",
      "./",
      "rs_2CJh7QUSFvjOlQEvvxzpTt8x48X",
    ],
  ];

  for (const config of configurations) {
    const [language, sdk, filename, plan, id, outputPath, legacyId] = config;
    it(`builds client Language: ${language}, SDK:${sdk}`, async () => {
      const testPath = await setupEnv(
        TEST_ENV_PATH,
        language,
        sdk,
        plan,
        id,
        outputPath,
        legacyId
      );
      const { stdout } = await run(["build", "-c", testPath]);
      const output = fs
        .readFileSync(path.join(testPath, filename), {
          encoding: "utf-8",
        })
        .replace(/version:.*\d.*/g, "");
      expect(output).toMatchSnapshot();
    });
  }
});
