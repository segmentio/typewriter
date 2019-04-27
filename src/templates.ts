import * as fs from 'fs'
import * as Handlebars from 'handlebars'
import { promisify } from 'util'
import { resolve } from 'path'
import callerPath from 'caller-path'

import { File } from './gen'

const readFile = promisify(fs.readFile)

export async function getTemplate<Context = Record<string, any>>(
	templatePath: string,
	outputPath: string,
	context: Context
): Promise<File> {
	const path = resolve(callerPath(), templatePath)

	// Render the Handlebars template using the generated Context.
	const template = await readFile(path, {
		encoding: 'utf-8',
	})
	const templater = Handlebars.compile(template, {
		noEscape: true,
	})

	return {
		path: outputPath,
		contents: templater(context),
	}
}
