import { EditorView } from "@codemirror/view";
import { Compartment } from "@codemirror/state";

export const themeCompartment = new Compartment();

const baseTheme = EditorView.baseTheme({
  "&": {
    height: "100%",
    fontSize: "20px",
    lineHeight: "1.2",
  },
  ".cm-scroller": {
    padding: "12px 16px",
    fontFamily: "'Space Mono', monospace",
  },
  ".cm-content": {
    fontFamily: "'Space Mono', monospace",
    caretColor: "auto",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-gutters": {
    display: "none",
  },
  ".cm-cursor": {
    borderLeftWidth: "2px",
  },
});

const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
  },
  ".cm-cursor": {
    borderLeftColor: "#1a1a1a",
  },
  ".cm-selectionBackground": {
    backgroundColor: "#b3d4fc !important",
  },
  // Markdown highlighting
  ".cm-header": { color: "#1a56db", fontWeight: "bold" },
  ".cm-strong": { fontWeight: "bold" },
  ".cm-emphasis": { fontStyle: "italic" },
  ".cm-strikethrough": { textDecoration: "line-through" },
  ".cm-link": { color: "#1a56db", textDecoration: "underline" },
  ".cm-url": { color: "#6b7280" },
  ".cm-quote": { color: "#6b7280", fontStyle: "italic" },
  ".cm-monospace": { color: "#dc2626", backgroundColor: "#f3f4f6", borderRadius: "3px", padding: "1px 4px" },
  // @mention
  ".cm-mention": { color: "#7c3aed", fontWeight: "bold" },
});

const darkTheme = EditorView.theme({
  "&": {
    backgroundColor: "#1e1e1e",
    color: "#d4d4d4",
  },
  ".cm-cursor": {
    borderLeftColor: "#d4d4d4",
  },
  ".cm-selectionBackground": {
    backgroundColor: "#264f78 !important",
  },
  // Markdown highlighting
  ".cm-header": { color: "#6cb6ff", fontWeight: "bold" },
  ".cm-strong": { fontWeight: "bold" },
  ".cm-emphasis": { fontStyle: "italic" },
  ".cm-strikethrough": { textDecoration: "line-through" },
  ".cm-link": { color: "#6cb6ff", textDecoration: "underline" },
  ".cm-url": { color: "#8b949e" },
  ".cm-quote": { color: "#8b949e", fontStyle: "italic" },
  ".cm-monospace": { color: "#f97583", backgroundColor: "#2d2d2d", borderRadius: "3px", padding: "1px 4px" },
  // @mention
  ".cm-mention": { color: "#c084fc", fontWeight: "bold" },
});

export function getTheme() {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return isDark ? darkTheme : lightTheme;
}

export function listenThemeChanges(view: EditorView) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", () => {
    view.dispatch({
      effects: themeCompartment.reconfigure(getTheme()),
    });
  });
}

export { baseTheme };
