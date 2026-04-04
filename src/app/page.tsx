import Link from "next/link";
import { getArticles } from "@/actions/articles";
import { getVisitorStats, getPopularArticles } from "@/actions/analytics";
import { StatusBadge } from "@/components/articles/StatusBadge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [statsResult, articlesResult, popularResult] = await Promise.allSettled([
    getVisitorStats(),
    getArticles(undefined, 0, 5),
    getPopularArticles(),
  ]);

  const stats = statsResult.status === "fulfilled" ? statsResult.value : null;
  const recentArticles = articlesResult.status === "fulfilled" ? articlesResult.value.content : [];
  const popularArticles = popularResult.status === "fulfilled" ? popularResult.value : [];

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="오늘 방문자" value={stats?.today} />
        <StatCard label="어제 방문자" value={stats?.yesterday} />
        <StatCard label="전체 방문자" value={stats?.total} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">최근 글</h2>
            <Link href="/articles" className="text-sm text-blue-600 hover:underline">
              전체 보기
            </Link>
          </div>
          {recentArticles.length === 0 ? (
            <div className="p-8 text-center text-gray-400">작성된 글이 없습니다.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentArticles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/articles/${article.id}`}
                    className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900 text-sm">{article.title}</span>
                      <StatusBadge status={article.status} />
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">인기 게시글</h2>
          </div>
          {popularArticles.length === 0 ? (
            <div className="p-8 text-center text-gray-400">데이터 수집 중...</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {popularArticles.map((article, i) => (
                <li key={article.id}>
                  <Link
                    href={`/articles/${article.id}`}
                    className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                      <span className="font-medium text-gray-900 text-sm">{article.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">{article.viewCount.toLocaleString()}회</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">
        {value === undefined ? "-" : value.toLocaleString()}
      </p>
    </div>
  );
}
