import { debug as debugRegister } from "debug";
import stringify from "json-stable-stringify";
import { flow } from "lodash";
import fs from "node:fs";
import { promisify } from "node:util";
import sortKeys from "sort-keys";
import { isWrappedError } from "../common";
import {
  resolveRelativePath,
  TrackingPlanConfig,
  verifyDirectoryExists,
} from "../config";
import { fetchTrackingPlan, SegmentAPI } from "./api";
import chalk from "chalk";

const debug = debugRegister("typewriter:trackingplans");

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

export const TRACKING_PLAN_FILENAME = "plan.json";

function isV1Plan(
  plan: SegmentAPI.TrackingPlan | SegmentAPI.TrackingPlanV1
): plan is SegmentAPI.TrackingPlanV1 {
  return !Array.isArray(plan.rules) && plan.rules?.events !== undefined;
}

function convertToV2Plan(
  plan: SegmentAPI.TrackingPlanV1
): SegmentAPI.TrackingPlan {
  console.warn(
    `${chalk.yellow("Warning:")} The tracking plan ${
      plan.name
    } was downloaded with Typewriter v7, we will convert it for compatibility. However we recommend runing ${chalk.green(
      "typewriter update"
    )} or ${chalk.green("typewriter build -u")} to download it with v8 format`
  );
  return {
    createdAt: plan.create_time,
    updatedAt: plan.update_time,
    name: plan.display_name,
    id: plan.name.split("/").pop() as string,
    description: "",
    slug: "",
    rules: plan.rules?.events.map((rule) => {
      return {
        key: rule.name,
        description: rule.description,
        jsonSchema: rule.rules,
        type: SegmentAPI.RuleType.Track, // V1 only supported Track
        version: rule.version,
      };
    }),
  };
}

export async function loadTrackingPlan(
  configPath: string | undefined,
  config: TrackingPlanConfig
): Promise<SegmentAPI.TrackingPlan | undefined> {
  const path = resolveRelativePath(
    configPath,
    config.path,
    TRACKING_PLAN_FILENAME
  );

  // Load the Tracking Plan from the local cache.
  try {
    const plan = JSON.parse(
      await readFile(path, {
        encoding: "utf-8",
      })
    ) as SegmentAPI.TrackingPlan | SegmentAPI.TrackingPlanV1;

    let v2Plan: SegmentAPI.TrackingPlan;

    if (isV1Plan(plan)) {
      // Convert plan to v2 format internally
      debug(
        `Tracking Plan at ${path} is using ConfigAPI format. Translating to PublicAPI format for compatibility`
      );
      v2Plan = convertToV2Plan(plan);
    } else {
      v2Plan = plan;
    }

    return await sanitizeTrackingPlan(v2Plan);
  } catch {
    // We failed to read the Tracking Plan, possibly because no plan.json exists.
    return undefined;
  }
}

export async function writeTrackingPlan(
  configPath: string | undefined,
  plan: SegmentAPI.TrackingPlan,
  config: TrackingPlanConfig
): Promise<void> {
  const path = resolveRelativePath(
    configPath,
    config.path,
    TRACKING_PLAN_FILENAME
  );
  await verifyDirectoryExists(path, "file");

  // Perform some pre-processing on the Tracking Plan before writing it.
  const planJSON = flow<
    [SegmentAPI.TrackingPlan],
    SegmentAPI.TrackingPlan,
    string
  >(
    // Enforce a deterministic ordering to reduce verson control deltas.
    (plan: SegmentAPI.TrackingPlan) => sanitizeTrackingPlan(plan),
    (plan: SegmentAPI.TrackingPlan) => stringify(plan, { space: "\t" })
  )(plan);

  await writeFile(path, planJSON, {
    encoding: "utf-8",
  });
}

/**
 * Loads tracking plan data for each of the tracking plan IDs in the user config.
 *
 * @param configPath path to the user config
 * @param trackingPlanConfigs array of tracking plan IDs
 * @param forceUpdate (default: false)
 * @returns Full TrackingPlan data
 */
