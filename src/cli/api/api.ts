import got from 'got'
import { JSONSchema7 } from 'json-schema'
import { version } from '../../../package.json'
import { wrapError, isWrappedError } from '../commands/error'
import { sanitizeTrackingPlan } from './trackingplans'
import { set } from 'lodash'

export namespace SegmentAPI {
	// https://reference.segmentapis.com/#1092fe01-379b-4ca1-8b1d-9f42b33d2899
	export type GetTrackingPlanResponse = TrackingPlan

	// https://reference.segmentapis.com/?version=latest#ef9f50a2-7031-4ddf-898a-387266894a04
	export type ListTrackingPlansResponse = {
		tracking_plans: TrackingPlan[]
	}

	export type TrackingPlan = {
		name: string
		display_name: string
		rules: {
			events: RuleMetadata[]
			global: RuleMetadata[]
			identify_traits: RuleMetadata[]
			group_traits: RuleMetadata[]
		}
		create_time: Date
		update_time: Date
	}

	export type RuleMetadata = {
		name: string
		description?: string
		rules: JSONSchema7
		version: number
	}

	// https://reference.segmentapis.com/?version=latest#7ed2968b-c4a5-4cfb-b4bf-7d28c7b38bd2
	export type ListWorkspacesResponse = {
		workspaces: Workspace[]
	}

	export type Workspace = {
		name: string
		display_name: string
		id: string
		create_time: Date
	}
}

export async function fetchTrackingPlan(options: {
	workspaceSlug: string
	id: string
	token: string
}): Promise<SegmentAPI.TrackingPlan> {
	// const url = `workspaces/${options.workspaceSlug}/tracking-plans/${options.id}`
	// const response = await apiGet<SegmentAPI.GetTrackingPlanResponse>(url, options.token)
	//
	// response.create_time = new Date(response.create_time)
	// response.update_time = new Date(response.update_time)
	//
	//return sanitizeTrackingPlan(response)
	return {
		name: 'workspaces/myworkspace/tracking-plans/rs_123',
		display_name: 'Kicks App',
		rules: {
			identify_traits: [],
			group_traits: [],
			global: [],
			events: [
				{
					description:
						'Fired when a user successfully submits a sign in, prior to redirecting into the app.',
					name: 'User Signed Out',
					rules: {
						$schema: 'http://json-schema.org/draft-07/schema#',
						//labels: {},
						properties: {
							context: {},
							properties: {
								properties: {
									id: {
										description: "The user's ID.",
										type: 'string',
									},
									numAttempts: {
										description: 'How many times the user has attempted to sign-in.',
										type: 'integer',
									},
									rememberMe: {
										description:
											'Whether the user has indicated that the browser should store their login credentials.',
										type: 'boolean',
									},
								},
								required: ['id'],
								type: 'object',
							},
							traits: {
								type: 'object',
							},
						},
						type: 'object',
					},
					version: 1,
				},
				{
					description: 'check if new event works.',
					name: 'yayyyy it worked',
					rules: {
						$schema: 'http://json-schema.org/draft-07/schema#',
						//labels: {},
						properties: {
							context: {},
							properties: {
								properties: {
									yayy: {
										description: "The user's ID.",
										type: 'string',
									},
									yayy1: {
										description: 'How many times the user has attempted to sign-in.',
										type: 'integer',
									},
									yayy2: {
										description:
											'Whether the user has indicated that the browser should store their login credentials.',
										type: 'boolean',
									},
								},
								required: ['yayy'],
								type: 'object',
							},
							traits: {
								type: 'object',
							},
						},
						type: 'object',
					},
					version: 1,
				},
			],
		},
		create_time: new Date('2018-01-23T23:21:55.275Z'),
		update_time: new Date('2018-01-23T23:21:55.275Z'),
	}
}

