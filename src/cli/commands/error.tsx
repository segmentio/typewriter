/**
 * For Segmenters, see:
 *   https://paper.dropbox.com/doc/Typewriter-Error-Paths--AlUBLKIIcRc_9UU3_sgAh~9YAg-bdjW1EOlEHeomztWLrYWk
 */
import React, { useEffect } from 'react'
import { Box, Color } from 'ink'
import Link from 'ink-link'
import figures from 'figures'
import { version } from '../../../package.json'

interface WrappedError {
	isWrappedError: true
	description: string
	notes: string[]
	error: Error
}

/** Helper to wrap an error with a human-readable description. */
export function wrapError(description: string, error: Error, ...notes: string[]): WrappedError {
	return {
		isWrappedError: true,
		description,
		notes,
		error,
	}
}

interface ErrorProps {
	error: any
	logError: (log: any) => void
}

export const ErrorComponent: React.FC<ErrorProps> = ({ error, logError }) => {
	useEffect(() => {
		logError(error)
	}, [error])

	if (typeof error === 'object' && error.isWrappedError) {
		const wrappedError = error as WrappedError

		return (
			<Box flexDirection="column" marginLeft={2} marginRight={2} marginTop={1} marginBottom={1}>
				<Box width={80} textWrap="wrap">
					<Color red>
						{figures.cross} Error: {wrappedError.description}
					</Color>
				</Box>
				{wrappedError.notes.map(n => (
					<Box width={80} textWrap="wrap" key={n}>
						<Color grey>↪ {n}</Color>
					</Box>
				))}
				<Box height={2} width={80} textWrap="wrap" marginTop={1}>
					<Color grey>
						If you are unable to resolve this issue,{' '}
						<Link url="https://github.com/segmentio/typewriter/issues/new">
							open an issue on GitHub
						</Link>
						. Please include that you are running version <Color yellow>{version}</Color> of
						Typewriter.
					</Color>
				</Box>
			</Box>
		)
	}

	return <Color red>{error}</Color>
}