export async function loadTrackingPlans(
  apiToken: string,
  configPath: string,
  trackingPlanConfigs: TrackingPlanConfig[],
  forceUpdate: boolean = false
): Promise<SegmentAPI.TrackingPlan[]> {
  const loadedTrackingPlans: SegmentAPI.TrackingPlan[] = [];

  for (const trackingPlanConfig of trackingPlanConfigs) {
    // Load the local copy of this Tracking Plan, we'll either use this for generation
    // or use it to identify what changed with the latest copy of this Tracking Plan.
    const previousTrackingPlan = await loadTrackingPlan(
      configPath,

      trackingPlanConfig
    );

    if (previousTrackingPlan !== undefined) {
      debug(`Loaded previous tracking plan: ${previousTrackingPlan.name}`);
    }

    // If we don't have a copy of the Tracking Plan, then we would fatal error. Instead,
    // fallback to pulling down a new copy of the Tracking Plan.
    if (!forceUpdate && previousTrackingPlan === undefined) {
      debug("No local copy of this Tracking Plan, fetching from API.");
    }

    // If we are pulling the latest Tracking Plan (npx typewriter), or if there is no local
    // copy of the Tracking Plan (plan.json), then query the API for the latest Tracking Plan.
    let newTrackingPlan: SegmentAPI.TrackingPlan | undefined;
    if (forceUpdate || previousTrackingPlan === undefined) {
      try {
        newTrackingPlan = await fetchTrackingPlan(
          trackingPlanConfig.id,

          apiToken
        );
      } catch (error) {
        const errorMessage = isWrappedError(error)
          ? error.description
          : "API request failed";
        debug(
          `${errorMessage}. Using local copy of ${trackingPlanConfig.name} instead.`
        );
      }

      if (newTrackingPlan !== undefined) {
        // Update plan.json with the latest Tracking Plan.
        await writeTrackingPlan(
          configPath,

          newTrackingPlan,

          trackingPlanConfig
        );
      }
    }

    newTrackingPlan = newTrackingPlan || previousTrackingPlan;
    if (newTrackingPlan === undefined) {
      throw new Error("Unable to fetch Tracking Plan from local cache or API");
    }

    const rules = newTrackingPlan.rules;

    if (rules === undefined || rules.length === 0) {
      throw new Error(`No rules found for ${trackingPlanConfig.name}.`);
    }

    loadedTrackingPlans.push(newTrackingPlan);
  }

  return loadedTrackingPlans;
}

/**
 * Sanitizes key names removing unsupported characters of the JSON Schema
 * @param key key or name
 * @returns sanitized key
 */
function sanitizeKey(key: string): string {
  return key.replace("#", "");
}

export function sanitizeTrackingPlan(
  plan: SegmentAPI.TrackingPlan
): SegmentAPI.TrackingPlan {
  const trackingPlan: SegmentAPI.TrackingPlan = {
    ...plan,
    // Filter only event types we support right now
    // TODO: Support more than just Track events
    rules: plan.rules
      ?.filter((rule) => rule.type === SegmentAPI.RuleType.Track)
      // Typewriter doesn't yet support event versioning. For now, we just choose the most recent version.
      // TODO: Handle multiple versions on the class names
      .filter((rule) =>
        plan.rules?.every(
          (e2) => rule.key !== e2.key || rule.version >= e2.version
        )
      )
      // The Tracking Plan returned by PAPI wraps the event in a context and other properties object, we unwrap it here as we only care about the inner type
      .map((plan) => {
        // If we added the eventMetadata we have already done this unwrapping, no need to do it again
        if (plan.jsonSchema.eventMetadata !== undefined) {
          return plan;
        }

        const innerProperties =
          plan.jsonSchema.properties?.properties?.properties ?? {};

        Object.keys(innerProperties).map((key) => {
          if (innerProperties[key].id !== undefined) {
            innerProperties[key].id = (
              innerProperties[key].id as string
            ).replace("/properties/properties/properties/", "/properties/");
          }
        });

        return {
          ...plan,
          key: sanitizeKey(plan.key),
          jsonSchema: {
            ...plan.jsonSchema,
            ...plan.jsonSchema.properties?.properties, // This is needed to unwrap required, type and other additional info
            properties: innerProperties, // We need our own transformed object of the properties
            // We add some additional properties:
            eventMetadata: {
              name: plan.key, // The unsanitized original evne name
              type: plan.type, // Event Type (Track, Identify, etc)
            },
          },
        };
      }),
  };

  return sortKeys(trackingPlan, { deep: true });
}

export function toTrackingPlanURL(workspace: string, id: string): string {
  return `https://app.segment.com/${workspace}/protocols/tracking-plans/${id}`;
}
