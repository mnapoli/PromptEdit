import { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { createEditor } from "./editor/setup";
import { setFileList } from "./editor/file-autocomplete";
import "./styles.css";

interface FileInfo {
  path: string;
  content: string;
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ReturnType<typeof createEditor> | null>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const initEditor = (content: string) => {
      if (containerRef.current && !editorRef.current) {
        editorRef.current = createEditor(containerRef.current, content);
      }
    };

    invoke<FileInfo>("get_file_info")
      .then(({ content }) => initEditor(content))
      .catch(() => initEditor(""));

    invoke<string[]>("list_project_files")
      .then((files) => setFileList(files))
      .catch(() => {});
  }, []);

  return <div className="editor-container" ref={containerRef} />;
}

export default App;
