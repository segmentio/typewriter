import { genJS } from '../../../src/commands/gen-js'
import { testSnapshotSingleFile } from '../snapshots'

test('genJS - compiled output matches snapshot', async () => {
  testSnapshotSingleFile(events => genJS(events), 'index.js')
})