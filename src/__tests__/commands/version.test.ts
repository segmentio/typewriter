import * as oclif from "@oclif/core";
import { stdout, stderr } from "stdout-stderr";

describe("version", () => {
  it("works", async () => {
    oclif.settings.debug = true;
    oclif.settings.tsnodeEnabled = true;
    stdout.start();
    await oclif.run(["version"]);
    stdout.stop();
    expect(stdout.output).toMatch(/Version: \d/);
  });
});
