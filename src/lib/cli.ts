import { Options } from 'yargs'
import { getTrackingPlanFromFile, TrackingPlan } from './api'
export { TrackedEvent } from './api'

export type HandlerFn = (params: Params, plan: TrackingPlan) => Promise<any>
export interface Params {
  outputPath?: string
  inputPath: string
}

export const builder: { [key: string]: Options } = {
  inputPath: {
    type: 'string',
    required: false,
    description: 'The path to a local tracking plan file'
  },
  outputPath: {
    type: 'string',
    required: false,
    description: 'The output path for the files'
  }
}

export function getTypedTrackHandler(fn: HandlerFn) {
  return async (params: Params) => {
    const { inputPath, outputPath } = params

    const events = await getTrackingPlanFromFile(inputPath)

    await fn(params, events)
    console.log(`Files written to ${outputPath}`)
  }
}
