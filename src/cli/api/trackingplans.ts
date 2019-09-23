import { fetchTrackingPlan, SegmentAPI } from './api'
import {
	TrackingPlanConfig,
	resolveRelativePath,
	verifyDirectoryExists,
	getConfig,
	getToken,
} from '../config'
import sortKeys from 'sort-keys'
import * as fs from 'fs'
import { promisify } from 'util'
import { flow, isEqual } from 'lodash'
import stringify from 'json-stable-stringify'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

export const TRACKING_PLAN_FILENAME = 'plan.json'

export async function loadTrackingPlan(
	configPath: string | undefined,
	config: TrackingPlanConfig
): Promise<SegmentAPI.TrackingPlan> {
	const path = resolveRelativePath(configPath, config.path, TRACKING_PLAN_FILENAME)

	// Load the Tracking Plan from the local cache.
	const plan = JSON.parse(
		await readFile(path, {
			encoding: 'utf-8',
		})
	) as SegmentAPI.TrackingPlan

	return await sanitizeTrackingPlan(plan)
}

export async function writeTrackingPlan(
	configPath: string | undefined,
	plan: SegmentAPI.TrackingPlan,
	config: TrackingPlanConfig
) {
	const path = resolveRelativePath(configPath, config.path, TRACKING_PLAN_FILENAME)
	await verifyDirectoryExists(path, 'file')

	// Perform some pre-processing on the Tracking Plan before writing it.
	const planJSON = flow<SegmentAPI.TrackingPlan, SegmentAPI.TrackingPlan, string>(
		// Enforce a deterministic ordering to reduce verson control deltas.
		plan => sortKeys(plan, { deep: true }),
		plan => stringify(plan, { space: '\t' })
	)(plan)

	await writeFile(path, planJSON, {
		encoding: 'utf-8',
	})
}

export async function sanitizeTrackingPlan(
	plan: SegmentAPI.TrackingPlan
): Promise<SegmentAPI.TrackingPlan> {
	// TODO: on JSON Schema Draft-04, required fields must have at least one element.
	// Therefore, we strip `required: []` from your rules so this error isn't surfaced.
	return plan
}

interface TrackingPlanDeltas {
	added: number
	modified: number
	removed: number
}

export function computeDelta(
	prev: SegmentAPI.TrackingPlan,
	next: SegmentAPI.TrackingPlan
): TrackingPlanDeltas {
	const deltas: TrackingPlanDeltas = {
		added: 0,
		modified: 0,
		removed: 0,
	}

	// Since we only use track calls in typewriter, we only changes to track calls.
	const nextByName: Record<string, SegmentAPI.RuleMetadata> = {}
	for (const rule of next.rules.events) {
		nextByName[rule.name] = rule
	}
	const prevByName: Record<string, SegmentAPI.RuleMetadata> = {}
	for (const rule of prev.rules.events) {
		prevByName[rule.name] = rule
	}

	for (const rule of next.rules.events) {
		const prevRule = prevByName[rule.name]
		if (!prevRule) {
			deltas.added++
		} else {
			if (prevRule.description !== rule.description || isEqual(prevRule.rules, next.rules)) {
				deltas.modified++
			}
		}
	}
	for (const rule of prev.rules.events) {
		if (!nextByName[rule.name]) {
			deltas.removed++
		}
	}

	return deltas
}

export function parseTrackingPlanName(name: string) {
	const parts = name.split('/')
	const workspaceSlug = parts[1]
	const id = parts[3]

	return {
		workspaceSlug,
		id,
		url: `https://app.segment.com/${workspaceSlug}/protocols/tracking-plans/${id}`,
	}
}
