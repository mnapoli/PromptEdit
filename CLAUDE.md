# PromptEdit

Lightweight external editor for Claude Code's `Ctrl+G` feature. Tauri v2 + React + CodeMirror 6.

## Stack

- **Backend**: Rust (Tauri v2) — `src-tauri/src/`
- **Frontend**: React 18 + TypeScript + Vite — `src/`
- **Editor**: CodeMirror 6 with `@codemirror/lang-markdown` and `@codemirror/autocomplete`
- **File listing**: Rust `ignore` crate (same as ripgrep, respects `.gitignore`)
- **Fuzzy search**: `fuse.js` (JS side)
- **Font**: Space Mono (bundled as TTF in `src/fonts/`)
- **Window state**: `tauri-plugin-window-state` persists position/size

## Architecture

- `src-tauri/src/lib.rs` — entry point, reads CLI arg (file path), manages `AppState`
- `src-tauri/src/commands.rs` — Tauri commands: `get_file_info`, `list_project_files`, `save_and_quit`, `quit_without_save`
- `src/editor/setup.ts` — CodeMirror config: extensions, keybindings, markdown highlight style
- `src/editor/theme.ts` — light/dark themes (compartment-based, follows system via `prefers-color-scheme`)
- `src/editor/file-autocomplete.ts` — `@` triggered autocomplete with fuse.js
- `src/editor/mention-decoration.ts` — ViewPlugin that decorates `@path` tokens
- `src/styles.css` — global styles including autocomplete popup (rendered outside `.cm-editor`, so must be global CSS not theme-scoped)

## Key behaviors

- `Cmd+S` = save file + quit process (Claude Code reads the file after process exits)
- `Escape` = close autocomplete popup if open, otherwise quit without saving
- `Tab` / `Enter` = accept autocomplete selection
- `@` triggers file autocomplete (fuzzy search, max 50 results shown, 10k files limit)
- Window is always-on-top, no title bar text, resizable, position remembered
- Debug mode (`cfg!(debug_assertions)`) shows test content when no file arg is given

## Dev & Build

```bash
npm install
npm run tauri dev          # dev mode (hot reload)
npm run tauri build        # release build → src-tauri/target/release/promptedit
```

Release binary is symlinked to `~/.local/bin/promptedit`.

## CI

`.github/workflows/release.yml` — triggers on `v*` tags, builds DMG with `tauri-action`, supports Apple signing/notarization via secrets.

## Gotchas

- In `tauri dev`, no CLI file arg is passed — debug mode injects test content
- Autocomplete tooltip is rendered outside `.cm-editor` DOM — styles must be in global CSS, not CodeMirror theme
- `syntaxHighlighting(HighlightStyle)` is needed alongside `markdown()` for visual rendering (bold, italic, etc.)
- The `@lezer/highlight` tags module is a transitive dep (from `@codemirror/language`), no direct install needed
