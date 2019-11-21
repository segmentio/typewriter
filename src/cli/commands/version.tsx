import React, { useState, useEffect, useContext } from 'react'
import { Box, Color, useApp } from 'ink'
import { version as typewriterVersion } from '../../../package.json'
import latest from 'latest-version'
import { StandardProps } from '../index'
import { ErrorContext } from './error'
import semver from 'semver'

export const Version: React.FC<StandardProps> = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [latestVersion, setLatestVersion] = useState('')
	const { handleError } = useContext(ErrorContext)
	const { exit } = useApp()

	useEffect(() => {
		async function effect() {
			try {
				let options: latest.Options = {}

				// If the user is on a pre-release, check if there's a new pre-release.
				// Otherwise, only compare against stable versions.
				const prerelease = semver.prerelease(typewriterVersion)
				if (prerelease && prerelease.length > 0) {
					options = { version: 'next' }
				}

				const latestVersion = await latest('typewriter', options)
				setLatestVersion(latestVersion)
			} catch (error) {
				// If we can't access NPM, then ignore this version check.
				handleError(error)
			}
			setIsLoading(false)
			exit()
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
