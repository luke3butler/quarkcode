# quarkcode

Minimal CLI agent with a TUI.

![Screenshot](assets/screenshot.png)

These CLI agents are a dime a dozen, and this wasn't built with the intent to replace them. It's functional, but not polished.

Initially inspired by [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent), the goal was to build a powerful agent under ~1000 lines of code. Using JS instead of TS would have resulted in even less code, but oh well.

Claude Code helped write the non-interactive version, then I switched to quarkcode to build the TUI and other features.

Why "quark"? Among the most fundamental particles we know. And just a unique name.

## Features

- ~860 lines of code (as of this commit), including prompts and configuration (`wc -l src/**/* 2>/dev/null | tail -1`)
- Written in TypeScript, targeting the Bun runtime
- Agent with a single tool: Bash
- _Possibly_ resolves ~67% of GitHub issues in the [SWE-bench verified benchmark](https://www.swebench.com/)
- Interactive TUI (similar to Claude Code)
- One-shot (will not remember previous messages)
- Confirm before executing commands (shift+tab to auto accept)
- Multiple model support (Claude/OpenAI)
- Configurable limits
- Minimal dependencies
  - AI SDK (anthropic, openai)
  - Ink (TUI)
  - yargs (CLI)

## Usage

⚠️ **Warning**: This agent has direct access to bash. Be careful with auto-accept mode.

See [Quickstart](#quickstart) for running in a Docker container.

```bash
# Via bunx
bunx quarkcode -t "Fix the bug in main.py"
bunx quarkcode  # Interactive mode
```

**Local development:**

```bash
# Interactive TUI in docker (default when no task provided)
bun run agent

# Direct task execution
bun run agent -t "Create a simple React component"

# Build + run
bun run agent:b
```

## Quickstart

Work on any project by mounting it into /workspace:

```bash
# 1. Build image (one time)
git clone <repo> && cd quarkcode && docker build -t quarkcode .

# 2. Configure API key
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# 3. Set your project path
export PROJECT_DIR="/path/to/your/project"

# 4. Run tasks
docker run --rm -it -v $PROJECT_DIR:/workspace --env-file .env -w /workspace quarkcode -t "Fix the bug in main.py"

# 5. Interactive mode
docker run --rm -it -v $PROJECT_DIR:/workspace --env-file .env -w /workspace quarkcode
```

## Local Development

```bash
bun install
bun run agent:b
```

## Models

- `claude-sonnet-4-20250514` (default)
- `gpt-4`

## Options

- `-t, --task` - Task to execute
- `-m, --model` - LLM model
- `-l, --token-limit` - Max tokens
- `-s, --step-limit` - Max steps
- `--tui` - Launch TUI
- `-h, --help` - Show help

## Shortcuts

- `Ctrl+C` - Exit
- `Shift+Tab` - Toggle auto-accept mode
- **Command confirmation**: `Y`/`Enter` = approve, `N`/`Escape` = reject

## Behavior

- **Auto-accept**: When enabled, commands execute without confirmation
- **Timeouts**: Commands timeout after 30 seconds
- **Output**: Long results are truncated (head + tail shown)
- **Token limits**: Execution stops when limit exceeded, color-coded usage

## Environment

**Docker container includes**: git, curl, ripgrep, jq, tree, fd-find, patch

**Workspace**: Commands execute in `/workspace` (mounted from `./workspace/`)

## Dependencies

- **AI SDK**
  - ai
  - @ai-sdk/anthropic
  - @ai-sdk/openai
- **TUI**
  - ink
  - ink-spinner
  - ink-text-input
  - react
- **CLI**
  - yargs
- **Tool schemas**
  - zod
