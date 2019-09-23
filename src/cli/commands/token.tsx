import React, { useState, useEffect } from 'react'
import { Box, Color, Text } from 'ink'
import Link from 'ink-link'
import Spinner from 'ink-spinner'
import { listTokens, ListTokensOutput, getTokenMethod, TokenMetadata } from '../config'
import { StandardProps } from '../index'
import { ErrorProps } from './error'

interface Props extends StandardProps, ErrorProps {}

export const Token: React.FC<Props> = props => {
	const [isLoading, setIsLoading] = useState(true)
	const [method, setMethod] = useState<string | undefined>()
	const [tokens, setTokens] = useState<ListTokensOutput | undefined>()
	useEffect(() => {
		async function effect() {
			setMethod(await getTokenMethod(props.config))
			setTokens(await listTokens(props.config))
			setIsLoading(false)
		}

		effect().catch(props.setError)
	}, [])

	if (isLoading) {
		return (
			<Box marginLeft={2} marginTop={1} marginBottom={1}>
				<Spinner type="dots" /> <Color grey>Loading...</Color>
			</Box>
		)
	}

	return (
		<Box marginTop={1} marginBottom={1} marginLeft={2} flexDirection="column">
			<Box flexDirection="column">
				<TokenRow name="scripts.token" tokenMetadata={tokens && tokens.script} method={method} />
				<TokenRow name="~/.typewriter" tokenMetadata={tokens && tokens.file} method={method} />
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
	tokenMetadata?: TokenMetadata
	method?: string
	name: string
}

const TokenRow: React.FC<TokenRowProps> = ({ tokenMetadata, method, name }) => {
	const isSelected = tokenMetadata && method === tokenMetadata.method

	return (
		<Box flexDirection="row">
			<Color green={isSelected} grey={!isSelected}>
				<Box width={20}>{name}:</Box>
				<Box width={15}>
					{tokenMetadata && tokenMetadata.token
						? `${tokenMetadata.token.slice(0, 10)}...`
						: '(None)'}
				</Box>
				{tokenMetadata && !!tokenMetadata.token && !tokenMetadata.isValidToken ? (
					<Box width={10}>
						<Color red={true}>(invalid token)</Color>
					</Box>
				) : (
					<Box width={10}>
						{tokenMetadata && tokenMetadata.workspace ? tokenMetadata.workspace.name : ''}
					</Box>
				)}
			</Color>
		</Box>
	)
}
