"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getArticles } from "@/actions/articles";
import { getVisitorStats } from "@/actions/analytics";
import { StatusBadge } from "@/components/articles/StatusBadge";
import type { Article } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<{ today: number; yesterday: number; total: number } | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, articlesData] = await Promise.allSettled([
          getVisitorStats(),
          getArticles(undefined, 0, 5),
        ]);

        if (statsData.status === "fulfilled") {
          setStats(statsData.value);
        }
        if (articlesData.status === "fulfilled") {
          setRecentArticles(articlesData.value.content);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-8">
      {/* 방문자 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="오늘 방문자"
          value={stats?.today}
          isLoading={isLoading}
        />
        <StatCard
          label="어제 방문자"
          value={stats?.yesterday}
          isLoading={isLoading}
        />
        <StatCard
          label="전체 방문자"
          value={stats?.total}
          isLoading={isLoading}
        />
      </div>

      {/* 최근 글 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">최근 글</h2>
          <Link href="/articles" className="text-sm text-blue-600 hover:underline">
            전체 보기
          </Link>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">불러오는 중...</div>
        ) : recentArticles.length === 0 ? (
          <div className="p-8 text-center text-gray-400">작성된 글이 없습니다.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentArticles.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/articles/${article.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{article.title}</span>
                    <StatusBadge status={article.status} />
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(article.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: number | undefined;
  isLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      {isLoading ? (
        <div className="h-8 w-16 bg-gray-100 animate-pulse rounded" />
      ) : (
        <p className="text-2xl font-bold text-gray-900">
          {value?.toLocaleString() ?? "-"}
        </p>
      )}
    </div>
  );
}
