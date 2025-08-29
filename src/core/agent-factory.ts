import { Experimental_Agent as AIAgent, stepCountIs, hasToolCall } from "ai";
import { SYSTEM_TEMPLATE, INSTANCE_TEMPLATE } from "./prompts.ts";
import { createBashTool, createCompleteTool } from "./tools.ts";
import { renderTemplate, getModel } from "../utils/system.ts";
import { createTokenLimitStopCondition } from "../utils/tokens.ts";
import type { CommandToConfirm } from "../types/index.ts";

export interface AgentFactoryConfig {
  model: string;
  stepLimit: number;
  tokenLimit: number;
  confirmCommand?: (command: CommandToConfirm) => void;
}

export function createConfiguredAgent(config: AgentFactoryConfig) {
  return new AIAgent({
    model: getModel(config.model),
    system: renderTemplate(SYSTEM_TEMPLATE),
    stopWhen: [hasToolCall("complete"), createTokenLimitStopCondition(config.tokenLimit), ...(config.stepLimit > 0 ? [stepCountIs(config.stepLimit)] : [])],
    tools: {
      bash: createBashTool(config.confirmCommand),
      complete: createCompleteTool(),
    },
  });
}

export const renderUserMessage = (task: string): string => renderTemplate(INSTANCE_TEMPLATE, { task });
