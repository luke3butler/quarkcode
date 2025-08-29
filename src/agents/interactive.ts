import { createConfiguredAgent, renderUserMessage } from "../core/agent-factory.ts";
import { calculateTotalTokens } from "../utils/tokens.ts";
import { DEFAULT_CONFIG } from "../utils/config.ts";
import { getToolName, extractCommandInput, formatToolResult, createToolMessage, isCompleteToolResult } from "../utils/tools.ts";
import type { AgentCallbacks, AgentConfig } from "../types/index.ts";

export function createInteractiveAgent(config: AgentConfig, callbacks: AgentCallbacks = {}) {
  return async function runTask(task: string): Promise<string> {
    let stepCount = 0;
    let tokens = 0;
    callbacks.onMessage?.("system", "Starting task execution...");
    callbacks.onStatusUpdate?.({
      isRunning: true,
      stepCount: 0,
      currentStep: "Initializing...",
    });

    const agent = createConfiguredAgent({
      model: config.model,
      stepLimit: config.stepLimit,
      tokenLimit: config.tokenLimit,
      confirmCommand: config.confirmCommands ? callbacks.onCommandConfirm : undefined
    });
    
    const userMessage = renderUserMessage(task);

    try {
      const result = await agent.generate({
        prompt: userMessage,
        // @ts-ignore - onStepFinish callback for tracking progress
        onStepFinish: ({ text, usage, toolCalls, toolResults }: any) => {
          stepCount++;
          if (usage) tokens += calculateTotalTokens(usage);

          if (tokens > config.tokenLimit) callbacks.onMessage?.("system", `Token limit of ${config.tokenLimit} exceeded. Stopping execution.`);

          callbacks.onStatusUpdate?.({
            stepCount,
            tokens,
            currentStep: "Running...",
          });

          if (text) callbacks.onMessage?.("assistant", text);

          if (toolCalls?.length && toolResults?.length) {
            toolCalls.forEach((toolCall: any, index: number) => {
              const toolResult = toolResults[index];
              if (!toolResult) return;

              const toolName = getToolName(toolCall);
              if (toolName === DEFAULT_CONFIG.COMPLETE_TOOL_NAME) return;

              const commandInput = extractCommandInput(toolCall);
              const resultOutput = formatToolResult(toolResult.output || "");
              const content = createToolMessage(commandInput, resultOutput);
              if (content) callbacks.onMessage?.("tool", content, toolName);
            });
          }
        },
      });

      const completeResult = result.toolResults?.find(isCompleteToolResult);
      if (completeResult?.output) callbacks.onMessage?.("assistant", `${completeResult.output}`);

      callbacks.onStatusUpdate?.({ isRunning: false });
      return result.text || "Task completed";
    } catch (error) {
      callbacks.onMessage?.("system", `Error: ${(error as Error).message}`);
      callbacks.onStatusUpdate?.({ isRunning: false });
      throw error;
    }
  };
}
