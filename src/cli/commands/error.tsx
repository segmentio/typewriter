/**
 * For Segmenters, see:
 *   https://paper.dropbox.com/doc/Typewriter-Error-Paths--AlUBLKIIcRc_9UU3_sgAh~9YAg-bdjW1EOlEHeomztWLrYWk
 */
import React, { useState, useEffect } from 'react'
import { Box, Color } from 'ink'
import Link from 'ink-link'
import figures from 'figures'
import { version } from '../../../package.json'

export interface WrappedError {
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

export function isWrappedError(error: any) {
	return typeof error === 'object' && error.isWrappedError
}

interface ErrorBoundaryProps {
	logError: (log: any) => void
}

export interface ErrorProps {
	/** Use with fatal errors to render the `ErrorComponent` boundary. */
	setError?: (error: WrappedError) => void
}

/** TODO: we need to make sure we exit with a status code if a fatal error is raised. */
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, logError }) => {
	const [err, setError] = useState<WrappedError>()

	const content = (
		<Box flexDirection="column">
			{err && <ErrorComponent error={err} logError={logError} />}
			{!err && React.cloneElement(children as React.ReactElement<any>, { setError })}
		</Box>
	)

	return content
}

interface ErrorComponentProps {
	error: any
	logError: (log: any) => void
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({ error, logError }) => {
	useEffect(() => {
		logError(error)
	}, [error])

	if (isWrappedError(error)) {
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
						. Please include that you are using version <Color yellow>{version}</Color> of
						Typewriter.
					</Color>
				</Box>
			</Box>
		)
	}

	return <Color red>{error}</Color>
}
