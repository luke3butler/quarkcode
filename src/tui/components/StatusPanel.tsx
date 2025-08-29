import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import type { AgentStatus } from "../../types/index.ts";
import { getStatusColor, getStatusText, getProgressText, getTokenColor } from "../../utils/formatting.ts";

interface StatusPanelProps {
  status: AgentStatus;
  isTaskComplete: boolean | undefined;
  autoAccept: boolean;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ status, isTaskComplete, autoAccept }) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box marginBottom={1}>
        <Text color="magenta" bold>
          Steps:
        </Text>
        <Text> {getProgressText(status.stepCount, status.stepLimit)}</Text>
        <Text> | </Text>
        {status.isRunning && <Spinner type="dots" />}
        <Text color={getStatusColor(status.isRunning, isTaskComplete)}>
          {status.isRunning ? " " : ""}
          {getStatusText(status.isRunning, isTaskComplete, status.currentStep)}
        </Text>
        {autoAccept && <Text> | </Text>}
        {autoAccept && (
          <Text color="yellow" bold>
            AUTO-ACCEPT
          </Text>
        )}
      </Box>
      <Box justifyContent="center">
        <Text color="cyan">Model: </Text>
        <Text>{status.model}</Text>
        <Text> | </Text>
        <Text color={getTokenColor(status.tokens, status.tokenLimit)}>
          Tokens: {status.tokens.toLocaleString()}/{status.tokenLimit.toLocaleString()}
        </Text>
      </Box>
    </Box>
  );
};
