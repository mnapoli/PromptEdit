import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";

const mentionDeco = Decoration.mark({ class: "cm-mention" });

function findMentions(view: EditorView): DecorationSet {
  const decorations: ReturnType<typeof Decoration.mark>[] = [];
  const ranges: { from: number; to: number }[] = [];
  const doc = view.state.doc;

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i);
    const text = line.text;
    const regex = /@[\w./\-[\]]+/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      ranges.push({
        from: line.from + match.index,
        to: line.from + match.index + match[0].length,
      });
    }
  }

  for (const { from, to } of ranges) {
    decorations.push(mentionDeco.range(from, to) as any);
  }

  return Decoration.set(
    ranges.map(({ from, to }) => mentionDeco.range(from, to)),
    true,
  );
}

export const mentionPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = findMentions(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = findMentions(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);
