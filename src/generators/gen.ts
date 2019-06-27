import { JSONSchema7 } from 'json-schema'
import { parse, Schema } from './ast'
import javascript from './javascript'
import ios from './ios'
import { Options, SDK } from './options'

export interface File {
	path: string
	contents: string
}

export interface RawTrackingPlan {
	trackCalls: JSONSchema7[]
}

export interface TrackingPlan {
	trackCalls: {
		raw: JSONSchema7
		schema: Schema
	}[]
}

export interface GenOptions {
	// Configuration options configured by the typewriter.yml config.
	client: Options
	// The version of the Typewriter CLI that is being used to generate clients.
	// Used for analytics purposes by the Typewriter team.
	typewriterVersion: string
	// Whether or not to generate a development bundle. If so, analytics payloads will
	// be validated against the full JSON Schema before being sent to the underlying
	// analytics instance.
	isDevelopment: boolean
}

export async function gen(trackingPlan: RawTrackingPlan, options: GenOptions): Promise<File[]> {
	const parsedTrackingPlan = {
		trackCalls: trackingPlan.trackCalls.map(s => {
			const sanitizedSchema = {
				$schema: 'http://json-schema.org/draft-07/schema#',
				...s,
			}

			return {
				raw: sanitizedSchema,
				schema: parse(sanitizedSchema),
			}
		}),
	}

	if (options.client.sdk === SDK.WEB || options.client.sdk === SDK.NODE) {
		return await javascript(parsedTrackingPlan, options)
	} else if (options.client.sdk === SDK.IOS) {
		return await ios(parsedTrackingPlan, options)
	} else {
		throw new Error(`Invalid SDK: ${options.client.sdk}`)
	}
}

export interface TemplateBaseContext {
	isDevelopment: boolean
	language: string
	typewriterVersion: string
}

export function baseContext(options: GenOptions): TemplateBaseContext {
	return {
		isDevelopment: options.isDevelopment,
		language: options.client.language,
		typewriterVersion: options.typewriterVersion,
	}
}
