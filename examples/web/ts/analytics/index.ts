import KicksAppAnalytics from './generated'

declare global {
  interface Window {
    analytics: any
  }
}

const appAnalytics = new KicksAppAnalytics(window.analytics)

export default appAnalytics
