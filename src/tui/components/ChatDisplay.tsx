import React from "react";
import { Box, Text, Static } from "ink";
import type { Message } from "../../types/index.ts";
import { getRoleColor, getRoleLabel, formatTime } from "../../utils/formatting.ts";
import { DEFAULT_CONFIG } from "../../utils/config.ts";

interface ChatDisplayProps {
  messages: Message[];
}

export const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
  // Helper function to render a single message
  const renderMessage = (message: Message) => (
    <Box key={`${message.timestamp.getTime()}-${message.role}-${message.content.substring(0, 20)}`} flexDirection="column" marginBottom={1}>
      <Box>
        <Text color={getRoleColor(message.role)} bold>
          {getRoleLabel(message.role, message.toolName)}
        </Text>
        <Box marginLeft={1}>
          <Text color="gray" dimColor>
            {formatTime(message.timestamp)}
          </Text>
        </Box>
      </Box>
      <Box marginLeft={2}>{message.role === "tool" ? <Text color="gray">{message.content}</Text> : <Text>{message.content}</Text>}</Box>
    </Box>
  );

  return (
    <>
      <Static items={[{ title: DEFAULT_CONFIG.TUI_TITLE }]}>
        {(item: { title: string }) => (
          <Box key="header" justifyContent="center" marginBottom={1}>
            <Text color="magenta" bold>
              {item.title}
            </Text>
          </Box>
        )}
      </Static>

      {messages.length > 0 && <Static items={messages}>{renderMessage}</Static>}
    </>
  );
};
