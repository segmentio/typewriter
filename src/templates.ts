import * as fs from 'fs'
import * as Handlebars from 'handlebars'
import { promisify } from 'util'
import { resolve } from 'path'

const readFile = promisify(fs.readFile)

// Renders a string generated from a template using the provided context.
// The template path is relative to the `src` directory.
export async function generateFromTemplate<Context = Record<string, any>>(
	templatePath: string,
	context: Context
): Promise<string> {
	const path = resolve(__dirname, templatePath)

	const template = await readFile(path, {
		encoding: 'utf-8',
	})
	const templater = Handlebars.compile(template, {
		noEscape: true,
	})

	return templater(context)
}
