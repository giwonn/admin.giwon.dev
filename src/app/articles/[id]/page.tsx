"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getArticle } from "@/actions/articles";
import { DeleteArticleButton } from "@/components/articles/DeleteArticleButton";
import type { Article } from "@/types";

export default function ArticleDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [article, setArticle] = useState<Article | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await getArticle(id);
        setArticle(data);
      } catch {
        // error
      } finally {
        setIsFetching(false);
      }
    }
    fetchArticle();
  }, [id]);

  if (isFetching) {
    return <div className="p-8 text-center text-gray-500">불러오는 중...</div>;
  }

  if (!article) {
    return <div className="p-8 text-center text-gray-500">글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <div className="flex gap-2">
          <Link
            href={`/articles/${id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            수정
          </Link>
          <DeleteArticleButton articleId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 글 정보 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">글 정보</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">ID</dt>
                <dd className="font-medium">{article.id}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">작성일</dt>
                <dd className="font-medium">{new Date(article.createdAt).toLocaleDateString("ko-KR")}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">수정일</dt>
                <dd className="font-medium">{new Date(article.updatedAt).toLocaleDateString("ko-KR")}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">글자 수</dt>
                <dd className="font-medium">{article.content.length.toLocaleString()}자</dd>
              </div>
            </dl>
          </div>

          {/* 본문 미리보기 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">본문 미리보기</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {article.content.substring(0, 500)}
              {article.content.length > 500 && "..."}
            </div>
          </div>
        </div>

        {/* 사이드 - 통계 (추후 API 연동) */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">통계</h2>
            <div className="text-sm text-gray-500 text-center py-4">
              데이터 수집 중...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
