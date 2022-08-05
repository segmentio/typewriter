import { expect, test } from "@oclif/test";

describe("version", () => {
  test
    .stdout()
    .command(["version"])
    .it("shows version", (ctx) => {
      expect(ctx.stdout).to.contain("Version: 0.0.0 (new! 7.4.1)");
    });
});
