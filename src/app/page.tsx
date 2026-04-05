import Link from "next/link";
import { getArticles } from "@/actions/articles";
import {
  getVisitorStats,
  getPopularArticles,
  getDailyPageViews,
  getTopReferrers,
  getVisitorLocations,
  type DailyPageViewCount,
  type ReferrerCount,
  type VisitorLocation,
} from "@/actions/analytics";
import { StatusBadge } from "@/components/articles/StatusBadge";
import { MiniVisitorMap } from "@/components/dashboard/MiniVisitorMap";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [statsResult, articlesResult, popularResult, dailyResult, referrersResult, locationsResult] =
    await Promise.allSettled([
      getVisitorStats(),
      getArticles(0, 5),
      getPopularArticles(),
      getDailyPageViews(thirtyDaysAgo, today),
      getTopReferrers(thirtyDaysAgo, today),
      getVisitorLocations(thirtyDaysAgo, today),
    ]);

  const stats = statsResult.status === "fulfilled" ? statsResult.value : null;
  const recentArticles = articlesResult.status === "fulfilled" ? articlesResult.value.content : [];
  const popularArticles = popularResult.status === "fulfilled" ? popularResult.value : [];
  const dailyViews = dailyResult.status === "fulfilled" ? dailyResult.value : [];
  const referrers = referrersResult.status === "fulfilled" ? referrersResult.value : [];
  const locations = locationsResult.status === "fulfilled" ? locationsResult.value : [];

  return (
    <div className="p-8">
      {/* 방문자 통계 */}
      <Link href="/analytics#overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="오늘 방문자" value={stats?.today} />
        <StatCard label="어제 방문자" value={stats?.yesterday} />
        <StatCard label="전체 방문자" value={stats?.total} />
      </Link>

      {/* 미니 차트 3종 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Link href="/analytics#daily" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">일별 페이지뷰</h3>
            <span className="text-xs text-blue-600">자세히 →</span>
          </div>
          <MiniLineChart data={dailyViews} />
        </Link>

        <Link href="/analytics#referrers" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">유입 경로</h3>
            <span className="text-xs text-blue-600">자세히 →</span>
          </div>
          <MiniReferrerChart data={referrers} />
        </Link>

        <Link href="/analytics#map" className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">방문자 위치</h3>
            <span className="text-xs text-blue-600">자세히 →</span>
          </div>
          <div className="h-[120px] rounded overflow-hidden bg-gray-100 pointer-events-none">
            <MiniVisitorMap locations={locations} />
          </div>
        </Link>
      </div>

      {/* 최근 글 & 인기 게시글 */}
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
                      <StatusBadge article={article} />
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
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">
        {(value ?? 0).toLocaleString()}
      </p>
    </div>
  );
}

function MiniLineChart({ data }: { data: DailyPageViewCount[] }) {
  const w = 280;
  const h = 80;
  const px = 4;
  const py = 4;

  // 최근 7일 고정
  const days: DailyPageViewCount[] = [];
  const dataMap = new Map(data.map((d) => [d.date, d.viewCount]));
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({ date: dateStr, viewCount: dataMap.get(dateStr) ?? 0 });
  }

  const maxCount = Math.max(...days.map((d) => d.viewCount), 1);
  const getX = (i: number) => px + (i / (days.length - 1)) * (w - px * 2);
  const getY = (v: number) => py + (h - py * 2) - (v / maxCount) * (h - py * 2);

  const linePath = days.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.viewCount)}`).join(" ");
  const areaPath = linePath + ` L ${getX(days.length - 1)} ${h - py} L ${getX(0)} ${h - py} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="miniAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#miniAreaGrad)" />
      <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
      {days.map((d, i) => (
        <circle key={d.date} cx={getX(i)} cy={getY(d.viewCount)} r="2" fill="#3b82f6" />
      ))}
    </svg>
  );
}

function MiniReferrerChart({ data }: { data: ReferrerCount[] }) {
  const top5 = data.slice(0, 5);
  const maxCount = top5.length > 0 ? Math.max(...top5.map((r) => r.viewCount), 1) : 1;

  if (top5.length === 0) {
    return <div className="h-[120px] flex items-center justify-center text-gray-400 text-xs">데이터 없음</div>;
  }

  return (
    <div className="space-y-1.5">
      {top5.map((ref) => (
        <div key={ref.referrer} className="flex items-center gap-2">
          <span className="text-xs text-gray-500 truncate w-20 shrink-0">{ref.referrer || "(직접)"}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full"
              style={{ width: `${(ref.viewCount / maxCount) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-8 text-right shrink-0">{ref.viewCount}</span>
        </div>
      ))}
    </div>
  );
}
