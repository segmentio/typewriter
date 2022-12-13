import { SomeJSONSchema } from "ajv/dist/types/json-schema";
import { debug as debugRegister } from "debug";
import got, {
  HTTPError,
  OptionsOfJSONResponseBody,
  RequestError,
  TimeoutError,
} from "got";
import { hostname } from "os";
import { isWrappedError, wrapError } from "../common";
import { sanitizeTrackingPlan } from "./trackingplans";

const debug = debugRegister("typewriter:api");

// We need to use require instead of an import because using JSON imports with TS would require nested tsconfigs which in turn do not play nicely with the bin/dev command of OCLIF
const pjson = require("../../package.json");

const PAGE_SIZE = 200;

export namespace SegmentAPI {
  export type Pagination = {
    pagination: {
      current: string;
      next?: string;
      previous?: string;
      totalEntries?: number;
    };
  };

  // https://reference.segmentapis.com/#1092fe01-379b-4ca1-8b1d-9f42b33d2899
  export type GetTrackingPlanResponse = {
    data: { trackingPlan: TrackingPlan };
  };
  export type GetTrackingPlanRulesResponse = {
    data: {
      rules: RuleMetadata[];
    } & Pagination;
  };

  // https://reference.segmentapis.com/?version=latest#ef9f50a2-7031-4ddf-898a-387266894a04
  export type ListTrackingPlansResponse = {
    data: {
      trackingPlans: TrackingPlan[];
    } & Pagination;
  };

  export type RuleMetadataV1 = {
    name: string;
    description?: string;
    rules: SomeJSONSchema;
    version: number;
  };

  export type Events = {
    events: RuleMetadataV1[];
  };

  export type TrackingPlanV1 = {
    name: string;
    display_name: string;
    create_time: Date;
    update_time: Date;
    rules?: Events;
  };

  export type TrackingPlan = {
    id: string;
    resourceSchemaId?: string;
    name: string;
    slug: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    rules?: RuleMetadata[];
  };

  export enum RuleType {
    Common = "COMMON",
    Group = "GROUP",
    Identify = "IDENTIFY",
    Page = "PAGE",
    Screen = "SCREEN",
    Track = "TRACK",
  }

  export type RuleMetadata = {
    key: string;
    type: RuleType;
    description?: string;
    jsonSchema: SomeJSONSchema;
    version: number;
  };

  // https://api.segmentapis.com/docs/workspaces/#get-workspace
  export type WorkspaceResponse = {
    data: {
      workspace: Workspace;
    };
  };

  export type Workspace = {
    name: string;
    display_name: string;
    id: string;
    create_time: Date;
  };
}

/**
 * Fetches the complete data for a tracking plan, including the rules
 */
export async function fetchTrackingPlan(
  id: string,
  token: string,
  skipRules: boolean = false
): Promise<SegmentAPI.TrackingPlan> {
  const url = `tracking-plans/${id}`;
  const [planResponse, rulesResponse] = await Promise.all([
    apiGet<SegmentAPI.GetTrackingPlanResponse>(url, token),
    skipRules
      ? undefined
      : apiGet<SegmentAPI.GetTrackingPlanRulesResponse>(
          `${url}/rules?pagination.count=${PAGE_SIZE}`,
          token
        ),
  ]);

  const rules = [...(rulesResponse?.data.rules ?? [])];
  debug(
    `Loaded ${rules.length} rules. Next Page=${rulesResponse?.data.pagination.next}`
  );

  // Handle pagination over the rules
  let rulePage = rulesResponse;
  while (rulePage?.data.pagination.next !== undefined) {
    rulePage = await apiGet<SegmentAPI.GetTrackingPlanRulesResponse>(
      `${url}/rules?pagination.count=${PAGE_SIZE}&pagination.cursor=${rulePage.data.pagination.next}`,
      token
    );
    if (rulePage?.data.rules !== undefined && rulePage.data.rules.length > 0) {
      debug(
        `Loaded ${rulePage.data.rules.length} rules. Next Page=${rulePage.data.pagination.next}`
      );
      rules.push(...rulePage.data.rules);
    }
  }

  const trackingPlan = planResponse.data.trackingPlan;

  trackingPlan.createdAt = new Date(trackingPlan.createdAt);
  trackingPlan.updatedAt = new Date(trackingPlan.updatedAt);
  trackingPlan.rules = rules;

  debug(
    `Loaded ${trackingPlan.rules.length} rules for the tracking plan ${trackingPlan.name}`
  );

  return sanitizeTrackingPlan(trackingPlan);
}

