import { JSONSchema } from 'json-schema-to-typescript'
import * as request from 'request-promise-native'
import * as util from 'util'
import * as fs from 'fs'
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

export const getTrackingPlanFromNetwork = async (id: string, token: string) => {
  const data: any = await request({
    uri: `https://beta.segment.com/dq/v1/tracking_plans/${id}`,
    auth: {
      user: token,
      pass: '',
      sendImmediately: true
    }
  })

  return transformTrackingPlanResponse(JSON.parse(data))
}
