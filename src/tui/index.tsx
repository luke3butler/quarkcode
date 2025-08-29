import React from "react";
import { render } from "ink";
import { TUIApp } from "./components/App.tsx";
import { createInteractiveAgent } from "../agents/interactive.ts";
import type { Message } from "../types/index.ts";

export function startTUI(options: { model: string; stepLimit: number; tokenLimit: number }) {
  const handleTaskSubmit = async (
    task: string,
    callbacks: {
      onMessage: (message: Message) => void;
      onStatusUpdate: (status: any) => void;
      onCommandConfirm: (command: any) => void;
    }
  ) => {
    const runTask = createInteractiveAgent(
      { model: options.model, stepLimit: options.stepLimit, tokenLimit: options.tokenLimit, confirmCommands: true },
      {
        onMessage: (role, content, toolName) => callbacks.onMessage({ role, content, timestamp: new Date(), toolName }),
        onStatusUpdate: callbacks.onStatusUpdate,
        onCommandConfirm: callbacks.onCommandConfirm,
      }
    );
    await runTask(task);
  };

  return render(<TUIApp model={options.model} stepLimit={options.stepLimit} tokenLimit={options.tokenLimit} onTaskSubmit={handleTaskSubmit} />);
}
