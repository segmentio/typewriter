import React, { useState, useEffect } from 'react'
import { Box, Color } from 'ink'
import { version as typewriterVersion } from '../../../package.json'
import latest from 'latest-version'
import { StandardProps } from '../index'
import { ErrorProps } from './error'

interface Props extends StandardProps, ErrorProps {}

export const Version: React.FC<Props> = ({ logError }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [latestVersion, setLatestVersion] = useState('')

	useEffect(() => {
		async function effect() {
			try {
				const latestVersion = await latest('typewriter', { version: 'next' })
				setLatestVersion(latestVersion)
			} catch (err) {
				// If we can't access NPM, then ignore this check.
				logError(err)
			}
			setIsLoading(false)
		}

		effect()
	}, [])

	const isLatest = isLoading || latestVersion === '' || latestVersion === typewriterVersion
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

Version.displayName = 'Version'
