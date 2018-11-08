import { dirname } from 'path'

import { toMatchFile } from 'jest-file-snapshot'
import { SerializedRenderResult } from 'quicktype-core'

import { TrackedEvent } from '../../src/lib/fetchPlan'
import * as trackingPlan from '../__fixtures__/tracking-plan-fixture.json'

expect.extend({ toMatchFile })

export type SingleFileGenerator = (events: TrackedEvent[]) => Promise<string>
export type MultiFileGenerator = (
  events: TrackedEvent[]
) => Promise<ReadonlyMap<string, SerializedRenderResult>>

export async function testSnapshotSingleFile(fn: SingleFileGenerator, fileName: string) {
  const result = await fn(trackingPlan.events)

  expect(result).toMatchFile(`${dirname(module.parent.filename)}/__snapshots__/${fileName}`)
}

export async function testSnapshotMultiFile(fn: MultiFileGenerator) {
  const results = await fn(trackingPlan.events)

  results.forEach((file, fileName) => {
    expect(file.lines.join('\n')).toMatchFile(
      `${dirname(module.parent.filename)}/__snapshots__/${fileName}`
    )
  })
}