/**
 * Fetches all Tracking Plans accessible by a given API token
 */
export async function fetchTrackingPlans(
  token: string
): Promise<SegmentAPI.TrackingPlan[]> {
  const url = `tracking-plans?pagination.count=${PAGE_SIZE}`;
  const response = await apiGet<SegmentAPI.ListTrackingPlansResponse>(
    url,
    token
  );

  const trackingPlans = [...(response.data.trackingPlans ?? [])];
  debug(
    `Loaded ${trackingPlans.length} tracking plans. Next Page=${response.data.pagination.next}`
  );

  let page = response;
  while (page.data.pagination.next !== undefined) {
    page = await apiGet<SegmentAPI.ListTrackingPlansResponse>(
      `tracking-plans?pagination.count=${PAGE_SIZE}&pagination.cursor=${page.data.pagination.next}`,
      token
    );
    if (
      page.data.trackingPlans !== undefined &&
      page.data.trackingPlans.length > 0
    ) {
      debug(
        `Loaded ${page.data.trackingPlans.length} tracking plans. Next Page=${page.data.pagination.next}`
      );
      trackingPlans.push(...page.data.trackingPlans);
    }
  }

  return trackingPlans.map((tp) => ({
    ...tp,
    createdAt: new Date(tp.createdAt),
    updatedAt: new Date(tp.updatedAt),
  }));
}

/**
 * Fetches the workspace data for a given API token
 */
export async function fetchWorkspace(options: {
  token: string;
}): Promise<SegmentAPI.Workspace> {
  const resp = await apiGet<SegmentAPI.WorkspaceResponse>("", options.token);
  return resp.data.workspace;
}

export type TokenValidationResult = {
  isValid: boolean;
  workspace?: SegmentAPI.Workspace;
};

/**
 * validateToken returns true if a token is a valid Segment API token.
 * Note: results are cached in-memory since it is commonly called multiple times
 * for the same token (f.e. in `config/`).
 */
export async function validateToken(
  token: string | undefined
): Promise<TokenValidationResult> {
  if (!token) {
    return { isValid: false };
  }

  // If we don't have a cached result, query the API to find out if this is a valid token.
  const result: TokenValidationResult = { isValid: false };
  try {
    result.workspace = await fetchWorkspace({ token });
    result.isValid = result.workspace !== undefined;
  } catch (error) {
    // Check if this was a 403 error, which means the token is invalid.
    // Otherwise, surface the error becuase something else went wrong.
    if (!isWrappedError(error) || !(error.error instanceof HTTPError)) {
      throw error;
    }
  }

  return result;
}

/**
 * apiGet is a wrapper around `got` that handles calls to Segment Public API
 */
async function apiGet<T>(
  url: string,
  token: string,
  options?: OptionsOfJSONResponseBody
): Promise<T> {
  const baseHostname = "api.segmentapis.com";
  const authHeaders = { authorization: `Bearer ${token.trim()}` };
  const resp = got<T>(url, {
    prefixUrl: `https://${baseHostname}`,
    headers: {
      "User-Agent": `Segment (typewriter/${pjson.version})`,
      ...authHeaders,
    },
    followRedirect: true,
    methodRewriting: true,
    timeout: {
      request: 10_000, // ms
    },
    ...options,
  })
    // Got tries to hide the auth headers if the hostname doesn't match 1:1.
    // This is a problem since Segment API uses subdomains for EU.
    // For security we prevent leaking the Auth headers if the URL is not a subdomain of our main API URL
    .on("redirect", (_response, nextOptions) => {
      if (nextOptions.url.hostname.endsWith(baseHostname)) {
        nextOptions.headers = {
          ...nextOptions.headers,
          ...authHeaders,
        };
      }
    })
    .json<T>();

  let body: T;
  try {
    body = await resp;
  } catch (error) {
    // GOT errors are handled here
    if (error instanceof RequestError) {
      if (error instanceof HTTPError) {
        throw wrapError(
          "Permission denied by Segment API",
          error,
          `Failed while querying the ${url} endpoint`,
          "Verify you are using the right API token by running 'npx typewriter tokens'"
        );
      } else if (error instanceof TimeoutError) {
        throw wrapError(
          "Segment API request timed out",
          error,
          `Failed while querying the ${url} endpoint`
        );
      }
      throw wrapError(
        "Unknown error while querying the Segment API",
        error,
        `Failed while querying the ${url} endpoint`
      );
    }

    throw error;
  }
  return body;
}
