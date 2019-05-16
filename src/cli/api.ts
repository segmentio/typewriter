import fetch from 'node-fetch'
import { JSONSchema7 } from 'json-schema'

namespace SegmentAPI {
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

export async function fetchTrackingPlan(options: {
	workspaceSlug: string
	id: string
	token: string
}): Promise<SegmentAPI.TrackingPlan> {
	const url = `https://platform.segmentapis.com/v1beta/workspaces/${
		options.workspaceSlug
	}/tracking-plans/${options.id}`
	const response = (await apiGet(
		url,
		options.token
	)) as SegmentAPI.GetTrackingPlanResponse

	// eslint-disable-next-line @typescript-eslint/camelcase
	response.create_time = new Date(response.create_time)
	// eslint-disable-next-line @typescript-eslint/camelcase
	response.update_time = new Date(response.update_time)

	return response
}

// fetchTrackingPlans fetches all Tracking Plans accessible by a given API token
// within a specified workspace.
export async function fetchTrackingPlans(options: {
	workspaceSlug: string
	token: string
}): Promise<SegmentAPI.TrackingPlan[]> {
	const url = `https://platform.segmentapis.com/v1beta/workspaces/${
		options.workspaceSlug
	}/tracking-plans`
	const response = (await apiGet(
		url,
		options.token
	)) as SegmentAPI.ListTrackingPlansResponse

	// eslint-disable-next-line @typescript-eslint/camelcase
	return response.tracking_plans.map(tp => ({
		...tp,
		// eslint-disable-next-line @typescript-eslint/camelcase
		create_time: new Date(tp.create_time),
		// eslint-disable-next-line @typescript-eslint/camelcase
		update_time: new Date(tp.update_time),
	}))
}

// fetchAllTrackingPlans fetches all Tracking Plans accessible by a given API token.
export async function fetchAllTrackingPlans(options: {
	token: string
}): Promise<SegmentAPI.TrackingPlan[]> {
	const trackingPlans = []

	const workspaces = await fetchWorkspaces({ token: options.token })
	for (var workspace of workspaces) {
		const workspaceTPs = await fetchTrackingPlans({
			workspaceSlug: workspace.name.replace('workspaces/', ''),
			token: options.token,
		})

		trackingPlans.push(...workspaceTPs)
	}

	return trackingPlans
}

// fetchWorkspaces lists all workspaces found with a given Segment API token.
export async function fetchWorkspaces(options: {
	token: string
}): Promise<SegmentAPI.Workspace[]> {
	const { workspaces } = (await apiGet(
		'https://platform.segmentapis.com/v1beta/workspaces',
		options.token
	)) as SegmentAPI.ListWorkspacesResponse

	return workspaces.map(w => ({
		...w,
		// eslint-disable-next-line @typescript-eslint/camelcase
		create_time: new Date(w.create_time),
	}))
}

// isValidToken returns true if a token is a valid Segment API token.
export async function isValidToken(options: {
	token: string
}): Promise<boolean> {
	try {
		const workspaces = await fetchWorkspaces(options)
		return workspaces.length > 0
	} catch {
		return false
	}
}

export async function generateToken(options: {
	workspaceSlug: string
	email: string
	password: string
}): Promise<string> {
	const basicAuthToken = Buffer.from(
		`${options.email.trim()}:${options.password.trim()}`
	).toString('base64')

	const { token } = (await fetch(
		'https://platform.segmentapis.com/v1beta/access-tokens',
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${basicAuthToken}`,
			},
			body: JSON.stringify({
				// eslint-disable-next-line @typescript-eslint/camelcase
				access_token: {
					description: 'Automatically Generated Typewriter Token',
					scopes: 'workspace:read',
					// eslint-disable-next-line @typescript-eslint/camelcase
					workspace_names: [`workspaces/${options.workspaceSlug}`],
				},
			}),
		}
	).then(res => {
		if (res.ok) {
			return res.json()
		} else {
			throw new Error(
				`Error fetching API Token from Segment API: ${res.status} ${
					res.statusText
				}`
			)
		}
	})) as SegmentAPI.CreateAccessTokenResponse

	return token
}

async function apiGet(url: string, token: string): Promise<object> {
	return fetch(url, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token.trim()}`,
		},
	}).then(res => {
		if (res.ok) {
			return res.json()
		} else {
			throw new Error(
				`Error issuing GET to Segment API (${url}): ${res.status} ${
					res.statusText
				}`
			)
		}
	})
}
