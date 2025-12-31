"use client";

import { Editor } from "@tiptap/react";
import { useState, useRef, useEffect } from "react";

interface ToolbarProps {
  editor: Editor;
  showSource: boolean;
  onToggleSource: () => void;
  onImageUpload: (file: File) => void;
}

const FONT_SIZES = [
  { label: "작게", value: "0.875rem" },
  { label: "기본", value: null },
  { label: "크게", value: "1.125rem" },
  { label: "더 크게", value: "1.25rem" },
  { label: "매우 크게", value: "1.5rem" },
];

export function Toolbar({ editor, showSource, onToggleSource, onImageUpload }: ToolbarProps) {
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const fontSizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target as Node)) {
        setShowFontSizeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttonClass = (isActive: boolean) =>
    `px-3 py-1.5 text-sm font-medium rounded ${
      isActive
        ? "bg-gray-200 text-gray-900"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  // 버튼 클릭 시 에디터 포커스 유지
  const preventFocusLoss = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleImageClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImageUpload(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
      {!showSource && (
        <>
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={buttonClass(editor.isActive("bold"))}
            title="굵게"
          >
            B
          </button>
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={buttonClass(editor.isActive("italic"))}
            title="기울임"
          >
            I
          </button>
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={buttonClass(editor.isActive("strike"))}
            title="취소선"
          >
            S
          </button>
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={buttonClass(editor.isActive("code"))}
            title="인라인 코드"
          >
            {"</>"}
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => {
              if (editor.isActive("heading", { level: 1 })) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().setHeading({ level: 1 }).run();
              }
            }}
            className={buttonClass(editor.isActive("heading", { level: 1 }))}
            title="제목 1"
          >
            H1
          </button>
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => {
              if (editor.isActive("heading", { level: 2 })) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().setHeading({ level: 2 }).run();
              }
            }}
            className={buttonClass(editor.isActive("heading", { level: 2 }))}
            title="제목 2"
          >
            H2
          </button>
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => {
              if (editor.isActive("heading", { level: 3 })) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().setHeading({ level: 3 }).run();
              }
            }}
            className={buttonClass(editor.isActive("heading", { level: 3 }))}
            title="제목 3"
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={buttonClass(editor.isActive("bulletList"))}
            title="순서 없는 목록"
          >
            • 목록
          </button>
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={buttonClass(editor.isActive("orderedList"))}
            title="순서 있는 목록"
          >
            1. 목록
          </button>
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={buttonClass(editor.isActive("blockquote"))}
            title="인용"
          >
            인용
          </button>
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={buttonClass(editor.isActive("codeBlock"))}
            title="코드 블록"
          >
            코드
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={buttonClass(false)}
            title="구분선"
          >
            ─
          </button>
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={handleImageClick}
            className={buttonClass(false)}
            title="이미지 추가"
          >
            🖼️
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <div className="relative" ref={fontSizeRef}>
            <button
              type="button"
              onMouseDown={preventFocusLoss}
              onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
              className={buttonClass(false)}
              title="글자 크기"
            >
              가
            </button>
            {showFontSizeMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[100px]">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.label}
                    type="button"
                    onMouseDown={preventFocusLoss}
                    onClick={() => {
                      if (size.value) {
                        editor.chain().focus().setFontSize(size.value).run();
                      } else {
                        editor.chain().focus().unsetFontSize().run();
                      }
                      setShowFontSizeMenu(false);
                    }}
                    className="block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100"
                    style={{ fontSize: size.value || undefined }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex-1" />

      <button
        type="button"
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
