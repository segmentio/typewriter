import { AnalyticsBrowser, AnalyticsSnippet } from "@segment/analytics-next";
// @ts-ignore
import typewriter from "../build/typescript-analytics-js";

() => {
  typewriter.setTypewriterOptions({ analytics: {} as AnalyticsBrowser });
  typewriter.setTypewriterOptions({ analytics: {} as AnalyticsSnippet });
}
