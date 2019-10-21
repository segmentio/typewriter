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
	SWIFT = 'swift',
}

export interface JavaScriptOptions {
	sdk: SDK.WEB | SDK.NODE
	language: Language.JAVASCRIPT
	// JavaScript transpilation settings:
	scriptTarget?:
		| 'ES3'
		| 'ES5'
		| 'ES2015'
		| 'ES2016'
		| 'ES2017'
		| 'ES2018'
		| 'ES2019'
		| 'ESNext'
		| 'Latest'
	moduleTarget?: 'CommonJS' | 'AMD' | 'UMD' | 'System' | 'ES2015' | 'ESNext'
}

export interface TypeScriptOptions {
	sdk: SDK.WEB | SDK.NODE
	language: Language.TYPESCRIPT
}

export interface ObjectiveCOptions {
	sdk: SDK.IOS
	language: Language.OBJECTIVE_C
}

export interface SwiftOptions {
	sdk: SDK.IOS
	language: Language.SWIFT
}

export type Options = JavaScriptOptions | TypeScriptOptions | ObjectiveCOptions | SwiftOptions
