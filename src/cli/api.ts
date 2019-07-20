import fetch from 'node-fetch'
import { SegmentAPI } from './types'

export async function fetchTrackingPlan(options: {
	workspaceSlug: string
	id: string
	token: string
}): Promise<SegmentAPI.TrackingPlan> {
	const url = `https://platform.segmentapis.com/v1beta/workspaces/${
		options.workspaceSlug
	}/tracking-plans/${options.id}`
	const response = (await apiGet(url, options.token)) as SegmentAPI.GetTrackingPlanResponse

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
	const response = (await apiGet(url, options.token)) as SegmentAPI.ListTrackingPlansResponse

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
export async function fetchWorkspaces(options: { token: string }): Promise<SegmentAPI.Workspace[]> {
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
export async function isValidToken(token: string): Promise<boolean> {
	try {
		const workspaces = await fetchWorkspaces({ token })
		return workspaces.length > 0
	} catch {
		return false
	}
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
			throw new Error(`Error issuing GET to Segment API (${url}): ${res.status} ${res.statusText}`)
		}
	})
}
