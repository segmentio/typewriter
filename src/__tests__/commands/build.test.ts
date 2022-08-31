import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { saveWorkspaceConfig } from "../../config";
import { run } from "../__helpers__/oclif-runner";

const TEST_ENV_PATH = "./test-env";

/**
 * Sets up an environment for a test by creating the right directories, config files and copying the tracking plan
 */
const setupEnv = async (
  basePath: string,
  language: string,
  sdk: string,
  trackingPlanFile: string = "./src/__tests__/__data__/plan.json",
  id: string = "tp_2CJh7O9XUIirKFn4pabvhz8Cn9K",
  outputPath: string = "./",
  legacyID?: string
) => {
  const hash = crypto
    .createHash("sha256")
    .update(trackingPlanFile)
    .update(id)
    .update(outputPath)
    .update(legacyID ?? "")
    .digest("hex");

  const testPath = path.join(basePath, language, sdk, hash);
  if (fs.existsSync(testPath)) {
    fs.rmSync(testPath, { recursive: true, force: true });
  }
  fs.mkdirSync(testPath, { recursive: true });

  await saveWorkspaceConfig(
    {
      client: {
        language,
        sdk,
      },
      trackingPlans: [
        {
          name: "Test",
          id,
          path: outputPath,
          legacyID,
        },
      ],
    },
    testPath
  );

  fs.copyFileSync(trackingPlanFile, path.join(testPath, "plan.json"));
  return testPath;
};

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
      await run(["build", "-c", testPath]);
      expect(
        fs.readFileSync(path.join(testPath, filename), {
          encoding: "utf-8",
        })
      ).toMatchSnapshot();
    });
  }
});
