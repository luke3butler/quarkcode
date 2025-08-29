import React from "react";
import { Box } from "ink";
import TextInput from "ink-text-input";

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (task: string) => void;
  placeholder?: string;
  disabled?: boolean;
  focus?: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ value, onChange, onSubmit, placeholder = "Enter your task...", disabled = false, focus = true }) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box borderStyle="round" paddingX={1} paddingY={0}>
        <TextInput value={value} onChange={onChange} onSubmit={onSubmit} placeholder={placeholder} focus={focus && !disabled} showCursor={!disabled} />
      </Box>
    </Box>
  );
};
