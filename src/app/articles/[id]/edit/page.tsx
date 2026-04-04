"use client";

import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { getArticle, updateArticle, publishArticle, scheduleArticle } from "@/actions/articles";
import { PublishPanel } from "@/components/articles/PublishPanel";
import type { Article } from "@/types";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((mod) => mod.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-300 rounded-lg bg-white min-h-[400px] flex items-center justify-center text-gray-400">
        에디터 로딩 중...
      </div>
    ),
  }
);

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showPublishPanel, setShowPublishPanel] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await getArticle(id);
        setTitle(data.title);
        setContent(data.content);
        setArticle(data);
      } catch {
        setError("글을 불러올 수 없습니다.");
      } finally {
        setIsFetching(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setError("제목을 입력하세요.");
      return;
    }

    setIsLoading(true);
    setSaveStatus("saving");
    setError(null);

    try {
      const updated = await updateArticle(id, title, content);
      setArticle(updated);
      setSaveStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      setSaveStatus("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishNow = async () => {
    await updateArticle(id, title, content);
    await publishArticle(id);
    router.push("/articles");
  };

  const handleSchedule = async (publishedAt: string) => {
    await updateArticle(id, title, content);
    await scheduleArticle(id, publishedAt);
    router.push("/articles");
  };

  if (isFetching) {
    return (
      <div className="p-8 text-center text-gray-500">불러오는 중...</div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">글 수정</h1>
          {saveStatus === "saving" && (
            <span className="text-sm text-gray-400">저장 중...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-sm text-green-500">저장됨</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            임시저장
          </button>
          <button
            onClick={() => setShowPublishPanel(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            발행
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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

      <PublishPanel
        isOpen={showPublishPanel}
        onClose={() => setShowPublishPanel(false)}
        onPublishNow={handlePublishNow}
        onSchedule={handleSchedule}
      />
    </div>
  );
}
