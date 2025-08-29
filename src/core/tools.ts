import { tool } from "ai";
import { z } from "zod";
import { LONG_OUTPUT_WARNING } from "./prompts.ts";
import { DEFAULT_CONFIG } from "../utils/config.ts";
import type { CommandToConfirm } from "../types/index.ts";

export function createBashTool(confirmCommand?: (command: CommandToConfirm) => void) {
  return tool({
    description: "Execute a bash command in the environment",
    inputSchema: z.object({
      command: z.string().describe("The bash command to execute"),
    }),
    execute: async ({ command }) => {
      // Handle command confirmation if callback is provided
      if (confirmCommand) {
        await new Promise<void>((resolve, reject) => {
          confirmCommand({
            command,
            onApprove: resolve,
            onReject: () => reject(new Error("Command execution cancelled by user")),
          });
        });
      }
      const workingDir = process.env.WORKSPACE_DIR || process.cwd();
      const proc = Bun.spawn({ cmd: ["bash", "-c", command], cwd: workingDir, stdout: "pipe", stderr: "pipe" });
      const timeout = DEFAULT_CONFIG.COMMAND_TIMEOUT_MS;
      const timeoutId = setTimeout(() => proc.kill(), timeout);
      try {
        const result = await proc.exited;
        clearTimeout(timeoutId);
        const output = (await new Response(proc.stdout).text()) + (await new Response(proc.stderr).text());
        const returnCodeSection = `<returncode>${result || 0}</returncode>\n`;
        if (output.length < DEFAULT_CONFIG.MAX_OUTPUT_LENGTH) return returnCodeSection + `<output>\n${output}</output>`;
        const elidedChars = output.length - DEFAULT_CONFIG.MAX_OUTPUT_LENGTH;
        const head = output.substring(0, DEFAULT_CONFIG.OUTPUT_HEAD_LENGTH);
        const tail = output.substring(output.length - DEFAULT_CONFIG.OUTPUT_TAIL_LENGTH);

        return (
          returnCodeSection +
          `${LONG_OUTPUT_WARNING}
<output_head>
${head}
</output_head>
<elided_chars>
${elidedChars} characters elided
</elided_chars>
<output_tail>
${tail}
</output_tail>`
        );
      } catch {
        throw new Error(`Command timed out after ${timeout}ms`);
      }
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
