import { Options } from 'yargs'
import {
  getTrackingPlanFromFile,
  getTrackingPlanFromNetwork,
  TrackingPlanResponse
} from './fetchPlan'
export { TrackedEvent } from './fetchPlan'

export type HandlerFn = (params: Params, events: TrackingPlanResponse) => Promise<any>
export interface Params {
  id?: string
  token?: string
  outputPath?: string
  inputPath?: string
}

export const builder: { [key: string]: Options } = {
  id: {
    type: 'string',
    required: false,
    description: 'The resource id for a Tracking Plan'
  },
  token: {
    type: 'string',
    required: false,
    description: 'The auth token for a user'
  },
  outputPath: {
    type: 'string',
    required: false,
    description: 'The output path for the files'
  },
  inputPath: {
    type: 'string',
    required: false,
    description: 'The path to a local tracking plan file'
  }
}

export function getTypedTrackHandler(fn: HandlerFn) {
  return async (params: Params) => {
    const { id, token, outputPath, inputPath } = params
    const fetchPlan = inputPath
      ? getTrackingPlanFromFile(inputPath)
      : getTrackingPlanFromNetwork(id, token)

    const events = await fetchPlan

    await fn(params, events)
    console.log(`Files written to ${outputPath}`)
  }
}
