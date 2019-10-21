declare module 'ink-spinner' {
	interface SpinnerProps {
		/** See: https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json */
		type: string
	}
	/** https://github.com/vadimdemedes/ink-spinner */
	const Spinner: React.FC<SpinnerProps>

	export default Spinner
}
