import { AnalyticsBrowser, AnalyticsSnippet } from '@segment/analytics-next';
import typewriter from '../runtime-tests/fixtures/typescript-analytics-js'

typewriter.setTypewriterOptions({ analytics: {} as AnalyticsBrowser });
typewriter.setTypewriterOptions({ analytics: {} as AnalyticsSnippet});
