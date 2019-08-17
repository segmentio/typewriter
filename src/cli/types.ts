import { JSONSchema7 } from 'json-schema'
import { Options } from 'src/generators/options'
import Joi from '@hapi/joi'

export interface Arguments {
	/** Any commands passed in to a yargs CLI. */
	_: string[]
	/** An optional path to a typewriter.yml (or directory with a typewriter.yml). **/
	config: string | undefined
}

/**
 * A config, stored in a typewriter.yml file.
 * If you update this inferface, make sure to also update the Joi schema (ConfigSchema) below.
 */
export interface Config {
	/**
	 * A shell command that must produce a Segment API token as its only output.
	 * If not specified, your environment's TYPEWRITER_TOKEN will be used.
	 */
	tokenCommand?: string
	/** Metadata on how to configure a client (language, SDK, module-type, etc.). */
	client: Options
	/** Which Tracking Plans to sync locally and generate clients for. */
	trackingPlans: TrackingPlanConfig[]
}

// Ignore Prettier here, since otherwise prettier adds quite a bit of spacing
// that makes this schema too long+verbose.
// prettier-ignore
/** Joi schema for performing validation on typewriter.yml files. */
export const ConfigSchema = Joi.object().required().keys({
	tokenCommand: Joi.string().optional().min(1),
	client: Joi.object().required().keys({
		sdk: Joi.string().required().valid('analytics.js', 'analytics-node', 'analytics-android', 'analytics-ios'),
		language: Joi.string().required().valid('javascript', 'typescript', 'java', 'swift', 'objective-c'),
	})
		.when('sdk', {
			is: Joi.string().valid('analytics.js', 'analytics-node'),
			then: {
				language: Joi.string().valid('javascript', 'typescript'),
				scriptTarget: Joi.string().optional().valid( 'ES3', 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ESNext', 'Latest'),
				moduleTarget: Joi.string().optional().valid('CommonJS', 'AMD', 'UMD', 'System', 'ES2015', 'ESNext'),
			},
		})
		.when('sdk', {
			is: Joi.string().valid('analytics-android'),
			then: { language: Joi.string().valid('java') },
		})
		.when('sdk', {
			is: Joi.string().valid('analytics-ios'),
			then: { language: Joi.string().valid('swift', 'objective-c') },
		}),
	trackingPlans: Joi.array().required().items(
		Joi.object().keys({
			id: Joi.string().required().min(1),
			workspaceSlug: Joi.string().required().min(1),
			path: Joi.string().required().min(1),
		})
	),
})

/** Metadata on a specific Tracking Plan to generate a client for. */
export interface TrackingPlanConfig {
	/** The id of the Tracking Plan to generate a client for. */
	id: string
	/** The slug of the Segment workspace that owns this Tracking Plan. */
	workspaceSlug: string
	/**
	 * A directory path relative to this typewriter.yml file, specifying where
	 * this Tracking Plan's client should be output.
	 */
	path: string
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
}
