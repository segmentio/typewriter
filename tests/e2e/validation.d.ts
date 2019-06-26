// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Joi from '@hapi/joi'

// Declare types for the custom matchers we use in suite.test.ts.
declare global {
	namespace jest {
		interface Matchers<R> {
			toHaveBeenReceived: (schema?: Joi.SchemaMap) => void
			toHaveBeenReceivedMultipleTimes: (schemas?: Joi.SchemaMap[]) => void
		}
	}
}
