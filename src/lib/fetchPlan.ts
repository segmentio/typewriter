import { JSONSchema } from 'json-schema-to-typescript'
import * as util from 'util'
import * as fs from 'fs'
import fetch from 'node-fetch'
import { dx as trycatch } from '@nucleartide/dx'
const readFile = util.promisify(fs.readFile)
import { basename, extname } from 'path'

export interface TrackingPlan {
  events: TrackedEvent[]
  name: string
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

export const getTrackingPlanFromFile = async (path: string): Promise<TrackingPlan> => {
  const file = await readFile(path, 'utf-8')

  const [json, err] = trycatch(JSON.parse)(file)
  if (err) {
    console.error(`Unable to parse JSON: ${path}`)
    throw err
  }

  if (!json.events) {
    throw new Error(`Missing "events" array in JSON Schema: ${path}`)
  }

  const fileName = basename(path, extname(path))

  return {
    events: json.events,
    name: fileName
  }
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
  ).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      throw new Error(`Error fetching Tracking Plan: ${res.status} ${res.statusText}`)
    }
  })

  return {
    events,
    name: display_name
  }
}
