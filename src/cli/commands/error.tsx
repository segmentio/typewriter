/**
 * For Segmenters, see:
 *   https://paper.dropbox.com/doc/Typewriter-Error-Paths--AlUBLKIIcRc_9UU3_sgAh~9YAg-bdjW1EOlEHeomztWLrYWk
 */
import React, { createContext } from 'react'
import { Box, Color } from 'ink'
import Link from 'ink-link'
import figures from 'figures'
import { version } from '../../../package.json'
import { DebugContext } from '../index'

interface ErrorContextProps {
	/** Called to indicate that a non-fatal error has occurred. This will be printed only in debug mode. */
	handleError: (error: WrappedError) => void
	/** Called to indicate that a fatal error has occurred, which will render the Error component. */
	handleFatalError: (error: WrappedError) => void
}
export const ErrorContext = createContext<ErrorContextProps>({
	handleError: () => {},
	handleFatalError: () => {},
})

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

export function isWrappedError(error: unknown) {
	return !!error && typeof error === 'object' && (error as any).isWrappedError
}

function toUnexpectedError(error: Error): WrappedError {
	return wrapError('An unexpected error occurred.', error, error.message)
}

interface ErrorBoundaryProps {
	/**
	 * If an error is passed as a prop, then it's considered a fatal error.
	 * Most errors will be raised via getDerivedStateFromError or the ErrorContext
	 * handlers, however errors that happen outside of the render path can force
	 * an error to be rendered via this prop.
	 */
	error?: Error
}

interface ErrorBoundaryState {
	error?: WrappedError
}

/**
 * We use a class component here, because we need access to the getDerivedStateFromError
 * lifecycle method, which is not yet supported by React Hooks.
 *
 * NOTE: this component will not overwrite the component that threw the error.
 * 		See: https://github.com/vadimdemedes/ink/issues/234
 *
 * TODO: we need to make sure we exit with a non-zero status code when handleFatalError
 * 		is called.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	public state: ErrorBoundaryState = {}

	public static getDerivedStateFromProps(props: ErrorBoundaryProps, state: ErrorBoundaryState) {
		return {
			error: state.error || (props.error ? toUnexpectedError(props.error) : undefined),
		}
	}

	public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return { error: toUnexpectedError(error) }
	}

	/** For non-fatal errors, we just log the error when in debug mode. */
	private handleError = (debug: boolean) => {
		return (error: WrappedError) => {
			if (debug) {
				console.trace(error)
			}
		}
	}

	/** For fatal errors, we halt the CLI by rendering an ErrorComponent. */
	private handleFatalError = (debug: boolean) => {
		const handleError = this.handleError(debug)

		return (error: WrappedError) => {
			handleError(error)
			this.setState({ error })
		}
	}

	public render() {
		const { children } = this.props
		const { error } = this.state

		return (
			<DebugContext.Consumer>
				{({ debug }) => {
					const context = {
						handleError: this.handleError(debug),
						handleFatalError: this.handleFatalError(debug),
					}

					return (
						<ErrorContext.Provider value={context}>
							<Box flexDirection="column">
								{error && <ErrorComponent error={error} />}
								{!error && children}
							</Box>
						</ErrorContext.Provider>
					)
				}}
			</DebugContext.Consumer>
		)
	}
}

interface ErrorComponentProps {
	error: WrappedError
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
	return (
		<Box flexDirection="column" marginLeft={2} marginRight={2} marginTop={1} marginBottom={1}>
			<Box width={80} textWrap="wrap">
				<Color red>
					{figures.cross} Error: {error.description}
				</Color>
			</Box>
			{error.notes.map(n => (
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
