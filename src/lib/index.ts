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
  clientID?: string
  clientSecret?: string
}

export const builder: { [key: string]: Options } = {
  trackingPlanId: {
    type: 'string',
    required: false,
    description: 'The resource id for a Tracking Plan',
    implies: ['workspaceSlug']
  },
  workspaceSlug: {
    type: 'string',
    required: false,
    description: 'A slug that corresponds to the workspace that contains the Tracking Plan',
    implies: ['trackingPlanId']
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
  },
  clientID: {
    type: 'string',
    required: false,
    description: 'The Segment Platform API App client id',
    conflicts: ['inputPath']
  },
  clientSecret: {
    type: 'string',
    required: false,
    description: 'The Segment Platform API App client secret',
    conflicts: ['inputPath']
  }
}

export function getTypedTrackHandler(fn: HandlerFn) {
  return async (params: Params) => {
    const { workspaceSlug, trackingPlanId, outputPath, inputPath, clientID, clientSecret } = params
    const fetchPlan = inputPath
      ? getTrackingPlanFromFile(inputPath)
      : getTrackingPlanFromNetwork(workspaceSlug, trackingPlanId, clientID, clientSecret)

    const events = await fetchPlan

    await fn(params, events)
    console.log(`Files written to ${outputPath}`)
  }
}
