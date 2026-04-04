"use client";

import { useState, useEffect } from "react";
import {
  getOverview,
  getDailyPageViews,
  getTopReferrers,
  type AnalyticsOverview,
  type DailyPageViewCount,
  type ReferrerCount,
} from "@/actions/analytics";
import { VisitorMap } from "./VisitorMap";

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
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [overview, setOverview] = useState(initialOverview);
  const [dailyViews, setDailyViews] = useState(initialDailyViews);
  const [referrers, setReferrers] = useState(initialReferrers);
  const [isLoading, setIsLoading] = useState(false);

  const isDateChanged = from !== initialFrom || to !== initialTo;

  useEffect(() => {
    if (!isDateChanged) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [o, d, r] = await Promise.all([
          getOverview(from, to),
          getDailyPageViews(from, to),
          getTopReferrers(from, to),
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
    fetchData();
  }, [from, to, isDateChanged]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">분석</h1>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
          />
          <span className="text-gray-500">~</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
          />
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
            {dailyViews.length === 0 ? (
              <div className="text-gray-500 text-center py-8">데이터가 없습니다</div>
            ) : (
              <div className="space-y-1">
                {dailyViews.map((day) => (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-24 shrink-0">{day.date}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (day.viewCount / Math.max(...dailyViews.map((d) => d.viewCount))) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{day.viewCount}</span>
                  </div>
                ))}
              </div>
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

          <VisitorMap from={from} to={to} />
        </div>
      )}
    </>
  );
}