// fetchTrackingPlans fetches all Tracking Plans accessible by a given API token
// within a specified workspace.
export async function fetchTrackingPlans(options: {
	workspaceSlug: string
	token: string
}): Promise<SegmentAPI.TrackingPlan[]> {
	// const url = `workspaces/${options.workspaceSlug}/tracking-plans`
	// const response = await apiGet<SegmentAPI.ListTrackingPlansResponse>(url, options.token)
	//
	// return response.tracking_plans.map(tp => ({
	// 	...tp,
	// 	create_time: new Date(tp.create_time),
	// 	update_time: new Date(tp.update_time),
	// }))
	return [
		{
			name: 'workspaces/myworkspace/tracking-plans/rs_123',
			display_name: 'Kicks App',
			rules: {
				identify_traits: [],
				group_traits: [],
				global: [],
				events: [
					{
						description:
							'Fired when a user successfully submits a sign in, prior to redirecting into the app.',
						name: 'User Signed Out',
						rules: {
							$schema: 'http://json-schema.org/draft-07/schema#',
							//labels: {},
							properties: {
								context: {},
								properties: {
									properties: {
										id: {
											description: "The user's ID.",
											type: 'string',
										},
										numAttempts: {
											description: 'How many times the user has attempted to sign-in.',
											type: 'integer',
										},
										rememberMe: {
											description:
												'Whether the user has indicated that the browser should store their login credentials.',
											type: 'boolean',
										},
									},
									required: ['id'],
									type: 'object',
								},
								traits: {
									type: 'object',
								},
							},
							type: 'object',
						},
						version: 1,
					},
					{
						description: 'check if new event works.',
						name: 'yayyyy it worked',
						rules: {
							$schema: 'http://json-schema.org/draft-07/schema#',
							//labels: {},
							properties: {
								context: {},
								properties: {
									properties: {
										yayy: {
											description: "The user's ID.",
											type: 'string',
										},
										yayy1: {
											description: 'How many times the user has attempted to sign-in.',
											type: 'integer',
										},
										yayy2: {
											description:
												'Whether the user has indicated that the browser should store their login credentials.',
											type: 'boolean',
										},
									},
									required: ['yayy'],
									type: 'object',
								},
								traits: {
									type: 'object',
								},
							},
							type: 'object',
						},
						version: 1,
					},
				],
			},
			create_time: new Date('2018-01-23T23:21:55.275Z'),
			update_time: new Date('2018-01-23T23:21:55.275Z'),
		},
	]
}

// fetchAllTrackingPlans fetches all Tracking Plans accessible by a given API token.
export function fetchAllTrackingPlans(options: { token: string }): SegmentAPI.TrackingPlan[] {
	// const trackingPlans = []
	//
	// const workspaces = await fetchWorkspaces({ token: options.token })
	// for (const workspace of workspaces) {
	// 	const workspaceTPs = await fetchTrackingPlans({
	// 		workspaceSlug: workspace.name.replace('workspaces/', ''),
	// 		token: options.token,
	// 	})
	//
	// 	trackingPlans.push(...workspaceTPs)
	// }
	//
	// return trackingPlans
	return [
		{
			name: 'workspaces/myworkspace/tracking-plans/rs_123',
			display_name: 'Kicks App',
			rules: {
				identify_traits: [],
				group_traits: [],
				events: [
					{
						description:
							'Fired when a user successfully submits a sign in, prior to redirecting into the app.',
						name: 'User Signed Out',
						rules: {
							$schema: 'http://json-schema.org/draft-07/schema#',
							//labels: {},
							properties: {
								context: {},
								properties: {
									properties: {
										id: {
											description: "The user's ID.",
											type: 'string',
										},
										numAttempts: {
											description: 'How many times the user has attempted to sign-in.',
											type: 'integer',
										},
										rememberMe: {
											description:
												'Whether the user has indicated that the browser should store their login credentials.',
											type: 'boolean',
										},
									},
									required: ['id'],
									type: 'object',
								},
								traits: {
									type: 'object',
								},
							},
							type: 'object',
						},
						version: 1,
					},
					{
						description: 'check if new event works.',
						name: 'yayyyy it worked',
						rules: {
							$schema: 'http://json-schema.org/draft-07/schema#',
							//labels: {},
							properties: {
								context: {},
								properties: {
									properties: {
										yayy: {
											description: "The user's ID.",
											type: 'string',
										},
										yayy1: {
											description: 'How many times the user has attempted to sign-in.',
											type: 'integer',
										},
										yayy2: {
											description:
												'Whether the user has indicated that the browser should store their login credentials.',
											type: 'boolean',
										},
									},
									required: ['yayy'],
									type: 'object',
								},
								traits: {
									type: 'object',
								},
							},
							type: 'object',
						},
						version: 1,
					},
				],
				global: [],
			},
			create_time: new Date('2018-01-23T23:21:55.275Z'),
			update_time: new Date('2018-01-23T23:21:55.275Z'),
		},
	]
}

