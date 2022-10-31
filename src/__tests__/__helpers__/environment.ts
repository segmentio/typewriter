import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { saveWorkspaceConfig } from "../../config";

const BASE_PATH = "./test-env";

/**
 * Sets up an environment for a test by creating the right directories, config files and copying the tracking plan
 */
export const setupEnv = async (
  slug: string,
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

  const testPath = path.join(BASE_PATH, slug, language, sdk, hash);
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
