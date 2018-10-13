import { genTS } from '../../../src/commands/gen-ts'
import { testSnapshotSingleFile } from '../snapshots'

test('genTS - compiled output matches snapshot', async () => {
  testSnapshotSingleFile(events => genTS(events), 'index.ts')
})