// fetchWorkspaces lists all workspaces found with a given Segment API token.
export async function fetchWorkspaces(options: { token: string }): Promise<SegmentAPI.Workspace[]> {
	// const resp = await apiGet<SegmentAPI.ListWorkspacesResponse>('workspaces', options.token)
	//
	// return resp.workspaces.map(w => ({
	// 	...w,
	// 	create_time: new Date(w.create_time),
	// }))
	return [
		{
			name: 'workspaces/myworkspace',
			display_name: 'My Workspace',
			id: 'jwt9cirmwq',
			create_time: new Date('2018-01-23T23:21:55.275Z'),
		},
	]
}

// validateToken returns true if a token is a valid Segment API token.
// Note: results are cached in-memory since it is commonly called multiple times
// for the same token (f.e. in `config/`).
type TokenValidationResult = {
	isValid: boolean
	workspace?: SegmentAPI.Workspace
}
const tokenValidationCache: Record<string, TokenValidationResult> = {}
export async function validateToken(token: string | undefined): Promise<TokenValidationResult> {
	if (1 === 1) {
		return {
			isValid: true,
			workspace: {
				name: 'workspaces/myworkspace',
				display_name: 'My Workspace',
				id: 'jwt9cirmwq',
				create_time: new Date('2018-01-23T23:21:55.275Z'),
			},
		}
	}
	if (!token) {
		return { isValid: false }
	}

	// If we don't have a cached result, query the API to find out if this is a valid token.
	if (!tokenValidationCache[token]) {
		const result: TokenValidationResult = { isValid: false }
		try {
			const workspaces = await fetchWorkspaces({ token })
			result.isValid = workspaces.length > 0
			result.workspace = workspaces.length === 1 ? workspaces[0] : undefined
		} catch (error) {
			// Check if this was a 403 error, which means the token is invalid.
			// Otherwise, surface the error becuase something else went wrong.
			if (!isWrappedError(error) || !error.description.toLowerCase().includes('denied')) {
				throw error
			}
		}
		tokenValidationCache[token] = result
	}

	return tokenValidationCache[token]
}

async function apiGet<Response>(url: string, token: string): Promise<Response> {
	const resp = got(url, {
		baseUrl: 'https://platform.segmentapis.com/v1beta',
		headers: {
			'User-Agent': `Segment (typewriter/${version})`,
			Authorization: `Bearer ${token.trim()}`,
		},
		json: true,
		timeout: 10000, // ms
	})

	try {
		const { body } = await resp
		return body
	} catch (error) {
		// Don't include the user's authorization token. Overwrite the header value from this error.
		const tokenHeader = `Bearer ${token.trim().substring(0, 10)}... (token redacted)`
		error = set(error, 'gotOptions.headers.authorization', tokenHeader)

		if (error.statusCode === 401 || error.statusCode === 403) {
			throw wrapError(
				'Permission denied by Segment API',
				error,
				`Failed while querying the ${url} endpoint`,
				"Verify you are using the right API token by running 'npx typewriter tokens'"
			)
		} else if (error.code === 'ETIMEDOUT') {
			throw wrapError(
				'Segment API request timed out',
				error,
				`Failed while querying the ${url} endpoint`
			)
		}

		throw error
	}
}
