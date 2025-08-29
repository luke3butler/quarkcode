import { DEFAULT_CONFIG } from "./config.ts";

export const getToolName = (toolCall: any): string => toolCall.toolName || toolCall.type || DEFAULT_CONFIG.UNKNOWN_TOOL_NAME;

export function extractCommandInput(toolCall: any): string {
  if (!toolCall.input) return "";
  const input = typeof toolCall.input === "string" ? toolCall.input : toolCall.input.command || JSON.stringify(toolCall.input, null, 2);
  return input.split("\n")[0] || "";
}

export function formatToolResult(result: string, maxLines: number = DEFAULT_CONFIG.MAX_TOOL_RESULT_LINES): string {
  if (!result) return "";
  const resultLines = result.toString().split("\n");
  const truncated = resultLines.slice(0, maxLines);
  return resultLines.length > maxLines ? truncated.join("\n") + `\n...(${resultLines.length - maxLines} more lines)` : truncated.join("\n");
}

export function createToolMessage(commandInput: string, resultOutput: string): string {
  const parts = [];
  if (commandInput) parts.push(`${DEFAULT_CONFIG.COMMAND_LABEL} ${commandInput}`);
  if (resultOutput) parts.push(`${DEFAULT_CONFIG.RESULT_LABEL}${resultOutput}`);
  return parts.join("\n\n");
}

export const isCompleteToolResult = (toolResult: any): boolean => (toolResult.toolName || toolResult.name || toolResult.type) === DEFAULT_CONFIG.COMPLETE_TOOL_NAME;
