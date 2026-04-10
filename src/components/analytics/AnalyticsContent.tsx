"use client";

import { useState, useEffect } from "react";
import {
  getOverview,
  getDailyPageViews,
  getTopPages,
  getTopReferrers,
  getArticleAccessHistory,
  type AnalyticsOverview,
  type DailyPageViewCount,
  type PageViewCount,
  type ReferrerCount,
  type ArticleAccessHistory,
} from "@/actions/analytics";
import { VisitorMap } from "./VisitorMap";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { formatDateTime } from "@/lib/format-date-time";
import { X } from "lucide-react";

interface AnalyticsContentProps {
  initialOverview: AnalyticsOverview | null;
  initialDailyViews: DailyPageViewCount[];
  initialReferrers: ReferrerCount[];
  initialFrom: string;
  initialTo: string;
}

export function AnalyticsContent({
  initialOverview,
  initialDailyViews,
  initialReferrers,
  initialFrom,
  initialTo,
}: AnalyticsContentProps) {
  const [appliedFrom, setAppliedFrom] = useState(initialFrom);
  const [appliedTo, setAppliedTo] = useState(initialTo);
  const [overview, setOverview] = useState(initialOverview);
  const [dailyViews, setDailyViews] = useState(initialDailyViews);
  const [referrers, setReferrers] = useState(initialReferrers);
  const [isLoading, setIsLoading] = useState(false);

  function formatDate(d: Date) {
    return d.toISOString().split("T")[0];
  }

  async function handleDateChange(range: { from: Date; to: Date }) {
    const fromStr = formatDate(range.from);
    const toStr = formatDate(range.to);
    setAppliedFrom(fromStr);
    setAppliedTo(toStr);
    setIsLoading(true);
    try {
      const [o, d, r] = await Promise.all([
        getOverview(fromStr, toStr),
        getDailyPageViews(fromStr, toStr),
        getTopReferrers(fromStr, toStr),
      ]);
      setOverview(o);
      setDailyViews(d);
      setReferrers(r);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">분석</h1>
        <DateRangePicker
          from={new Date(appliedFrom + "T00:00:00")}
          to={new Date(appliedTo + "T00:00:00")}
          onChange={handleDateChange}
        />
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 py-20">불러오는 중...</div>
      ) : (
        <div className="space-y-6">
          <div id="overview" className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500">총 페이지뷰</div>
              <div className="text-3xl font-bold mt-1">
                {(overview?.totalPageViews ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500">순 방문자</div>
              <div className="text-3xl font-bold mt-1">
                {(overview?.uniqueVisitors ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div id="daily" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">일별 페이지뷰</h2>
            <DailyLineChart data={dailyViews} />
          </div>

          <PopularPages />

          <div id="referrers">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">유입 경로</h2>
              {referrers.length === 0 ? (
                <div className="text-gray-500 text-center py-8">데이터가 없습니다</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b">
                      <th className="text-left py-2">출처</th>
                      <th className="text-right py-2">방문수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrers.slice(0, 10).map((ref) => (
                      <tr key={ref.referrer} className="border-b last:border-0">
                        <td className="py-2 text-sm truncate max-w-[200px]">{ref.referrer}</td>
                        <td className="py-2 text-sm text-right font-medium">{ref.viewCount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <VisitorMap from={appliedFrom} to={appliedTo} />
        </div>
      )}
    </>
  );
}

type PopularPeriod = "daily" | "weekly" | "monthly" | "yearly";

const PERIOD_LABELS: Record<PopularPeriod, string> = {
  daily: "일간",
  weekly: "주간",
  monthly: "월간",
  yearly: "연간",
};

function getPeriodRange(period: PopularPeriod): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  switch (period) {
    case "daily": from.setDate(from.getDate() - 1); break;
    case "weekly": from.setDate(from.getDate() - 7); break;
    case "monthly": from.setMonth(from.getMonth() - 1); break;
    case "yearly": from.setFullYear(from.getFullYear() - 1); break;
  }
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { from: fmt(from), to: fmt(to) };
}

function PopularPages() {
  const [period, setPeriod] = useState<PopularPeriod>("weekly");
  const [pages, setPages] = useState<PageViewCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalPage, setModalPage] = useState<PageViewCount | null>(null);
  const [accessHistory, setAccessHistory] = useState<ArticleAccessHistory[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);

  async function fetchPages(p: PopularPeriod) {
    setIsLoading(true);
    try {
      const { from, to } = getPeriodRange(p);
      const data = await getTopPages(from, to);
      setPages(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPages(period);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePeriodChange(p: PopularPeriod) {
    setPeriod(p);
    fetchPages(p);
  }

  async function handlePageClick(page: PageViewCount) {
    setModalPage(page);
    setIsModalLoading(true);
    try {
      const { from, to } = getPeriodRange(period);
      const data = await getArticleAccessHistory(page.articleId, from, to);
      setAccessHistory(data);
    } catch {
      setAccessHistory([]);
    } finally {
      setIsModalLoading(false);
    }
  }

  function closeModal() {
    setModalPage(null);
    setAccessHistory([]);
  }

  return (
    <div id="popular" className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">인기 페이지</h2>
        <div className="flex gap-1">
          {(Object.keys(PERIOD_LABELS) as PopularPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-3 py-1 text-sm rounded ${
                period === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="text-gray-400 text-center py-8">불러오는 중...</div>
      ) : pages.length === 0 ? (
        <div className="text-gray-500 text-center py-8">데이터가 없습니다</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="text-left py-2">#</th>
              <th className="text-left py-2">제목</th>
              <th className="text-right py-2">조회수</th>
            </tr>
          </thead>
          <tbody>
            {pages.slice(0, 10).map((page, i) => (
              <tr
                key={page.articleId}
                className="border-b last:border-0 cursor-pointer transition-colors hover:bg-blue-50"
                onClick={() => handlePageClick(page)}
              >
                <td className="py-2 text-sm text-gray-400 w-8">{i + 1}</td>
                <td className="py-2 text-sm truncate max-w-[300px] text-blue-600">{page.title}</td>
                <td className="py-2 text-sm text-right font-medium">{page.viewCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 접속 이력 모달 */}
      {modalPage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={closeModal}>
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="min-w-0 flex-1 mr-2">
                <h3 className="text-lg font-semibold truncate">{modalPage.title}</h3>
                <p className="text-sm text-gray-500">총 {modalPage.viewCount.toLocaleString()}회 조회</p>
              </div>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 본문 */}
            <div className="overflow-y-auto p-4">
              {isModalLoading ? (
                <div className="text-gray-400 text-center py-8">불러오는 중...</div>
              ) : accessHistory.length === 0 ? (
                <div className="text-gray-400 text-center py-8">접속 이력이 없습니다</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b">
                      <th className="text-left py-2">IP</th>
                      <th className="text-left py-2">지역</th>
                      <th className="text-right py-2">접속 시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessHistory.map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 text-sm font-mono text-gray-700">{item.ipAddress}</td>
                        <td className="py-2 text-sm text-gray-600">
                          {[item.city, item.country].filter(Boolean).join(", ") || "-"}
                        </td>
                        <td className="py-2 text-sm text-right text-gray-600 whitespace-nowrap">
                          {formatDateTime(item.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* 푸터 */}
            {!isModalLoading && accessHistory.length > 0 && (
              <div className="border-t px-4 py-3 text-sm text-gray-500 text-right">
                총 {accessHistory.length}건
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DailyLineChart({ data }: { data: DailyPageViewCount[] }) {
  // 최근 7일 고정 (오늘이 가장 오른쪽)
  const days: DailyPageViewCount[] = [];
  const dataMap = new Map(data.map((d) => [d.date, d.viewCount]));
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({ date: dateStr, viewCount: dataMap.get(dateStr) ?? 0 });
  }

  const width = 800;
  const height = 200;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 50;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const maxCount = Math.max(...days.map((d) => d.viewCount), 1);

  // y축 눈금 계산
  const yTicks: number[] = [];
  if (maxCount <= 5) {
    for (let i = 0; i <= maxCount; i++) yTicks.push(i);
  } else {
    const step = Math.ceil(maxCount / 5);
    for (let i = 0; i <= maxCount; i += step) yTicks.push(i);
    if (yTicks[yTicks.length - 1] < maxCount) yTicks.push(maxCount);
  }

  const getX = (i: number) => paddingLeft + (i / (days.length - 1)) * chartW;
  const getY = (v: number) => paddingTop + chartH - (v / maxCount) * chartH;

  const linePath = days.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.viewCount)}`).join(" ");
  const areaPath = linePath + ` L ${getX(days.length - 1)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* y축 눈금 & 가이드라인 */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={paddingLeft}
              y1={getY(tick)}
              x2={width - paddingRight}
              y2={getY(tick)}
              stroke="#e5e7eb"
              strokeDasharray={tick === 0 ? "0" : "4 2"}
            />
            <text
              x={paddingLeft - 8}
              y={getY(tick) + 4}
              textAnchor="end"
              className="fill-gray-400"
              fontSize="11"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* area fill */}
        <path d={areaPath} fill="url(#areaGradient)" />
        {/* line */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
        {/* dots */}
        {days.map((d, i) => (
          <g key={d.date}>
            <circle cx={getX(i)} cy={getY(d.viewCount)} r="3" fill="#3b82f6" />
            <title>{`${d.date}: ${d.viewCount}회`}</title>
          </g>
        ))}

        {/* x축 라벨 (7일이니 전부 표시) */}
        {days.map((d, i) => (
          <text
            key={d.date}
            x={getX(i)}
            y={height - paddingBottom + 20}
            textAnchor="middle"
            className="fill-gray-400"
            fontSize="10"
          >
            {d.date.slice(5)}
          </text>
        ))}
      </svg>
    </div>
  );
}
