import { Hook } from '@oclif/core';
import { kotlin, supportedLanguages, swift, typescript, javascript } from '../../languages';

const hook: Hook<'init'> = async function (opts) {
  // We inject any new languages plugins might support here
  supportedLanguages.push(swift, kotlin, typescript, javascript);
};

export default hook;
