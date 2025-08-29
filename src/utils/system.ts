import { platform, release, version, arch, cpus } from "os";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
export function getSystemInfo(): Record<string, string> {
  return {
    system: platform(),
    release: release(),
    version: version() || "unknown",
    machine: arch(),
    processor: cpus()[0]?.model || "unknown",
  };
}
export function renderTemplate(template: string, variables: Record<string, string> = {}): string {
  let result = template;
  for (const [key, value] of Object.entries({ ...getSystemInfo(), ...variables })) result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  return result;
}
export function getModel(modelName: string) {
  if (modelName.includes("claude")) return anthropic(modelName);
  if (modelName.includes("gpt")) return openai(modelName);
  return anthropic(modelName);
}
