export interface TokenUsage {
  totalTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
}

export function calculateTotalTokens(usage: TokenUsage | undefined): number {
  if (!usage) return 0;
  return usage.totalTokens || (usage.inputTokens || 0) + (usage.outputTokens || 0);
}

export function createTokenLimitStopCondition(tokenLimit: number) {
  let totalTokens = 0;

  return (options: { steps: Array<any> }) => {
    if (options.steps.length === 0) return false;

    const latestStep = options.steps.at(-1)!;
    const stepTokens = calculateTotalTokens(latestStep.usage);

    totalTokens += stepTokens;
    return totalTokens > tokenLimit;
  };
}
