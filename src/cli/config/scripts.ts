import * as childProcess from 'child_process'
import { promisify } from 'util'
import { wrapError } from '../commands/error'

const exec = promisify(childProcess.exec)

export enum Scripts {
	After = 'After',
	Token = 'Token',
}

const EXEC_TIMEOUT = 5000 // ms

export async function runScript(
	script: string,
	configPath: string,
	type: Scripts
): Promise<string> {
	const scriptWithCD = `cd ${configPath}; ${script}`
	const { stdout } = await exec(scriptWithCD, { timeout: EXEC_TIMEOUT }).catch(err => {
		const { stderr = '' } = err
		const firstStdErrLine = stderr.split('\n')[0]
		// This child process will be SIGTERM-ed if it times out.
		throw wrapError(
			err.signal === 'SIGTERM' ? `${type} script timed out` : `${type} script failed`,
			err,
			`Tried running: '${script}'`,
			firstStdErrLine
		)
	})

	return stdout
}
