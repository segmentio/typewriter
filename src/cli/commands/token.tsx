import React, { useState, useEffect, useContext } from 'react'
import { Box, Color, Text, useApp } from 'ink'
import Link from 'ink-link'
import Spinner from 'ink-spinner'
import { listTokens, ListTokensOutput, getTokenMethod, TokenMetadata } from '../config'
import { StandardProps } from '../index'
import { ErrorContext } from './error'

export const Token: React.FC<StandardProps> = props => {
	const [isLoading, setIsLoading] = useState(true)
	const [method, setMethod] = useState<string | undefined>()
	const [tokens, setTokens] = useState<ListTokensOutput | undefined>()
	const { handleFatalError } = useContext(ErrorContext)
	const { exit } = useApp()

	useEffect(() => {
		async function effect() {
			setMethod(await getTokenMethod(props.config, props.configPath))
			setTokens(await listTokens(props.config, props.configPath))
			setIsLoading(false)
			exit()
		}

		effect().catch(handleFatalError)
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

type TokenRowProps = {
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
