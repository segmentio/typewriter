import React, { useState, useEffect } from 'react'
import { Text, Box, Color } from 'ink'
import { Config, resolveRelativePath } from '../config'
import { runGenerator, getInitialState, StepState } from './gen'
import { TrackingPlanConfig } from '../config/schema'
import { TRACKING_PLAN_FILENAME } from '../api'
import Spinner from 'ink-spinner'

interface Props {
	/** Path to typewriter.yml */
	configPath: string
	/** typewriter.yml contents */
	config?: Config
	/** Whether or not to generate a production client. Defaults to false. */
	production: boolean
	/** Whether or not to update the local `plan.json` with the latest Tracking Plan. Defaults to true. */
	update: boolean
}

export const build: React.FC<Props> = props => {
	const [generatorState, setGeneratorState] = useState(getInitialState(props.config!))

	useEffect(() => {
		// async iterators, oh my! just gonna use await syntax here.
		;(async () => {
			// TODO: multiple tracking plans
			const progress = runGenerator(
				props.configPath,
				props.config!,
				props.config!.trackingPlans[0],
				{
					production: props.production,
					update: props.update,
				}
			)

			for await (const step of progress) {
				// Note: we copy the state here s.t. React can identify that it needs to re-render.
				setGeneratorState({ ...step })
			}
		})()
	}, [])

	return (
		<Box marginBottom={1} marginTop={1} flexDirection="column">
			{Object.entries(generatorState.steps).map(([k, step]) => {
				return (
					<Step
						key={k}
						{...step}
						stepKey={k}
						trackingPlanConfig={props.config!.trackingPlans[0]}
						production={props.production}
						update={props.update}
					/>
				)
			})}
		</Box>
	)
}

interface StepProps {
	running: boolean
	done: boolean
	stepKey: string
	production: boolean
	update: boolean
	trackingPlanConfig: TrackingPlanConfig
}

const Step: React.FC<StepProps> = props => {
	const names: Record<string, JSX.Element> = {
		clearFiles: <Text>Removing any previously generated files</Text>,
		loadPlan: props.update ? (
			<Text>
				Downloading latest Tracking Plan into{' '}
				{props.trackingPlanConfig.path + '/' + TRACKING_PLAN_FILENAME}
			</Text>
		) : (
			<Text>
				Loading Tracking Plan from {props.trackingPlanConfig.path + '/' + TRACKING_PLAN_FILENAME}
			</Text>
		),
		generateClient: (
			<Text>
				Generating a <Text>{props.production ? 'production' : 'development'}</Text> Typewriter
				client in <Text>{props.trackingPlanConfig.path}</Text>
			</Text>
		),
		afterScript: <Text>Cleaning up</Text>,
	}

	return (
		<Box>
			<Box width={3} justifyContent="center">
				{props.running ? <Spinner type="dots" /> : props.done ? '✔' : ''}
			</Box>{' '}
			<Box width={50}>
				<Color grey>{names[props.stepKey]}</Color>
			</Box>
		</Box>
	)
}
