import React from "react";
import { Box, Text, useInput } from "ink";
import type { CommandToConfirm } from "../../types/index.ts";

interface ConfirmDialogProps {
  command: CommandToConfirm;
  visible: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ command, visible }) => {
  if (!visible) return null;

  useInput((input, key) => {
    if (input === "y" || input === "Y" || key.return) return command.onApprove();
    if (input === "n" || input === "N" || key.escape) return command.onReject();
  });

  return (
    <Box flexDirection="column" borderStyle="double" borderColor="yellow" paddingX={1} paddingY={0} marginY={1}>
      <Box marginBottom={1}>
        <Text color="yellow" bold>
          ⚠️ Run Command?
        </Text>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text color="red" bold>
          Command to execute:
        </Text>
        <Box marginLeft={2} backgroundColor="gray" paddingX={1} borderStyle="single">
          <Text color="white">{command.command}</Text>
        </Box>
      </Box>

      <Box justifyContent="space-between">
        <Text>
          <Text color="green" bold>
            Y
          </Text>
          es - Execute
        </Text>
        <Text>
          <Text color="red" bold>
            N
          </Text>
          o - Skip
        </Text>
        <Text color="gray">ESC - Skip</Text>
      </Box>
    </Box>
  );
};
