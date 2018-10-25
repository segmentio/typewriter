import { genJS, Client } from '../../../src/commands/gen-js'
import { testSnapshotSingleFile } from '../snapshots'
import { ScriptTarget, ModuleKind } from 'typescript'

test('genJS - compiled output matches snapshot (Default ESNext module system)', async () => {
  await testSnapshotSingleFile(events => genJS(events), 'index.js')
})

test('genJS - compiled output matches snapshot (UMD Modules)', async () => {
  await testSnapshotSingleFile(
    events => genJS(events, ScriptTarget.ESNext, ModuleKind.UMD),
    'index.umd.js'
  )
})

test('genJS - compiled output matches snapshot (AMD Modules)', async () => {
  await testSnapshotSingleFile(
    events => genJS(events, ScriptTarget.ESNext, ModuleKind.AMD),
    'index.amd.js'
  )
})

test('genJS - compiled output matches snapshot (System Modules)', async () => {
  await testSnapshotSingleFile(
    events => genJS(events, ScriptTarget.ESNext, ModuleKind.System),
    'index.system.js'
  )
})

test('genJS - compiled output matches snapshot (analytics-node)', async () => {
  await testSnapshotSingleFile(
    events => genJS(events, ScriptTarget.ES2017, ModuleKind.CommonJS, Client.node),
    'index.node.js'
  )
})
