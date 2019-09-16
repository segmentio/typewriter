import React, { useState, useEffect } from 'react'
import { Box, Color, Text } from 'ink'
import Link from 'ink-link'
import Spinner from 'ink-spinner'
import { Config } from '../config'
import { listTokens, ListTokensOutput, getTokenMethod, TokenMetadata } from '../config'

interface Props {
	config?: Config
}

export const token: React.FC<Props> = props => {
	const [tokens, setTokens] = useState<ListTokensOutput | undefined>()
	const [method, setMethod] = useState<string | undefined>(undefined)
	useEffect(() => {
		getTokenMethod(props.config).then(output => {
			setMethod(output)
			listTokens(props.config).then(output => {
				setTokens(output)
			})
		})
	}, [])

	if (!tokens || !method) {
		return (
			<Box marginLeft={2} marginTop={1} marginBottom={1}>
				<Spinner type="dots" /> <Color grey>Loading...</Color>
			</Box>
		)
	}

	return (
		<Box marginTop={1} marginBottom={1} marginLeft={2} flexDirection="column">
			<Box flexDirection="column">
				<TokenRow name="TYPEWRITER_TOKEN" tokenMetadata={tokens.env} method={method} />
				<TokenRow name="scripts.token" tokenMetadata={tokens.script} method={method} />
				<TokenRow name="~/.typewriter" tokenMetadata={tokens.file} method={method} />
			</Box>
			<Box marginTop={1} width={80} textWrap="wrap">
				<Color grey>
					<Text bold>Tip:</Text> For more information on configuring an API token, see the{' '}
					<Link url="https://segment.com/docs/protocols/typewriter/#api-token-configuration">
						online docs
					</Link>
					.
				</Color>
			</Box>
		</Box>
	)
}

interface TokenRowProps {
	tokenMetadata: TokenMetadata
	method: string
	name: string
}

const TokenRow: React.FC<TokenRowProps> = props => {
	const isSelected = props.method === props.tokenMetadata.method

	return (
		<Box flexDirection="row">
			<Color green={isSelected} grey={!isSelected}>
				<Box width={20}>{props.name}:</Box>
				<Box width={15}>
					{props.tokenMetadata.token ? `${props.tokenMetadata.token.slice(0, 10)}...` : '(None)'}
				</Box>
				{!!props.tokenMetadata.token && !props.tokenMetadata.isValidToken ? (
					<Box width={10}>
						<Color red={true}>(invalid token)</Color>
					</Box>
				) : (
					<Box width={10}>
						{props.tokenMetadata.workspace ? props.tokenMetadata.workspace.name : ''}
					</Box>
				)}
			</Color>
		</Box>
	)
}
