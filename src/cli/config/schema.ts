import { Options } from 'src/generators/options'
import Joi from '@hapi/joi'

/**
 * A config, stored in a typewriter.yml file.
 * If you update this inferface, make sure to also update the Joi schema (ConfigSchema) below.
 */
export type Config = {
	/** A set of optional shell commands to customize typewriter's behavior. */
	scripts?: {
		/**
		 * An optional shell command that must produce a Segment API token as its only output.
		 */
		token?: string
		/**
		 * An optional shell command executed after typewriter updates/builds clients
		 * which can be used for things like applying automatic formatting to generated files.
		 */
		after?: string
	}
	/** Metadata on how to configure a client (language, SDK, module-type, etc.). */
	client: Options
	/** Which Tracking Plans to sync locally and generate clients for. */
	trackingPlans: TrackingPlanConfig[]
}

/** Metadata on a specific Tracking Plan to generate a client for. */
export type TrackingPlanConfig = {
	/**
	 * The name of the Tracking Plan. Only set during the `init` step, so it
	 * can be added as a comment in the generated `typewriter.yml`.
	 */
	name?: string
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

// Ignore Prettier here, since otherwise prettier adds quite a bit of spacing
// that makes this schema too long+verbose.
// prettier-ignore
/** Joi schema for performing validation on typewriter.yml files. */
const ConfigSchema = Joi.object().required().keys({
	scripts: Joi.object().optional().keys({
		token: Joi.string().optional().min(1),
		after: Joi.string().optional().min(1),
	}),
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

export const validateConfig = (rawConfig: Record<string, unknown>): Config => {
	// Validate the provided configuration file using our Joi schema.
	const result = Joi.validate(rawConfig, ConfigSchema, {
		abortEarly: false,
		convert: false,
	})
	if (!!result.error) {
		throw new Error(result.error.annotate())
	}

	// We can safely type cast the config, now that is has been validated.
	return (rawConfig as unknown) as Config
}
