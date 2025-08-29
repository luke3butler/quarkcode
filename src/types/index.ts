export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
  toolName?: string; // For tool messages, store the tool name (bash, complete, etc.)
}

export interface AgentStatus {
  model: string;
  stepCount: number;
  stepLimit: number;
  tokens: number;
  tokenLimit: number;
  isRunning: boolean;
  currentStep?: string;
}

export interface CommandToConfirm {
  command: string;
  onApprove: () => void;
  onReject: () => void;
}

export interface AgentCallbacks {
  onMessage?: (role: MessageRole, content: string, toolName?: string) => void;
  onStatusUpdate?: (update: { stepCount?: number; tokens?: number; currentStep?: string; isRunning?: boolean }) => void;
  onCommandConfirm?: (command: CommandToConfirm) => void;
}

export interface AgentConfig {
  model: string;
  stepLimit: number;
  tokenLimit: number;
  confirmCommands?: boolean;
}

