#!/usr/bin/env bun
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { runAgent } from "./agents/cli.ts";
import { startTUI } from "./tui/index.tsx";
import { DEFAULT_CONFIG } from "./utils/config.ts";

async function main() {
  try {
    const yargsInstance = yargs(hideBin(process.argv))
      .options({
        task: { alias: "t", type: "string", description: "Task description or GitHub issue to solve" },
        model: { alias: "m", type: "string", description: "LLM model to use", default: DEFAULT_CONFIG.MODEL },
        "token-limit": {
          alias: "l",
          type: "number",
          description: "Maximum token limit",
          default: DEFAULT_CONFIG.TOKEN_LIMIT,
        },
        "step-limit": {
          alias: "s",
          type: "number",
          description: "Maximum number of steps",
          default: DEFAULT_CONFIG.STEP_LIMIT,
        },
        tui: { type: "boolean", description: "Launch TUI interface", default: false },
      })
      .help("h")
      .example('$0 -t "Create a TypeScript function"', "Run a coding task")
      .example("$0", "Launch TUI interface");

    const args = yargsInstance.parseSync();

    if (args.help) return yargsInstance.showHelp();
    if (args.task) return await runAgent(args.task, args.model, args.stepLimit, args["token-limit"]);
    // Default to TUI if no task provided
    return startTUI({ model: args.model, stepLimit: args.stepLimit, tokenLimit: args["token-limit"] });
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
