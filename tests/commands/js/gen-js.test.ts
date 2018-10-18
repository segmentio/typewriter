import { genJS } from '../../../src/commands/gen-js'
import { testSnapshotSingleFile } from '../snapshots'
import { ScriptTarget, ModuleKind } from 'typescript'

test('genJS - compiled output matches snapshot (Default ESNext module system)', async () => {
  testSnapshotSingleFile(events => genJS(events), 'index.js')
})

test('genJS - compiled output matches snapshot (UMD Modules)', async () => {
  testSnapshotSingleFile(
    events => genJS(events, ScriptTarget.ESNext, ModuleKind.UMD),
    'index.umd.js'
  )
})

test('genJS - compiled output matches snapshot (AMD Modules)', async () => {
  testSnapshotSingleFile(
    events => genJS(events, ScriptTarget.ESNext, ModuleKind.AMD),
    'index.amd.js'
  )
})

test('genJS - compiled output matches snapshot (System Modules)', async () => {
  testSnapshotSingleFile(
    events => genJS(events, ScriptTarget.ESNext, ModuleKind.System),
    'index.system.js'
  )
})
