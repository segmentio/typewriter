import * as React from 'react'
import { LoginForm } from '../components/LoginForm'
import { signInFailed, signInSucceeded, signInSubmitted } from '../analytics'

interface Props {
	id: string
	numAttempts: number
	rememberMe: boolean
}

export default class LoginPage extends React.Component<Props> {
	private onSubmit(props: Props) {
		signInSubmitted({
			id: props.id,
			numAttempts: props.numAttempts,
			rememberMe: props.rememberMe,
		})
	}

	private onSuccess(props: Props) {
		signInSucceeded({
			id: props.id,
			numAttempts: props.numAttempts,
			rememberMe: props.rememberMe,
		})
	}

	private onError(props: Props) {
		signInFailed({
			id: props.id,
			numAttempts: props.numAttempts,
			rememberMe: props.rememberMe,
		})
	}

	public render() {
		return <LoginForm onSubmit={this.onSubmit} onSuccess={this.onSuccess} onError={this.onError} />
	}
}
