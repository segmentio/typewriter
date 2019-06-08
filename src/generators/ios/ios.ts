import { File, TrackingPlan, GenOptions } from '../gen'
import { generateFromTemplate } from '../../templates'

// The context that will be passed to Handlebars to perform rendering.
// Everything in this context should be properly sanitized.
interface TemplateContext {
	isDevelopment: boolean
	language: string
	typewriterVersion: string

	// TODO: ...
}

export default async function(trackingPlan: TrackingPlan, options: GenOptions): Promise<File[]> {
	const ctx = getContext(trackingPlan, options)

	return [
		{
			path: 'SEGTypewriterAnalytics.h',
			contents: await generateFromTemplate<TemplateContext>('generators/ios/header.hbs', ctx),
		},
		{
			path: 'SEGTypewriterAnalytics.m',
			contents: await generateFromTemplate<TemplateContext>(
				'generators/ios/implementation.hbs',
				ctx
			),
		},
	]
}

function getContext(_: TrackingPlan, options: GenOptions): TemplateContext {
	// Render a TemplateContext based on the set of event schemas.
	const context: TemplateContext = {
		isDevelopment: options.isDevelopment,
		language: options.client.language,
		typewriterVersion: options.typewriterVersion,
	}

	// TODO

	return context
}
