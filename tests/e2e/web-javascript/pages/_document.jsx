import React from 'react'
import Document, { Main, NextScript } from 'next/document'
import * as snippet from '@segment/snippet'

export default class SSRDoc extends Document {
	render() {
		// Generate and inject the Segment analytics.js snippet.
		const snippetFn = process.env.NODE_ENV === 'production' ? snippet.min : snippet.max

		// For testing purposes, we redirect the CDN request for analytics.js
		// through the sidecar:
		// https://github.com/segmentio/snippet/blob/564a594e5284ae6469bb4e864cabde66ce7f0c1b/template/snippet.js#L67
		// where the sidecar will mutate the analytics.js script to forward
		// requests to the sidecar (by replacing https://api.segment.io links
		// with http://localhost:8765). This avoids the need to configure SSL
		// support in the sidecar, with extra steps to add a new CA for
		// self-signed certificates. In the future, we may want to explore
		// adding support for a "localhost"-compatible analytics.js script.
		// See https://github.com/segmentio/mock for more details.
		const analyticsSnippet = snippetFn({
			apiKey: 'L7XFg6RtddWxeZbWX9gxiAWVIvAeDPKR',
			page: false,
			host: 'localhost:8765',
		}).replace('https', 'http')

		return (
			<html>
				<body>
					<Main />
					<NextScript />

					<script dangerouslySetInnerHTML={{ __html: analyticsSnippet }} />
				</body>
			</html>
		)
	}
}
