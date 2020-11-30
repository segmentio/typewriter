/**
 * For Segmenters, see:
 *   https://paper.dropbox.com/doc/Typewriter-Error-Paths--AlUBLKIIcRc_9UU3_sgAh~9YAg-bdjW1EOlEHeomztWLrYWk
 */
import React, { createContext, useEffect } from 'react'
import { Box, Color, useApp } from 'ink'
import Link from 'ink-link'
import figures from 'figures'
import { version } from '../../../package.json'
import { AnalyticsProps } from '../index'
import typewriter from '../../analytics'

type ErrorContextProps = {
	/** Called to indicate that a non-fatal error has occurred. This will be printed only in debug mode. */
	handleError: (error: WrappedError) => void
	/** Called to indicate that a fatal error has occurred, which will render the Error component. */
	handleFatalError: (error: WrappedError) => void
}
export const ErrorContext = createContext<ErrorContextProps>({
	handleError: () => {},
	handleFatalError: () => {},
})

export type WrappedError = {
	isWrappedError: true
	description: string
	notes: string[]
	error?: Error
}

/** Helper to wrap an error with a human-readable description. */
export function wrapError(description: string, error?: Error, ...notes: string[]): WrappedError {
	return {
		isWrappedError: true,
		description,
		notes,
		error,
	}
}

export function isWrappedError(error: unknown): error is WrappedError {
	return !!error && typeof error === 'object' && (error as Record<string, boolean>).isWrappedError
}

export function toUnexpectedError(error: Error): WrappedError {
	if (isWrappedError(error)) {
		return error
	}

	return wrapError('An unexpected error occurred.', error, error.message)
}

type ErrorBoundaryProps = AnalyticsProps & {
	/**
	 * If an error is passed as a prop, then it's considered a fatal error.
	 * Most errors will be raised via getDerivedStateFromError or the ErrorContext
	 * handlers, however errors that happen outside of the render path can force
	 * an error to be rendered via this prop.
	 */
	error?: Error
	debug: boolean
}

type ErrorBoundaryState = {
	error?: WrappedError
}

/**
 * We use a class component here, because we need access to the getDerivedStateFromError
 * lifecycle method, which is not yet supported by React Hooks.
 *
 * NOTE: it's important that the CLI runs in NODE_ENV=production when packaged up,
 *    otherwise, React will print a warning preventing this component from overwriting
 *    the error-ed component. See: https://github.com/vadimdemedes/ink/issues/234
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	public state: ErrorBoundaryState = {}

	public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return { error: toUnexpectedError(error) }
	}

	public componentDidCatch(error: Error): void {
		this.reportError({
			error: toUnexpectedError(error),
			fatal: true,
		})
	}

	public componentDidMount(): void {
		if (this.props.error) {
			const err = toUnexpectedError(this.props.error)
			this.reportError({
				error: err,
				fatal: true,
			})
			this.setState({ error: err })
		}
	}

	private reportError = async (params: { error: WrappedError; fatal: boolean }) => {
		const { anonymousId, analyticsProps } = this.props

		typewriter.errorFired({
			properties: {
				...analyticsProps,
				error_string: JSON.stringify(params.error, undefined, 2),
				unexpected: params.fatal,
				error: params.error,
			},
			anonymousId,
		})

		if (this.props.debug) {
			console.trace(params.error)
		}
	}

	/** For non-fatal errors, we just log the error when in debug mode. */
	private handleError = async (error: WrappedError) => {
		await this.reportError({
			error,
			fatal: false,
		})
	}

	/** For fatal errors, we halt the CLI by rendering an ErrorComponent. */
	private handleFatalError = async (error: WrappedError) => {
		await this.reportError({
			error,
			fatal: true,
		})
		this.setState({ error })
	}

	public render(): JSX.Element {
		const { children } = this.props
		const { error } = this.state

		const context = {
			handleError: this.handleError,
			handleFatalError: this.handleFatalError,
		}

		return (
			<ErrorContext.Provider value={context}>
				<Box flexDirection="column">
					{error && <ErrorComponent error={error} />}
					{!error && children}
				</Box>
			</ErrorContext.Provider>
		)
	}
}

type ErrorComponentProps = {
	error: WrappedError
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
	const { exit } = useApp()
	// Wrap the call to `exit` in a `useEffect` so that it fires after rendering.
	useEffect(() => {
		exit(error.error)
	}, [])

	return (
		<Box flexDirection="column" marginLeft={2} marginRight={2} marginTop={1} marginBottom={1}>
			<Box width={80} textWrap="wrap">
				<Color red>
					{figures.cross} Error: {error.description}
				</Color>
			</Box>
			{error.notes &&
				error.notes.map(n => (
					<Box key={n}>
						<Box marginLeft={1} marginRight={1}>
							<Color grey>{figures.arrowRight}</Color>
						</Box>
						<Box width={80} textWrap="wrap">
							<Color grey>{n}</Color>
						</Box>
					</Box>
				))}
			<Box height={2} width={80} textWrap="wrap" marginTop={1}>
				<Color grey>
					If you are unable to resolve this issue,{' '}
					<Link url="https://github.com/segmentio/typewriter/issues/new">
						open an issue on GitHub
					</Link>
					. Please include that you are using version <Color yellow>{version}</Color> of Typewriter.
				</Color>
			</Box>
		</Box>
	)
}
