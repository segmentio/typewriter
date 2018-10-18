import { Options } from 'yargs'
import {
  getTrackingPlanFromFile,
  getTrackingPlanFromNetwork,
  TrackingPlanResponse
} from './fetchPlan'
export { TrackedEvent } from './fetchPlan'

export type HandlerFn = (params: Params, events: TrackingPlanResponse) => Promise<any>
export interface Params {
  trackingPlanId?: string
  workspaceSlug?: string
  outputPath?: string
  inputPath?: string
  token?: string
}

export const builder: { [key: string]: Options } = {
  inputPath: {
    type: 'string',
    required: false,
    description: 'The path to a local tracking plan file',
    conflicts: ['trackingPlanId', 'workspaceSlug', 'token']
  },
  trackingPlanId: {
    type: 'string',
    required: false,
    description: 'The resource id for a Tracking Plan',
    conflicts: ['inputPath']
  },
  workspaceSlug: {
    type: 'string',
    required: false,
    description: 'A slug that corresponds to the workspace that contains the Tracking Plan',
    conflicts: ['inputPath']
  },
  token: {
    type: 'string',
    required: false,
    description: 'The Segment Platform API Personal App Token',
    conflicts: ['inputPath']
  },
  outputPath: {
    type: 'string',
    required: false,
    description: 'The output path for the files'
  }
}

export function getTypedTrackHandler(fn: HandlerFn) {
  return async (params: Params) => {
    const { workspaceSlug, trackingPlanId, outputPath, inputPath, token } = params
    const fetchPlan = inputPath
      ? getTrackingPlanFromFile(inputPath)
      : getTrackingPlanFromNetwork(workspaceSlug, trackingPlanId, token)

    const events = await fetchPlan

    await fn(params, events)
    console.log(`Files written to ${outputPath}`)
  }
}
