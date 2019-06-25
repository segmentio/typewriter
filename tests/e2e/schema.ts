import Joi from '@hapi/joi'

// Messages are expected to conform to this schema, to be considered valid Segment
// payloads.
const baseSegmentPayloadSchema = Joi.object().keys({})

// Messages sent from our mobile SDKs are expected to match this schema to be considered
// valid Segment payloads.
const mobileSegmentPayloadSchema = Joi.object().keys({})

export function validateSegmentEvent(payload: object): Joi.ValidationError | undefined {
	for (let schema of [baseSegmentPayloadSchema, mobileSegmentPayloadSchema]) {
		const { error } = Joi.validate(payload, schema, {
			abortEarly: false,
			allowUnknown: true,
		})
		if (error) {
			return error
		}
	}

	return undefined
}
