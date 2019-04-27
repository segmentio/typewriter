import * as fs from 'fs'
import * as Handlebars from 'handlebars'
import { promisify } from 'util'
import { resolve } from 'path'

import { File } from './gen'

const readFile = promisify(fs.readFile)

// Renders a template using the provided context, using a template
// specified relative to the `src` directory. The generated File
// will use the specified outputPath as the path name.
export async function getTemplate<Context = Record<string, any>>(
	templatePath: string,
	outputPath: string,
	context: Context
): Promise<File> {
	const path = resolve(__dirname, templatePath)

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
