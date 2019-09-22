// How many events were pulled down? How many were changed?
// 		+10 ~3 -1

import React, { useState, useEffect } from 'react'
import { Box, Color } from 'ink'
import { Config } from '../../config'
import { run, getInitialState, StepState } from './run'
import { TrackingPlanConfig } from '../../config/schema'
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

export const Build: React.FC<Props> = props => {
	const [generatorState, setGeneratorState] = useState(getInitialState(props.config!))

	useEffect(() => {
		;(async () => {
			// TODO: multiple tracking plans
			const progress = run(props.configPath, props.config!, props.config!.trackingPlans[0], {
				production: props.production,
				update: props.update,
			})

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
						step={step}
						stepName={k}
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
	stepName: string
	step: StepState
	production: boolean
	update: boolean
	trackingPlanConfig: TrackingPlanConfig
}

const Step: React.FC<StepProps> = props => {
	const stepDescriptions: Record<string, string> = {
		clearFiles: 'Removing generated files',
		loadPlan: 'Loading Tracking Plan',
		generateClient: 'Generating Typewriter client',
		afterScript: 'Cleaning up',
	}

	return (
		<Box flexDirection="column">
			{/* Print the description and running state of this step. */}
			<Color white>
				<Box width={3} justifyContent="center">
					{props.step.running ? (
						<Spinner type="dots" />
					) : props.step.done ? (
						<Color green> ✔</Color>
					) : (
						''
					)}
				</Box>
				<Box marginLeft={1} width={70}>
					{stepDescriptions[props.stepName]}
				</Box>
			</Color>
			{/* Print any notes/warnings on this step. */}
			{props.step.notes.map(note => (
				<Color
					grey={!note.type || note.type === 'note'}
					yellow={note.type === 'warning'}
					key={note.key || String(note.text)}
				>
					<Box marginLeft={4}>{note.type === 'warning' ? '⚠' : '↪'}</Box>
					<Box marginLeft={2} width={70} textWrap="wrap">
						{note.text}
					</Box>
				</Color>
			))}
		</Box>
	)
}
