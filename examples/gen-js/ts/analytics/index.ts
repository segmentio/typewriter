import Analytics from './generated'

declare global {
  interface Window {
    analytics: any
  }
}

export default Analytics
