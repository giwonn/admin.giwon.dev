import Link from "next/link";
import { getArticles } from "@/actions/articles";
import { getVisitorStats, getPopularArticles, getDailyPageViews } from "@/actions/analytics";
import { StatusBadge } from "@/components/articles/StatusBadge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [statsResult, articlesResult, popularResult, dailyResult] = await Promise.allSettled([
    getVisitorStats(),
    getArticles(undefined, 0, 5),
    getPopularArticles(),
    getDailyPageViews(thirtyDaysAgo, today),
  ]);

  const stats = statsResult.status === "fulfilled" ? statsResult.value : null;
  const recentArticles = articlesResult.status === "fulfilled" ? articlesResult.value.content : [];
  const popularArticles = popularResult.status === "fulfilled" ? popularResult.value : [];
  const dailyViews = dailyResult.status === "fulfilled" ? dailyResult.value : [];

  return (
    <div className="p-8">
      {/* 방문자 통계 → 클릭 시 분석 페이지 */}
      <Link href="/analytics#overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="오늘 방문자" value={stats?.today} />
        <StatCard label="어제 방문자" value={stats?.yesterday} />
        <StatCard label="전체 방문자" value={stats?.total} />
      </Link>

      {/* 일별 페이지뷰 스파크라인 */}
      {dailyViews.length > 0 && (
        <Link href="/analytics#daily" className="block bg-white rounded-lg shadow p-4 mb-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-700">최근 30일 페이지뷰</h2>
            <span className="text-xs text-blue-600">자세히 →</span>
          </div>
          <div className="flex items-end gap-[2px] h-12">
            {dailyViews.map((day) => {
              const maxCount = Math.max(...dailyViews.map((d) => d.viewCount), 1);
              const height = Math.max(2, (day.viewCount / maxCount) * 48);
              return (
                <div
                  key={day.date}
                  className="flex-1 bg-blue-400 rounded-t-sm"
                  style={{ height: `${height}px` }}
                  title={`${day.date}: ${day.viewCount}회`}
                />
              );
            })}
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">인기 게시글</h2>
            <Link href="/analytics#popular" className="text-sm text-blue-600 hover:underline">
              자세히
            </Link>
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

      {/* 분석 요약 링크들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/analytics#daily" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-gray-700">일별 페이지뷰</h3>
          <p className="text-xs text-gray-400 mt-1">일별 추이 확인 →</p>
        </Link>
        <Link href="/analytics#referrers" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-gray-700">유입 경로</h3>
          <p className="text-xs text-gray-400 mt-1">어디서 왔는지 확인 →</p>
        </Link>
        <Link href="/analytics#map" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-gray-700">방문자 위치</h3>
          <p className="text-xs text-gray-400 mt-1">지도로 확인 →</p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">
        {value === undefined ? "-" : value.toLocaleString()}
      </p>
    </div>
  );
}
