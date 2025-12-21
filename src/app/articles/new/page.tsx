"use client";

import Link from "next/link";
import { useState } from "react";
import { TiptapEditor } from "@/components/editor/TiptapEditor";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: API 연동
    console.log({ title, content });
    alert("저장되었습니다! (Mock)");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ← 돌아가기
            </Link>
            <h1 className="text-xl font-bold">새 글 작성</h1>
          </div>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <TiptapEditor content={content} onChange={setContent} />
        </form>
      </main>
    </div>
  );
}
