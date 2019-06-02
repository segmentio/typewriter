import { ScriptTarget, ModuleKind } from 'typescript'

// Which Segment SDK to generate for.
export enum SDK {
	WEB = 'analytics.js',
	NODE = 'analytics-node',
	IOS = 'analytics-ios',
}

// Which language to generate clients for.
export enum Language {
	JAVASCRIPT = 'javascript',
	TYPESCRIPT = 'typescript',
	OBJECTIVE_C = 'objective-c',
}

export interface JavaScriptOptions {
	sdk: SDK.WEB | SDK.NODE
	language: Language.JAVASCRIPT
	// JavaScript transpilation settings:
	scriptTarget?: ScriptTarget
	moduleTarget?: ModuleKind
}

export interface TypeScriptOptions {
	sdk: SDK.WEB | SDK.NODE
	language: Language.TYPESCRIPT
}

export interface ObjectiveCOptions {
	sdk: SDK.IOS
	language: Language.OBJECTIVE_C
}

export type Options = JavaScriptOptions | TypeScriptOptions | ObjectiveCOptions
