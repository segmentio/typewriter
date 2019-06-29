import * as React from 'react'
import {
	Pane,
	Button,
	Text,
	TextInput,
	Heading,
	Card,
	Checkbox,
	toaster,
	Paragraph,
	Link,
	majorScale,
} from 'evergreen-ui'
import Router from 'next/router'

interface Props {
	onSubmit: (props: { id: string; numAttempts: number; rememberMe: boolean }) => void
	onSuccess: (props: { id: string; numAttempts: number; rememberMe: boolean }) => void
	onError: (props: { id: string; numAttempts: number; rememberMe: boolean }) => void
}

interface State {
	id: string
	password: string
	rememberMe: boolean
	isLoading: boolean
	success: boolean
	numAttempts: number
}

export class LoginForm extends React.Component<Props, State> {
	public state = {
		id: '',
		password: '',
		rememberMe: true,
		isLoading: false,
		success: false,
		numAttempts: 0,
	}

	// Much secret. Many legit. 🐕
	private superSecretEncryptedUserStore: Record<string, string> = {
		// The Protocols EPD Squad 🙌
		andy: 'password',
		archana: 'password',
		caledona: 'password',
		catherine: 'password',
		colin: 'password',
		daniel: 'password',
		frances: 'password',
		francisco: 'password',
		gurdas: 'password',
		hareem: 'password',
		heidi: 'password',
		kat: 'password',
		niels: 'password',
		pengcheng: 'password',
	}

	private onChangeUserId = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			id: event.target.value,
		})
	}

	private onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			password: event.target.value,
		})
	}

	private onToggleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			rememberMe: event.target.checked,
		})
	}

	private onSubmit = () => {
		this.setState(
			prev => {
				return {
					isLoading: true,
					numAttempts: prev.numAttempts + 1,
				}
			},
			() => {
				this.props.onSubmit({
					id: this.state.id,
					rememberMe: this.state.rememberMe,
					numAttempts: this.state.numAttempts,
				})

				const fakeNetworkLatency = (Math.random() + 1) * 500
				setTimeout(() => {
					if (this.superSecretEncryptedUserStore[this.state.id] !== this.state.password) {
						// This isn't a valid login, show an error state.
						this.setState({
							isLoading: false,
						})

						toaster.danger("Hmm. That didn't work.", {
							description: 'The username or password you entered was incorrect.',
						})

						this.props.onError({
							id: this.state.id,
							rememberMe: this.state.rememberMe,
							numAttempts: this.state.numAttempts,
						})
					} else {
						// Successful login, go ahead and redirect to the user's home.
						this.setState({
							success: true,
						})

						this.props.onSuccess({
							id: this.state.id,
							rememberMe: this.state.rememberMe,
							numAttempts: this.state.numAttempts,
						})

						Router.push(`/home?id=${this.state.id}`)
					}
				}, fakeNetworkLatency)
			}
		)
	}

	public render() {
		return (
			<Pane display="flex" alignItems="center" flexDirection="column" marginTop={majorScale(12)}>
				<Card
					elevation={1}
					display="flex"
					flexDirection="column"
					width={majorScale(58)}
					padding={majorScale(4)}
					background="white"
				>
					<Pane display="flex" justifyContent="center" marginBottom={majorScale(4)}>
						<Heading size={600}>Log in to Segment</Heading>
					</Pane>
					<Text marginBottom={majorScale(1)}>Email *</Text>
					<TextInput
						value={this.state.id}
						onChange={this.onChangeUserId}
						width="100%"
						marginBottom={majorScale(2)}
						height={majorScale(5)}
					/>
					<Text marginBottom={majorScale(1)}>Password *</Text>
					<TextInput
						value={this.state.password}
						onChange={this.onChangePassword}
						width="100%"
						marginBottom={majorScale(2)}
						height={majorScale(5)}
						type="password"
					/>
					<Checkbox
						checked={this.state.rememberMe}
						onChange={this.onToggleRememberMe}
						marginBottom={majorScale(4)}
						label="Remember me?"
					/>
					<Button
						isLoading={this.state.isLoading}
						onClick={this.onSubmit}
						appearance="primary"
						intent="success"
						height={majorScale(5)}
						justifyContent="center"
						display="flex"
						type="submit"
					>
						Log in
					</Button>
					<Pane display="flex" flexDirection="column" alignItems="center" marginTop={majorScale(3)}>
						<Paragraph>
							Forgot your password? {''}
							<Link href="#" cursor="pointer" color="green">
								Reset your password
							</Link>
						</Paragraph>
						<Paragraph>
							Don&apos;t have an account? {''}
							<Link href="#" cursor="pointer" color="green">
								Sign up
							</Link>
						</Paragraph>
					</Pane>
				</Card>
			</Pane>
		)
	}
}
