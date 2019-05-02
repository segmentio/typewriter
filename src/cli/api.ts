import fetch from 'node-fetch'
import { JSONSchema7 } from 'json-schema'

namespace SegmentAPI {
	// https://reference.segmentapis.com/#1092fe01-379b-4ca1-8b1d-9f42b33d2899
	export interface GetTrackingPlanResponse {
		name: string
		display_name: string
		rules: {
			events: RuleMetadata[]
			global: RuleMetadata
			identify: RuleMetadata
			group: RuleMetadata
		}
		create_time: Date
		update_time: Date
	}

	export interface RuleMetadata {
		name: string
		description?: string
		rules: JSONSchema7
	}
}

export interface FetchOptions {
	workspaceSlug: string
	id: string
	token: string
}

export interface TrackingPlan {
	name: string
	events: SegmentAPI.RuleMetadata[]
	identify: SegmentAPI.RuleMetadata
	group: SegmentAPI.RuleMetadata
}

export async function fetchTrackingPlan(
	options: FetchOptions
): Promise<TrackingPlan> {
	const url = `https://platform.segmentapis.com/v1beta/workspaces/${
		options.workspaceSlug
	}/tracking-plans/${options.id}`
	const {
		display_name: name,
		rules: { events, identify, group },
	} = (await fetch(url, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${options.token}`,
		},
	}).then(res => {
		if (res.ok) {
			return res.json()
		} else {
			throw new Error(
				`Error fetching Tracking Plan: ${res.status} ${res.statusText}`
			)
		}
	})) as SegmentAPI.GetTrackingPlanResponse

	return {
		name,
		events,
		identify,
		group,
	}
}
