import * as React from 'react'
import { Home } from '../components/Home'

import { userSignedOut } from '../analytics'

interface Props {
	id: string
}

export default class HomePage extends React.Component<Props> {
	private onSignOut = (props: Props) => {
		userSignedOut({
			id: props.id,
		})
	}

	public render() {
		return <Home onSignOut={this.onSignOut} />
	}
}
