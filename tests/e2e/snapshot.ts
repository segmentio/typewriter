/**
 * Fetches all analytics calls for a specific test from the sidecar
 * and snapshots them to a specified directory.
 */
import * as fs from 'fs'
import { promisify } from 'util'
import sortKeys from 'sort-keys'
import { resolve } from 'path'
import fetch from 'node-fetch'
import { flow } from 'lodash'

const writeFile = promisify(fs.writeFile)

const SIDECAR_ADDRESS = 'http://localhost:8765'

// ts-node snapshot.ts [path]
if (process.argv.length !== 3) {
	throw new Error('You must pass a path for storing snapshots: `$ ts-node snapshots.ts [path]`')
}
const path = process.argv[2]

const run = async () => {
	const resp = await fetch(`${SIDECAR_ADDRESS}/messages`)
	const messages = await resp.json()

	const snapshots = messages.map((m: object) => {
		return flow<object, object, string, string>(
			msg => sortKeys(msg, { deep: true }),
			msg => JSON.stringify(msg, undefined, 4),
			msg => '```json\n' + msg + '\n```'
		)(m)
	})
	const snapshot = snapshots.join('\n\n')

	// TODO: compare the snapshots and print a diff, if necessary

	await writeFile(resolve(path, 'snapshots.md'), snapshot)
}

run()
