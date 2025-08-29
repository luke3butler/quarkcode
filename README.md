# quarkcode

Minimal CLI agent with a pretty TUI, 855 lines of code

![Screenshot](assets/screenshot.png)

## Overview

This probably won't replace your current agent, but it's a fun experiment in building a minimal agent with a TUI. It's functional and somewhat polished, but not fully featured.

Inspired by [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) and Claude Code, the goal was to build an equivalent agent in under 1k lines (mini-swe-agent is ~1.7k lines for the CLI + TUI).

Fun fact: Claude Code helped write the initial non-interactive version, then I switched to quarkcode itself to build the TUI and polish the features.

Why "quark"? Among the most fundamental particles we know. And just a unique name.

## Details

- Interactive TUI similar to Claude Code
- One-shot sessions (will not remember previous prompts within your session)
- Single tool: Bash execution
- Auto-accept mode (Shift+Tab)
- Potentially resolves ~67% of GitHub issues in SWE-bench verified (unverified claim)
- Supports Anthropic and OpenAI models
- Written in TypeScript
- Minimal dependencies
  - AI SDK
  - Ink (TUI)
  - yargs (CLI)

## Quickstart

⚠️ **Warning**: Be careful with auto-accept mode. This tools gives an LLM shell access.

```bash
# Set ANTHROPIC_API_KEY or OPENAI_API_KEY in your environment
export ANTHROPIC_API_KEY="your_key_here"

# Install globally
npm install -g quarkcode@latest
quark                    # Interactive mode
quark -t "Fix the bug"   # Direct task

# Or run directly without installing
npx -y quarkcode@latest  # Interactive mode
npx -y quarkcode@latest -t "Fix the bug in main.py"

# Or via bunx
bunx quarkcode  # Interactive mode
bunx quarkcode -t "Fix the bug in main.py"
```

## TUI Shortcuts

- `Ctrl+C` - Exit
- `Shift+Tab` - Toggle auto-accept mode (yolo mode with no safeguards)
- **Command confirmation**: `Y`/`Enter` = approve, `N`/`Escape` = reject

## CLI Flags

- `-t, --task` - Task to execute in non-interactive mode
- `-m, --model` - LLM model
- `-l, --token-limit` - Max tokens
- `-s, --step-limit` - Max steps
- `--tui` - Launch TUI
- `-h, --help` - Show help

## Command Aliases

Both `quark` and `quarkcode` work identically:

- `quark -t "task"` (short)
- `quarkcode -t "task"` (descriptive)

## Models

- `claude-sonnet-4-20250514` (default)
- `gpt-5`
- any other OpenAI or Anthropic model (untested)

## Quickstart in a docker container

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

`bun run agent` will run in docker.

```bash
# Interactive TUI in docker (default when no task provided)
bun run agent

# Direct task execution
bun run agent -t "Create a simple React component"

# Build + run
bun run agent:b
```
