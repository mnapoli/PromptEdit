import { EditorState, type Extension } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  closeBrackets,
  closeBracketsKeymap,
  completionStatus,
  closeCompletion,
  acceptCompletion,
} from "@codemirror/autocomplete";
import { markdown } from "@codemirror/lang-markdown";
import {
  syntaxHighlighting,
  HighlightStyle,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { invoke } from "@tauri-apps/api/core";
import {
  baseTheme,
  getTheme,
  listenThemeChanges,
  themeCompartment,
} from "./theme";
import { mentionPlugin } from "./mention-decoration";
import { fileAutocomplete } from "./file-autocomplete";

function saveAndQuit(view: EditorView): boolean {
  const content = view.state.doc.toString();
  invoke("save_and_quit", { content });
  return true;
}

function escapeHandler(view: EditorView): boolean {
  // If autocomplete is open, close it instead of quitting
  if (completionStatus(view.state) !== null) {
    closeCompletion(view);
    return true;
  }
  invoke("quit_without_save");
  return true;
}

const markdownHighlight = HighlightStyle.define([
  { tag: tags.heading1, fontWeight: "bold", fontSize: "1.3em" },
  { tag: tags.heading2, fontWeight: "bold", fontSize: "1.2em" },
  { tag: tags.heading3, fontWeight: "bold", fontSize: "1.1em" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  { tag: tags.link, textDecoration: "underline" },
  { tag: tags.url, color: "#6b7280" },
  { tag: tags.monospace, fontFamily: "inherit", color: "#dc2626", backgroundColor: "rgba(0,0,0,0.06)", borderRadius: "3px", padding: "1px 4px" },
  { tag: tags.quote, color: "#6b7280", fontStyle: "italic" },
  { tag: tags.processingInstruction, color: "#9ca3af" }, // markdown markers like ##, **, >
]);

export function createEditor(
  parent: HTMLElement,
  initialContent: string,
): EditorView {
  const state = EditorState.create({
    doc: initialContent,
    extensions: [
      history(),
      closeBrackets(),
      keymap.of([
        { key: "Mod-s", run: saveAndQuit, preventDefault: true },
        { key: "Escape", run: escapeHandler },
        { key: "Tab", run: acceptCompletion },
        ...closeBracketsKeymap,
        ...historyKeymap,
        ...defaultKeymap,
      ]),
      markdown(),
      syntaxHighlighting(markdownHighlight),
      fileAutocomplete,
      baseTheme,
      themeCompartment.of(getTheme()),
      mentionPlugin,
      placeholder("Type your prompt here... Use @ to mention files."),
      EditorView.lineWrapping,
    ],
  });

  const view = new EditorView({ state, parent });
  view.focus();
  listenThemeChanges(view);
  return view;
}
