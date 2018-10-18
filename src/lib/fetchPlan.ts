import { JSONSchema } from 'json-schema-to-typescript'
import * as util from 'util'
import * as fs from 'fs'
import fetch from 'node-fetch'
const readFile = util.promisify(fs.readFile)

export interface TrackingPlanResponse {
  events: TrackedEvent[]
  resourceId: string
  trackingPlanName: string
}

export interface TrackedEvent {
  id: string
  description: string
  rules: JSONSchema
  name: string
  eventProperties: Property[]
}

interface Property {
  description: string
  key: string
}

export function transformTrackingPlanResponse(data: any): TrackingPlanResponse {
  return {
    events: data.events,
    resourceId: data.resourceId,
    trackingPlanName: data.name
  }
}

export const getTrackingPlanFromFile = async (path: string) => {
  const file = await readFile(path, 'utf-8')
  return transformTrackingPlanResponse(JSON.parse(file))
}

export const getTrackingPlanFromNetwork = async (
  workspaceSlug: string,
  trackingPlanId: string,
  token: string
) => {
  const options = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }

  const {
    display_name,
    rules: { events }
  } = await fetch(
    `https://platform.segmentapis.com/v1beta/workspaces/${workspaceSlug}/tracking-plans/${trackingPlanId}`,
    options
  ).then(res => res.json())

  return transformTrackingPlanResponse({
    events,
    resourceId: trackingPlanId,
    trackingPlanName: display_name
  })
}
