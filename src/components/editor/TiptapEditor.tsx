"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Markdown } from "tiptap-markdown";
import { useState, useCallback, useEffect } from "react";
import { Toolbar } from "./Toolbar";
import { FontSize } from "./extensions/FontSize";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export function TiptapEditor({ content = "", onChange }: TiptapEditorProps) {
  const [showSource, setShowSource] = useState(false);
  const [markdownSource, setMarkdownSource] = useState("");
  const [, setEditorState] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TextStyle,
      FontSize,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      ImageResize.configure({
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: "내용을 입력하세요...",
      }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const markdown = (editor.storage as any).markdown.getMarkdown();
      onChange?.(markdown);
    },
    editorProps: {
      attributes: {
        class:
          "max-w-none focus:outline-none min-h-[400px] p-4",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of items) {
            if (item.type.startsWith("image/")) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) {
                handleImageUpload(file);
              }
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  const handleImageUpload = useCallback(
    async (file: File) => {
      // TODO: 실제 이미지 업로드 API 연동
      // 현재는 base64로 처리
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        editor?.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    },
    [editor]
  );

  const toggleSource = useCallback(() => {
    if (!editor) return;

    if (!showSource) {
      // WYSIWYG -> 소스
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const markdown = (editor.storage as any).markdown.getMarkdown();
      setMarkdownSource(markdown);
    } else {
      // 소스 -> WYSIWYG
      editor.commands.setContent(markdownSource);
    }
    setShowSource(!showSource);
  }, [editor, showSource, markdownSource]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownSource(e.target.value);
    onChange?.(e.target.value);
  };

  // 에디터 상태 변경 시 툴바 리렌더링을 위한 이벤트 리스너
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setEditorState((prev) => prev + 1);
    };

    editor.on("selectionUpdate", handleUpdate);
    editor.on("transaction", handleUpdate);

    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <Toolbar editor={editor} showSource={showSource} onToggleSource={toggleSource} onImageUpload={handleImageUpload} />

      {showSource ? (
        <textarea
          value={markdownSource}
          onChange={handleSourceChange}
          className="w-full min-h-[400px] p-4 font-mono text-sm focus:outline-none resize-none"
          placeholder="마크다운을 입력하세요..."
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
