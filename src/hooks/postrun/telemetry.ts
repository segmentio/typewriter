import { Hook } from '@oclif/core';
import { segmentClient } from '../../telemetry';

const hook: Hook<'postrun'> = async function (opts) {
  // Send any pending segment events
  await segmentClient.closeAndFlush();
};

export default hook;
