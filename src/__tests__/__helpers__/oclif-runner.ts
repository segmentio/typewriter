import * as oclif from "@oclif/core";
import { stdout, stderr } from "stdout-stderr";

export const run = async (argv: string[]) => {
  oclif.settings.debug = true;
  oclif.settings.tsnodeEnabled = true;
  stdout.start();
  stderr.start();
  const onError = (reason: any) => {
    console.error(reason);
  };
  await oclif.run(argv).catch(onError);
  stdout.stop();
  stderr.stop();

  return {
    stdout: stdout.output,
    stderr: stderr.output,
  };
};
