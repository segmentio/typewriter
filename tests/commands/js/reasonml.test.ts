import { Client } from '../../../src/commands/gen-js'
import { genReasonMLDeclarations } from '../../../src/commands/gen-js/reasonml'
import { testSnapshotSingleFile } from '../snapshots'

test('genReasonMLDeclarations - compiled output matches snapshot (analytics.js)', async () => {
  await testSnapshotSingleFile(events => genReasonMLDeclarations(events, Client.js), 'index.re')
})

test('genReasonMLDeclarations - compiled output matches snapshot (analytics-node)', async () => {
  await testSnapshotSingleFile(
    events => genReasonMLDeclarations(events, Client.node),
    'index.node.re'
  )
})
