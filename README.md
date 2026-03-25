Lightweight prompt editor for [Claude Code](https://claude.ai/claude-code). Opens as an overlay window with markdown highlighting and file autocomplete.

## Features

- Markdown syntax highlighting (bold, italic, code, quotes, headings)
- `@file` autocomplete with fuzzy search (respects `.gitignore`)
- `Cmd+S` to save and submit, `Escape` to cancel
- Light/dark theme (follows system)
- Window position and size remembered between sessions

## Install

Download the latest `.dmg` from [Releases](../../releases), or build from source:

```bash
npm install
npm run tauri build
```

The binary will be at `src-tauri/target/release/promptedit`.

## Setup

Set PromptEdit as your Claude Code editor. Either globally via your shell:

```bash
export EDITOR="promptedit"
```

Or specifically for Claude Code in `~/.claude/settings.json`:

```json
{
  "env": {
    "EDITOR": "promptedit"
  }
}
```

Then press `Ctrl+G` in Claude Code to open PromptEdit.
