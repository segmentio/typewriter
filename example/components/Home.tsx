import React from 'react'
import { Pane, Button, majorScale, Card, Paragraph, Text, Link } from 'evergreen-ui'
import Router, { withRouter } from 'next/router'
import { get } from 'lodash'

interface Props {
	onSignOut: (props: { id: string }) => void
}

class HomeComponent extends React.Component<Props> {
	private onSignOut = () => {
		const id = get(this.props, 'router.query.id')

		this.props.onSignOut({
			id,
		})

		Router.push('/login')
	}

	public render() {
		return (
			<Pane display="flex" flexDirection="column">
				<Pane
					display="flex"
					elevation={1}
					width="100%"
					backgroundColor="white"
					height={majorScale(6)}
					padding={majorScale(1)}
					justifyContent="flex-end"
				>
					<Button onClick={this.onSignOut}>Sign Out</Button>
				</Pane>
				<Pane display="flex" flexDirection="row" justifyContent="center" marginTop={majorScale(6)}>
					<Card elevation={1} width={majorScale(70)} background="white" padding={majorScale(4)}>
						<Paragraph>
							<Text>
								Getting started with Typewriter is as simple as:
								<pre>npx typewriter@next init</pre>
							</Text>
						</Paragraph>
						<Paragraph>
							<Text>
								You can learn more from our documentation: {''}
								<Link target="_blank" href="https://segment.com/docs/protocols/typewriter">
									https://segment.com/docs/protocols/typewriter
								</Link>
							</Text>
						</Paragraph>
					</Card>
				</Pane>
			</Pane>
		)
	}
}

export const Home = withRouter(HomeComponent)
