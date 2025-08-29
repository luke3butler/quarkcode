import { DEFAULT_CONFIG } from "./config.ts";
import type { Message } from "../types/index.ts";
const ROLE_COLORS: Record<Message["role"], string> = {
  user: "blue",
  assistant: "green",
  system: "yellow",
  tool: "cyan",
};

export function getRoleColor(role: Message["role"]) {
  return ROLE_COLORS[role] || "white";
}

const ROLE_LABELS: Record<Message["role"], string> = {
  user: "👤 You",
  assistant: "🤖 Agent",
  system: "⚙️ System",
  tool: "🔧 Tool",
};

export function getRoleLabel(role: Message["role"], toolName?: string) {
  if (role === "tool") return `${ROLE_LABELS.tool}: ${toolName || "unknown"}`;
  return ROLE_LABELS[role] || role;
}

export function getTokenColor(tokensUsed: number, tokenLimit: number) {
  const percentage = tokensUsed / tokenLimit;
  if (percentage >= DEFAULT_CONFIG.TOKEN_CRITICAL_THRESHOLD) return "red";
  if (percentage >= DEFAULT_CONFIG.TOKEN_WARNING_THRESHOLD) return "yellow";
  return "green";
}

const STATUS_CONFIG = {
  running: { color: "yellow", getText: (currentStep?: string) => currentStep || "Running..." },
  completed: { color: "green", getText: () => "✅ COMPLETED" },
  ready: { color: "blue", getText: () => "Ready" },
} as const;

export function getStatusColor(isRunning: boolean, isTaskComplete?: boolean) {
  if (isRunning) return STATUS_CONFIG.running.color;
  if (isTaskComplete) return STATUS_CONFIG.completed.color;
  return STATUS_CONFIG.ready.color;
}

export function getStatusText(isRunning: boolean, isTaskComplete?: boolean, currentStep?: string) {
  if (isRunning) return STATUS_CONFIG.running.getText(currentStep);
  if (isTaskComplete) return STATUS_CONFIG.completed.getText();
  return STATUS_CONFIG.ready.getText();
}

export const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export const getProgressText = (stepCount: number, stepLimit: number) => (stepLimit > 0 ? `${stepCount}/${stepLimit}` : `${stepCount}`);
