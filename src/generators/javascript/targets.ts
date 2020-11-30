// Helpers for mapping typewriter configuration options for module/script
// targets to TypeScript's compiler enums.
import { ModuleKind, ScriptTarget } from 'typescript'

export function toTarget(target: string | undefined): ScriptTarget {
	if (!target) {
		return ScriptTarget.ESNext
	}

	switch (target) {
		case 'ES3':
			return ScriptTarget.ES3
		case 'ES5':
			return ScriptTarget.ES5
		case 'ES2015':
			return ScriptTarget.ES2015
		case 'ES2016':
			return ScriptTarget.ES2016
		case 'ES2017':
			return ScriptTarget.ES2017
		case 'ES2018':
			return ScriptTarget.ES2018
		case 'ES2019':
			return ScriptTarget.ES2019
		case 'ESNext':
			return ScriptTarget.ESNext
		case 'Latest':
			return ScriptTarget.Latest
		default:
			throw new Error(`Invalid scriptTarget: '${target}'`)
	}
}

export function toModule(target: string | undefined): ModuleKind {
	if (!target) {
		return ModuleKind.ESNext
	}

	switch (target) {
		case 'CommonJS':
			return ModuleKind.CommonJS
		case 'AMD':
			return ModuleKind.AMD
		case 'UMD':
			return ModuleKind.UMD
		case 'System':
			return ModuleKind.System
		case 'ES2015':
			return ModuleKind.ES2015
		case 'ESNext':
			return ModuleKind.ESNext
		default:
			throw new Error(`Invalid moduleTarget: '${target}'`)
	}
}
