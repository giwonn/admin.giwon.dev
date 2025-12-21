"use client";

import { Editor } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor;
  showSource: boolean;
  onToggleSource: () => void;
}

export function Toolbar({ editor, showSource, onToggleSource }: ToolbarProps) {
  const buttonClass = (isActive: boolean) =>
    `px-3 py-1.5 text-sm font-medium rounded ${
      isActive
        ? "bg-gray-200 text-gray-900"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
      {!showSource && (
        <>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={buttonClass(editor.isActive("bold"))}
            title="굵게"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={buttonClass(editor.isActive("italic"))}
            title="기울임"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={buttonClass(editor.isActive("strike"))}
            title="취소선"
          >
            S
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={buttonClass(editor.isActive("code"))}
            title="인라인 코드"
          >
            {"</>"}
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={buttonClass(editor.isActive("heading", { level: 1 }))}
            title="제목 1"
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={buttonClass(editor.isActive("heading", { level: 2 }))}
            title="제목 2"
          >
            H2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={buttonClass(editor.isActive("heading", { level: 3 }))}
            title="제목 3"
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={buttonClass(editor.isActive("bulletList"))}
            title="순서 없는 목록"
          >
            • 목록
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={buttonClass(editor.isActive("orderedList"))}
            title="순서 있는 목록"
          >
            1. 목록
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={buttonClass(editor.isActive("blockquote"))}
            title="인용"
          >
            인용
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={buttonClass(editor.isActive("codeBlock"))}
            title="코드 블록"
          >
            코드
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={buttonClass(false)}
            title="구분선"
          >
            ─
          </button>
        </>
      )}

      <div className="flex-1" />

      <button
        onClick={onToggleSource}
        className={`px-3 py-1.5 text-sm font-medium rounded ${
          showSource
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        title={showSource ? "에디터 보기" : "소스 보기"}
      >
        {showSource ? "에디터" : "마크다운"}
      </button>
    </div>
  );
}
