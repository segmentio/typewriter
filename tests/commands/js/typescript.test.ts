import { Client } from '../../../src/commands/gen-js'
import { genTSDeclarations } from '../../../src/commands/gen-js/typescript'
import { testSnapshotSingleFile } from '../snapshots'

test('genTSDeclarations - compiled output matches snapshot (analytics.js)', async () => {
  await testSnapshotSingleFile(events => genTSDeclarations(events, Client.js), 'index.d.ts')
})

test('genTSDeclarations - compiled output matches snapshot (analytics-node)', async () => {
  await testSnapshotSingleFile(events => genTSDeclarations(events, Client.node), 'index.node.d.ts')
})
