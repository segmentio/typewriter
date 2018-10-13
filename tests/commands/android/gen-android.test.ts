import { genJava } from '../../../src/commands/gen-android'
import { testSnapshotMultiFile } from '../snapshots'

test('genJava - compiled output matches snapshot', async () => {
  testSnapshotMultiFile(events => genJava(events, {
    package: 'com.segment.analytics',
    trackingPlan: 'Test Tracking Plan',
    language: 'objectivec'
  }))
})
