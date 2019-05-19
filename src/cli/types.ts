import { JavaScriptOptions, TypeScriptOptions } from '../generators/javascript'
import { JSONSchema7 } from 'json-schema'

export interface Arguments {
	config: string | undefined
}

// A config, stored in a typewriter.yml file.
// If you update this inferface, make sure to keep `typewriter.yml.schema.json` in sync.
export interface Config {
	tokenCommand?: string
	language: JavaScriptOptions | TypeScriptOptions
	trackingPlans: TrackingPlanConfig[]
}

export interface TrackingPlanConfig {
	name?: string
	id: string
	workspaceSlug: string
	path: string
	events?: {
		// Note: when we support Event Versioning in the Config API,
		// then we will support numeric values here, which will map to versions.
		[key: string]: 'latest'
	}
}

export namespace SegmentAPI {
	// https://reference.segmentapis.com/#1092fe01-379b-4ca1-8b1d-9f42b33d2899
	export type GetTrackingPlanResponse = TrackingPlan

	// https://reference.segmentapis.com/?version=latest#ef9f50a2-7031-4ddf-898a-387266894a04
	export interface ListTrackingPlansResponse {
		tracking_plans: TrackingPlan[]
	}

	export interface TrackingPlan {
		name: string
		display_name: string
		rules: {
			events: RuleMetadata[]
			global: RuleMetadata
			identify_traits: RuleMetadata
			group_traits: RuleMetadata
		}
		create_time: Date
		update_time: Date
	}

	export interface RuleMetadata {
		name: string
		description?: string
		rules: JSONSchema7
	}

	// https://reference.segmentapis.com/?version=latest#7ed2968b-c4a5-4cfb-b4bf-7d28c7b38bd2
	export interface ListWorkspacesResponse {
		workspaces: Workspace[]
	}

	export interface Workspace {
		name: string
		display_name: string
		id: string
		create_time: Date
	}

	export interface CreateAccessTokenResponse {
		name: string
		description: string
		scopes: string
		create_time: Date
		token: string
		workspace_names: string[]
	}
}
