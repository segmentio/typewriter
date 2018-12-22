import { genGo } from '../../../src/commands/gen-go'
import { testSnapshotSingleFile } from '../snapshots'

test('genGo - compiled output matches snapshot', async () => {
  await testSnapshotSingleFile(events => genGo(events), 'main.go')
})
