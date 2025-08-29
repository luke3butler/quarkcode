import { createConfiguredAgent, renderUserMessage } from "../core/agent-factory.ts";
import { getToolName, extractCommandInput, formatToolResult, createToolMessage, isCompleteToolResult } from "../utils/tools.ts";
import { DEFAULT_CONFIG } from "../utils/config.ts";

export async function runAgent(task: string, model: string, stepLimit: number, tokenLimit: number) {
  const agent = createConfiguredAgent({
    model,
    stepLimit,
    tokenLimit,
  });

  let stepCount = 0;

  const result = await agent.generate({
    prompt: renderUserMessage(task),
    // @ts-ignore - onStepFinish callback for progress display
    onStepFinish: ({ text, toolCalls, toolResults }: any) => {
      stepCount++;
      if (text) process.stderr.write(`\x1b[2;36m[Step ${stepCount}] ${text}\x1b[0m\n`);

      if (toolCalls?.length && toolResults?.length) {
        toolCalls.forEach((toolCall: any, index: number) => {
          const toolResult = toolResults[index];
          if (!toolResult) return;

          const toolName = getToolName(toolCall);
          if (toolName === DEFAULT_CONFIG.COMPLETE_TOOL_NAME) return;

          const commandInput = extractCommandInput(toolCall);
          const resultOutput = formatToolResult(toolResult.output || "");
          const content = createToolMessage(commandInput, resultOutput);
          if (content) process.stderr.write(`\x1b[2;36m[${toolName}] ${content}\x1b[0m\n`);
        });
      }
    },
  });
  process.stderr.write(`\x1b[36m\nCompleted in ${stepCount} steps\x1b[0m\n\n`);
  console.log(result.toolResults?.find(isCompleteToolResult)?.output || result.text || "Task completed");
}
