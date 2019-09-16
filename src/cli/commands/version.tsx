import React, { useState, useEffect } from 'react'
import { Box, Color } from 'ink'
import { version as typewriterVersion } from '../../../package.json'
import latest from 'latest-version'

export const version: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [latestVersion, setLatestVersion] = useState('')

	useEffect(() => {
		latest('typewriter', { version: 'next' }).then(latestVersion => {
			setLatestVersion(latestVersion)
			setIsLoading(false)
		})
	}, [])

	const isLatest = isLoading || latestVersion === typewriterVersion
	const newVersionText = isLoading
		? '(checking for newer versions...)'
		: !isLatest
		? `(new! ${latestVersion})`
		: ''

	return (
		<Box>
			<Color grey>Version: </Color>
			<Color green={isLatest} yellow={!isLatest}>
				{typewriterVersion}{' '}
			</Color>
			<Color grey={isLatest} green={!isLatest}>
				{newVersionText}
			</Color>
		</Box>
	)
}
