import * as fs from 'fs'
import * as Handlebars from 'handlebars'
import { promisify } from 'util'
import { resolve } from 'path'

const readFile = promisify(fs.readFile)

/**
 * Header used to mark generated files that are safe to remove during generation.
 * This note needs to be in every generated file (except plan.json), otherwise
 * that file will not be cleaned up before client generation. This can be placed
 * anywhere in a file, though prefer placing it at the top of every file.
 *
 * If you change this, make sure to update the Build step to recognize previous
 * versions of this header when identifying files safe to remove.
 */
export const SEGMENT_AUTOGENERATED_FILE_WARNING =
	'This client was automatically generated by Segment Typewriter. ** Do Not Edit **'

// Renders a string generated from a template using the provided context.
// The template path is relative to the `src` directory.
export async function generateFromTemplate<Context extends Record<string, unknown>>(
	templatePath: string,
	context: Context,
	needsWarning?: boolean
): Promise<string> {
	const path = resolve(__dirname, templatePath)
	const template = await readFile(path, {
		encoding: 'utf-8',
	})
	const templater = Handlebars.compile(template, {
		noEscape: true,
	})

	const content = templater(context)

	if (needsWarning && !content.includes(SEGMENT_AUTOGENERATED_FILE_WARNING)) {
		throw new Error(
			`This autogenerated file (${templatePath}) is missing a warning, and therefore will not be cleaned up in future runs.`
		)
	}

	return content
}

export async function registerPartial(partialPath: string, partialName: string): Promise<void> {
	const path = resolve(__dirname, partialPath)
	const template = await readFile(path, {
		encoding: 'utf-8',
	})
	const templater = Handlebars.compile(template, {
		noEscape: true,
	})

	Handlebars.registerPartial(partialName, templater)
}

export async function registerStandardHelpers(): Promise<void> {
	// Register a helper for indenting multi-line output from other helpers.
	Handlebars.registerHelper('indent', (indentation: string, content: string) => {
		return content.split('\n').join(`\n${indentation}`).trim()
	})
	// Register a helper to output a warning that a given file was automatically
	// generated by Typewriter. Note that the exact phrasing is important, since
	// it is used to clear generated files. See `clearFolder` in `commands.ts`.
	Handlebars.registerHelper('autogeneratedFileWarning', () => {
		return SEGMENT_AUTOGENERATED_FILE_WARNING
	})
}
