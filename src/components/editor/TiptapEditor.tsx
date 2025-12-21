"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { useState, useCallback } from "react";
import { Toolbar } from "./Toolbar";

interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export function TiptapEditor({ content = "", onChange }: TiptapEditorProps) {
  const [showSource, setShowSource] = useState(false);
  const [markdownSource, setMarkdownSource] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
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
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] p-4",
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

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <Toolbar editor={editor} showSource={showSource} onToggleSource={toggleSource} />

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
