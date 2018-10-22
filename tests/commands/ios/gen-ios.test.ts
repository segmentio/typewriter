import { genObjC } from '../../../src/commands/gen-ios'
import { testSnapshotMultiFile } from '../snapshots'

test('genObjC - compiled output matches snapshot', async () => {
  await testSnapshotMultiFile(events =>
    genObjC(events, {
      trackingPlan: 'Test Tracking Plan',
      language: 'objectivec',
      classPrefix: 'SEG'
    })
  )
})
