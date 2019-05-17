/**
 * Type definitions for Segment's analytics-node library.
 */

/** A minimal interface for Segment's analytics-node. */
export interface AnalyticsNode {
	track: (
		message: TrackMessage<Record<string, any>>,
		callback?: Callback
	) => void
}

/**
 * TrackMessage represents a message payload for an analytics `.track()` call.
 * See: https://segment.com/docs/spec/track/
 */
export interface TrackMessage<PropertiesType> extends Record<string, any> {
	/** The ID for this user in your database. */
	userId: string | number
	/** An ID to associated with the user when you don’t know who they are. */
	anonymousId?: string | number
	/** A dictionary of properties for the event. */
	properties?: PropertiesType
	/**
	 * A Javascript date object representing when the track took place.
	 * If the track just happened, leave it out and we’ll use the server’s
	 * time. If you’re importing data from the past make sure you to send
	 * a timestamp.
	 */
	timestamp?: Date
	/**
	 * A dictionary of extra context to attach to the call.
	 * https://segment.com/docs/spec/common/#context
	 */
	context?: Context
	/**
	 * A dictionary of destination names that the message should be sent to.
	 * By default all destinations are enabled. 'All' is a special key that
	 * applies when no key for a specific destination is found.
	 * https://segment.com/docs/spec/common/#integrations
	 */
	integrations?: {
		All?: boolean
		AppsFlyer?: {
			appsFlyerId: string
		}
		[key: string]: boolean | { [key: string]: string } | undefined
	}
}

/** The callback exposed by analytics-node. */
export type Callback = (err: Error) => void

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
