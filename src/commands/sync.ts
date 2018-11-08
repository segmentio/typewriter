import { Options } from 'yargs'

import * as fs from 'fs'
import * as util from 'util'
import { dirname } from 'path'
import { getTrackingPlanFromNetwork } from '../lib/fetchPlan'
import { preprocessRules } from '../lib/utils'
import * as prettier from 'prettier'
const writeFile = util.promisify(fs.writeFile)
const stat = util.promisify(fs.stat)

interface Params {
  trackingPlanId: string
  workspaceSlug: string
  token: string
  outputPath: string
}

export const command = 'sync'
export const desc = 'Pull down a JSON Schema from a Protocols Tracking Plan'
export const builder: { [key: string]: Options } = {
  trackingPlanId: {
    type: 'string',
    required: true,
    description: 'The resource id of your Tracking Plan'
  },
  workspaceSlug: {
    type: 'string',
    required: true,
    description: 'A slug that corresponds to the workspace that contains your Tracking Plan'
  },
  token: {
    type: 'string',
    required: true,
    description: 'Your Segment Platform API Personal App Token'
  },
  outputPath: {
    type: 'string',
    required: true,
    description: 'The output path for the JSON Schema'
  }
}

async function validateParams(params: Params): Promise<Params> {
  const { trackingPlanId, workspaceSlug, token, outputPath } = params

  if (!/^rs_.*$/.test(trackingPlanId)) {
    throw new Error(`Invalid --trackingPlanId ('${trackingPlanId}')`)
  }

  if (workspaceSlug.length === 0) {
    throw new Error(`Invalid --workspaceSlug ('${workspaceSlug}')`)
  }

  // Two 43 character URL-safe (RFC 4648) base64 strings, separated by a period.
  if (!/^[a-zA-Z0-9-_=]{43}\.[a-zA-Z0-9-_=]{43}$/.test(token)) {
    throw new Error(`Invalid --token ('${token}')`)
  }

  await stat(dirname(outputPath)).catch(_ => {
    throw new Error(`Invalid --outputPath: file directory doesn't exist ('${outputPath}')`)
  })
  await stat(outputPath)
    .then(stats => {
      if (stats.isDirectory()) {
        throw new Error(`Invalid --outputPath: outputPath can't be a directory ('${outputPath}')`)
      }
    })
    .catch(_ => null)

  return params
}

export const handler = async (params: Params) => {
  const { trackingPlanId, workspaceSlug, token, outputPath } = await validateParams(params)

  const plan = await getTrackingPlanFromNetwork(workspaceSlug, trackingPlanId, token)

  const json = JSON.stringify(preprocessRules(plan))
  const output = prettier.format(json, { parser: 'json' })
  await writeFile(outputPath, output)

  console.log(`\nSynced Tracking Plan (${plan.name}) to: ${outputPath}\n`)
}
