/**
 * Type definitions for Segment's analytics.js library.
 */

/**
 * The analytics.js snippet should be available via window.analytics.
 * You can install it by following instructions at: https://segment.com/docs/sources/website/analytics.js/quickstart/
 */
declare global {
	interface Window {
		analytics?: AnalyticsJS
	}
}

/** A minimal interface for Segment's analytics.js. */
export interface AnalyticsJS {
	track: (
		event: string,
		properties?: Record<string, any>,
		options?: Options,
		callback?: Callback
	) => void
}

/** The callback exposed by analytics.js. */
export type Callback = () => void

/** A dictionary of options. For example, enable or disable specific destinations for the call. */
export interface Options {
	/**
	 * Selectivly filter destinations. By default all destinations are enabled.
	 * https://segment.com/docs/sources/website/analytics.js/#selecting-destinations
	 */
	integrations?: {
		All?: boolean
		AppsFlyer?: {
			appsFlyerId: string
		}
		[key: string]: boolean | { [key: string]: any }
	}
	/**
	 * A dictionary of extra context to attach to the call.
	 * https://segment.com/docs/spec/common/#context
	 */
	context?: Context
}

/**
 * Context is a dictionary of extra information that provides useful context about a datapoint.
 * @see {@link https://segment.com/docs/spec/common/#context}
 */
export interface Context extends Record<string, any> {
	active?: boolean
	app?: {
		name?: string
		version?: string
		build?: string
	}
	campaign?: {
		name?: string
		source?: string
		medium?: string
		term?: string
		content?: string
	}
	device?: {
		id?: string
		manufacturer?: string
		model?: string
		name?: string
		type?: string
		version?: string
	}
	ip?: string
	locale?: string
	location?: {
		city?: string
		country?: string
		latitude?: string
		longitude?: string
		region?: string
		speed?: string
	}
	network?: {
		bluetooth?: string
		carrier?: string
		cellular?: string
		wifi?: string
	}
	os?: {
		name?: string
		version?: string
	}
	page?: {
		hash?: string
		path?: string
		referrer?: string
		search?: string
		title?: string
		url?: string
	}
	referrer?: {
		type?: string
		name?: string
		url?: string
		link?: string
	}
	screen?: {
		density?: string
		height?: string
		width?: string
	}
	timezone?: string
	groupId?: string
	traits?: Record<string, any>
	userAgent?: string
}
