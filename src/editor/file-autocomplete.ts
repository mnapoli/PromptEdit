import {
  autocompletion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";
import Fuse from "fuse.js";

let fileList: string[] = [];
let fuse: Fuse<string> | null = null;

export function setFileList(files: string[]) {
  fileList = files;
  fuse = new Fuse(files, {
    threshold: 0.4,
    distance: 100,
    includeScore: true,
  });
}

function fileCompletionSource(
  context: CompletionContext,
): CompletionResult | null {
  const word = context.matchBefore(/@[\w./\-[\]]*/);
  if (!word) return null;

  const query = word.text.slice(1); // Remove the @
  let options: { label: string; apply: string }[];

  if (query.length === 0) {
    // Show first 50 files when just @ is typed
    options = fileList.slice(0, 50).map((f) => ({
      label: f,
      apply: `@${f}`,
    }));
  } else {
    // Fuzzy search
    const results = fuse?.search(query, { limit: 30 }) ?? [];
    options = results.map((r) => ({
      label: r.item,
      apply: `@${r.item}`,
    }));
  }

  return {
    from: word.from,
    options,
    filter: false,
  };
}

export const fileAutocomplete = autocompletion({
  override: [fileCompletionSource],
  activateOnTyping: true,
  defaultKeymap: true,
});
