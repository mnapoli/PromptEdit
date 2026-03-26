Lightweight prompt editor for [Claude Code](https://claude.ai/claude-code) with a macOS native interface.

![PromptEdit screenshot](./screenshot.png)

## How it works

Hit `Ctrl+G` in Claude Code to edit your prompt in an overlay window:

- Edit prompts outside your terminal, with your keyboard and... mouse 🤯
- `@file` autocomplete
- `Cmd+S` to save and submit

Also:

- Syntax highlighting
- Light/dark theme that matches your system
- Window position and size remembered between sessions

## Install

```bash
brew install mnapoli/tap/promptedit
```

Or download the `.dmg` from [Releases](../../releases).

<details>
<summary>Build from source</summary>

```bash
npm install
npm run tauri build
# Binary at src-tauri/target/release/promptedit
```
</details>

## Setup

Add to `~/.claude/settings.json`:

```json
{
  "env": {
    "EDITOR": "promptedit"
  }
}
```

Then press `Ctrl+G` in Claude Code to open PromptEdit.
