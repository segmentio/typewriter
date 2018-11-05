const Analytics = require('analytics-node');
const KicksAppAnaytics = require('./generated').default

const SEGMENT_WRITE_KEY = 'iSFVwV0lsjCP2EQDw2QKfkzdRAOrKVs4'

const analytics = new Analytics(SEGMENT_WRITE_KEY);
const appAnalytics = new KicksAppAnaytics(analytics)

module.exports = appAnalytics
