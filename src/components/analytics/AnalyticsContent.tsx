"use client";

import { useState, useEffect } from "react";
import {
  getOverview,
  getDailyPageViews,
  getTopPages,
  getTopReferrers,
  type AnalyticsOverview,
  type DailyPageViewCount,
  type PageViewCount,
  type ReferrerCount,
} from "@/actions/analytics";
import { VisitorMap } from "./VisitorMap";

interface AnalyticsContentProps {
  initialOverview: AnalyticsOverview | null;
  initialDailyViews: DailyPageViewCount[];
  initialTopPages: PageViewCount[];
  initialReferrers: ReferrerCount[];
  initialFrom: string;
  initialTo: string;
}

export function AnalyticsContent({
  initialOverview,
  initialDailyViews,
  initialTopPages,
  initialReferrers,
  initialFrom,
  initialTo,
}: AnalyticsContentProps) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [appliedFrom, setAppliedFrom] = useState(initialFrom);
  const [appliedTo, setAppliedTo] = useState(initialTo);
  const [overview, setOverview] = useState(initialOverview);
  const [dailyViews, setDailyViews] = useState(initialDailyViews);
  const [topPages, setTopPages] = useState(initialTopPages);
  const [referrers, setReferrers] = useState(initialReferrers);
  const [isLoading, setIsLoading] = useState(false);

  const isDirty = from !== appliedFrom || to !== appliedTo;

  async function handleSearch() {
    const clampedFrom = from.slice(0, 10);
    const clampedTo = to.slice(0, 10);
    setFrom(clampedFrom);
    setTo(clampedTo);
    setAppliedFrom(clampedFrom);
    setAppliedTo(clampedTo);
    setIsLoading(true);
    try {
      const [o, d, p, r] = await Promise.all([
        getOverview(clampedFrom, clampedTo),
        getDailyPageViews(clampedFrom, clampedTo),
        getTopPages(clampedFrom, clampedTo),
        getTopReferrers(clampedFrom, clampedTo),
      ]);
      setOverview(o);
      setDailyViews(d);
      setTopPages(p);
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
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
          />
          <span className="text-gray-500">~</span>
          <input
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={!isDirty || isLoading}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            확인
          </button>
        </div>
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

          <div id="popular" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">인기 페이지</h2>
            {topPages.length === 0 ? (
              <div className="text-gray-500 text-center py-8">데이터가 없습니다</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="text-left py-2">#</th>
                    <th className="text-left py-2">경로</th>
                    <th className="text-right py-2">조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.slice(0, 10).map((page, i) => (
                    <tr key={page.path} className="border-b last:border-0">
                      <td className="py-2 text-sm text-gray-400 w-8">{i + 1}</td>
                      <td className="py-2 text-sm truncate max-w-[300px]">{page.path}</td>
                      <td className="py-2 text-sm text-right font-medium">{page.viewCount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

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
