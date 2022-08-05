import { Config, Help, Interfaces } from "@oclif/core";
import terminalLink from "terminal-link";

export default class HelpClass extends Help {
  public formatRoot(): string {
    const trackingPlanLink = terminalLink(
      "Tracking Plan",
      "https://segment.com/docs/protocols/tracking-plan"
    );
    const learnMoreLink = terminalLink(
      "Typewriter's documentation here",
      "https://segment.com/docs/protocols/typewriter"
    );

    const description =
      `Typewriter is a tool for generating strongly-typed Segment analytics libraries based on your pre-defined ${trackingPlanLink} spec.\n\n` +
      `Learn more from ${learnMoreLink}.\n`;
    const descriptionSection = this.section(
      "DESCRIPTION",
      this.wrap(description)
    );

    const usageSection = this.section(
      this.opts.usageHeader || "USAGE",
      this.wrap(`$ ${this.config.bin} [COMMAND]`)
    );

    const versionSection = this.section(
      "VERSION",
      this.wrap(this.config.userAgent)
    );

    let output = [descriptionSection, versionSection, usageSection].join(
      "\n\n"
    );
    return output;
  }
}
