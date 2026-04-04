"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { publishArticle } from "@/actions/articles";

export function PublishButton({ articleId }: { articleId: number }) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishArticle(articleId);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "발행에 실패했습니다.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <button
      onClick={handlePublish}
      disabled={isPublishing}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
    >
      {isPublishing ? "발행 중..." : "발행"}
    </button>
  );
}
