// Configuration constants and default values

export const DEFAULT_CONFIG = {
  // Model defaults
  MODEL: "claude-sonnet-4-20250514",

  // Limits
  TOKEN_LIMIT: 200000,
  STEP_LIMIT: 0,

  // Command execution
  COMMAND_TIMEOUT_MS: 30000, // 30 seconds

  // Output handling
  MAX_OUTPUT_LENGTH: 10000,
  OUTPUT_HEAD_LENGTH: 5000,
  OUTPUT_TAIL_LENGTH: 5000,

  // Tool display
  MAX_TOOL_RESULT_LINES: 5,

  // Token usage thresholds for color coding
  TOKEN_WARNING_THRESHOLD: 0.7, // Yellow at 70%
  TOKEN_CRITICAL_THRESHOLD: 0.9, // Red at 90%

  // Tool processing constants
  COMPLETE_TOOL_NAME: "complete",
  UNKNOWN_TOOL_NAME: "unknown",

  // Tool message labels
  COMMAND_LABEL: "Command:",
  RESULT_LABEL: "Result:\n",

  // Application metadata
  APP_NAME: "quarkcode",
  TUI_TITLE: "⚛️ quarkcode",
  ADDITIONAL_INSTRUCTIONS: "Press Shift+Tab to switch between modes. Press Ctrl+C to exit.",
} as const;
