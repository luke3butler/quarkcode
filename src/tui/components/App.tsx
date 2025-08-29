import React, { useState, useCallback, useRef } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { TaskInput } from "./TaskInput.tsx";
import { ChatDisplay } from "./ChatDisplay.tsx";
import { StatusPanel } from "./StatusPanel.tsx";
import { ConfirmDialog } from "./ConfirmDialog.tsx";
import type { Message, AgentStatus, CommandToConfirm } from "../../types/index.ts";
import { DEFAULT_CONFIG } from "../../utils/config.ts";

interface TUIAppProps {
  model: string;
  stepLimit: number;
  tokenLimit: number;
  onTaskSubmit: (
    task: string,
    callbacks: {
      onMessage: (message: Message) => void;
      onStatusUpdate: (status: Partial<AgentStatus>) => void;
      onCommandConfirm: (command: CommandToConfirm) => void;
    }
  ) => Promise<void>;
}

export const TUIApp: React.FC<TUIAppProps> = ({ model, stepLimit, tokenLimit, onTaskSubmit }) => {
  const { exit } = useApp();

  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<AgentStatus>({
    model,
    stepCount: 0,
    stepLimit,
    tokens: 0,
    tokenLimit,
    isRunning: false,
  });
  const [taskInput, setTaskInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [pendingCommand, setPendingCommand] = useState<CommandToConfirm | undefined>(undefined);
  const [autoAccept, setAutoAccept] = useState(false);
  const autoAcceptRef = useRef(false);
  useInput((input, key) => {
    if (key.ctrl && input === "c") exit();
    if (key.shift && key.tab) setAutoAccept(prev => (autoAcceptRef.current = !prev));
  });
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);
  const updateStatus = useCallback((statusUpdate: Partial<AgentStatus>) => {
    setStatus(prev => ({ ...prev, ...statusUpdate }));
  }, []);
  const handleCommandConfirm = (command: CommandToConfirm) => {
    if (autoAcceptRef.current) return command.onApprove();
    const wrapCallback = (callback: () => void) => () => {
      setPendingCommand(undefined);
      setIsInputFocused(true);
      callback();
    };
    setPendingCommand({
      ...command,
      onApprove: wrapCallback(command.onApprove),
      onReject: wrapCallback(command.onReject),
    });
    setIsInputFocused(false);
  };

  const handleTaskSubmit = async (task: string) => {
    if (!task.trim()) return;
    addMessage({ role: "user", content: task, timestamp: new Date() });
    setTaskInput("");
    setStatus(prev => ({ ...prev, isRunning: true, currentStep: "Starting task..." }));
    setIsInputFocused(false);
    try {
      await onTaskSubmit(task, {
        onMessage: addMessage,
        onStatusUpdate: updateStatus,
        onCommandConfirm: handleCommandConfirm,
      });
    } finally {
      updateStatus({ isRunning: false, currentStep: undefined });
      setIsInputFocused(true);
    }
  };

  const handleTaskInputChange = useCallback((value: string) => setTaskInput(value), []);

  const isTaskComplete =
    messages.length > 0 && messages[messages.length - 1]?.role === "system" && messages[messages.length - 1]?.content.toLowerCase().includes("task completed");

  return (
    <Box flexDirection="column" height="100%">
      <Box flexGrow={1}>
        <ChatDisplay messages={messages} />
      </Box>

      {pendingCommand && <ConfirmDialog command={pendingCommand} visible={!!pendingCommand} />}

      <TaskInput value={taskInput} onChange={handleTaskInputChange} onSubmit={handleTaskSubmit} disabled={status.isRunning} focus={isInputFocused && !pendingCommand} />

      <StatusPanel status={status} isTaskComplete={isTaskComplete} autoAccept={autoAccept} />

      <Box justifyContent="center">
        <Text color="gray" dimColor>
          {DEFAULT_CONFIG.APP_NAME} • {DEFAULT_CONFIG.ADDITIONAL_INSTRUCTIONS}
        </Text>
      </Box>
    </Box>
  );
};
