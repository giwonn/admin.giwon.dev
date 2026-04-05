"use client";

import { useCallback, useRef, useState } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView, keymap } from "@codemirror/view";
import { Toolbar } from "./Toolbar";
import { PreviewPane } from "./PreviewPane";
import { uploadImage } from "@/actions/articles";

function wrapSelection(view: EditorView, before: string, after: string) {
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to);
  const insert = `${before}${selected || "텍스트"}${after}`;
  view.dispatch({
    changes: { from, to, insert },
    selection: selected
      ? { anchor: from + insert.length }
      : { anchor: from + before.length, head: from + before.length + "텍스트".length },
  });
  return true;
}

const markdownKeymap = keymap.of([
  { key: "Mod-b", run: (view) => wrapSelection(view, "**", "**") },
  { key: "Mod-i", run: (view) => wrapSelection(view, "*", "*") },
  { key: "Mod-Shift-s", run: (view) => wrapSelection(view, "~~", "~~") },
  { key: "Mod-e", run: (view) => wrapSelection(view, "`", "`") },
  { key: "Mod-u", run: (view) => wrapSelection(view, "<u>", "</u>") },
]);

// ``` 입력 후 Enter → 자동으로 닫는 ``` 삽입
const autoCloseCodeBlock = keymap.of([
  {
    key: "Enter",
    run: (view) => {
      const { from } = view.state.selection.main;
      const line = view.state.doc.lineAt(from);
      if (/^```\w*$/.test(line.text)) {
        view.dispatch({
          changes: { from, insert: "\n\n```" },
          selection: { anchor: from + 1 },
        });
        return true;
      }
      return false;
    },
  },
]);

// 한국어 키보드 맥에서 ₩ → ` 변환
const wonToBacktick = EditorView.inputHandler.of((view, from, to, text) => {
  if (text === "₩") {
    view.dispatch({ changes: { from, to, insert: "`" }, selection: { anchor: from + 1 } });
    return true;
  }
  return false;
});

interface MarkdownEditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export function MarkdownEditor({ content = "", onChange }: MarkdownEditorProps) {
  const [value, setValue] = useState(content);
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const handleChange = useCallback(
    (val: string) => {
      setValue(val);
      onChange?.(val);
    },
    [onChange]
  );

  const getEditorView = (): EditorView | null => {
    return editorRef.current?.view ?? null;
  };

  const insertImageMarkdown = useCallback(
    async (file: File) => {
      const view = getEditorView();
      if (!view) return;

      const placeholderText = "![업로드 중...]()";
      const { from } = view.state.selection.main;
      view.dispatch({
        changes: { from, insert: placeholderText },
      });

      try {
        const formData = new FormData();
        formData.append("file", file);
        const { url } = await uploadImage(formData);

        const currentDoc = view.state.doc.toString();
        const placeholderIndex = currentDoc.indexOf(placeholderText);
        if (placeholderIndex !== -1) {
          const replacement = `![image](${url})`;
          view.dispatch({
            changes: {
              from: placeholderIndex,
              to: placeholderIndex + placeholderText.length,
              insert: replacement,
            },
          });
          handleChange(view.state.doc.toString());
        }
      } catch {
        const currentDoc = view.state.doc.toString();
        const placeholderIndex = currentDoc.indexOf(placeholderText);
        if (placeholderIndex !== -1) {
          view.dispatch({
            changes: {
              from: placeholderIndex,
              to: placeholderIndex + placeholderText.length,
              insert: "",
            },
          });
          handleChange(view.state.doc.toString());
        }
      }
    },
    [handleChange]
  );

  const handleImageUploadClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) insertImageMarkdown(file);
    };
    input.click();
  }, [insertImageMarkdown]);

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return false;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) insertImageMarkdown(file);
          return true;
        }
      }
      return false;
    },
    [insertImageMarkdown]
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      const file = event.dataTransfer?.files?.[0];
      if (file?.type.startsWith("image/")) {
        event.preventDefault();
        insertImageMarkdown(file);
        return true;
      }
      return false;
    },
    [insertImageMarkdown]
  );

  const eventHandlers = EditorView.domEventHandlers({
    paste: (event) => handlePaste(event),
    drop: (event) => handleDrop(event),
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white flex flex-col">
      <Toolbar editorView={getEditorView()} onImageUpload={handleImageUploadClick} />

      <div className="flex flex-1 min-h-[500px]">
        <div className="flex-1 overflow-y-auto border-r border-gray-200 max-lg:border-r-0">
          <CodeMirror
            ref={editorRef}
            value={value}
            onChange={handleChange}
            extensions={[
              autoCloseCodeBlock,
              markdownKeymap,
              markdown({ base: markdownLanguage, codeLanguages: languages }),
              EditorView.lineWrapping,
              wonToBacktick,
              eventHandlers,
            ]}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              highlightActiveLine: true,
              closeBrackets: false,
            }}
            placeholder="마크다운을 입력하세요..."
            className="min-h-[500px]"
          />
        </div>

        <div className="flex-1 hidden lg:block">
          <PreviewPane content={value} />
        </div>
      </div>
    </div>
  );
}
