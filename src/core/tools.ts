import { tool } from "ai";
import { z } from "zod";
import { execFile } from "child_process";
import { promisify } from "util";
import { LONG_OUTPUT_WARNING } from "./prompts.ts";
import { DEFAULT_CONFIG } from "../utils/config.ts";
import type { CommandToConfirm } from "../types/index.ts";

const execAsync = promisify(execFile);

export function createBashTool(confirmCommand?: (command: CommandToConfirm) => void) {
  return tool({
    description: "Execute a bash command in the environment",
    inputSchema: z.object({
      command: z.string().describe("The bash command to execute"),
    }),
    execute: async ({ command }) => {
      if (confirmCommand) {
        await new Promise<void>((resolve, reject) =>
          confirmCommand({ command, onApprove: resolve, onReject: () => reject(new Error("Command execution cancelled by user")) })
        );
      }

      let exitCode: number = 0;
      let output: string;

      try {
        const { stdout, stderr } = await execAsync("bash", ["-c", command], {
          cwd: process.env.WORKSPACE_DIR || process.cwd(),
          timeout: DEFAULT_CONFIG.COMMAND_TIMEOUT_MS,
          encoding: "utf-8",
        });
        output = stdout + stderr;
      } catch (error: any) {
        exitCode = error.code || 1;
        output = (error.stdout || "") + (error.stderr || "");
      }

      if (output.length < DEFAULT_CONFIG.MAX_OUTPUT_LENGTH) return `<returncode>${exitCode}</returncode>\n<output>\n${output}</output>`;

      return `<returncode>${exitCode}</returncode>\n${LONG_OUTPUT_WARNING}
<output_head>
${output.substring(0, DEFAULT_CONFIG.OUTPUT_HEAD_LENGTH)}
</output_head>
<elided_chars>
${output.length - DEFAULT_CONFIG.MAX_OUTPUT_LENGTH} characters elided
</elided_chars>
<output_tail>
${output.substring(output.length - DEFAULT_CONFIG.OUTPUT_TAIL_LENGTH)}
</output_tail>`;
    },
  });
}

export function createCompleteTool() {
  return tool({
    description: "Use this tool when the task is fully complete",
    inputSchema: z.object({
      result: z.string().meta({ description: "The final result of the completed task" }),
    }),
    execute: async ({ result }) => result,
  });
}
