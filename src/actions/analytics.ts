"use server";

import { apiClient } from "@/lib/api";

export interface AnalyticsOverview {
  totalPageViews: number;
  uniqueVisitors: number;
}

export interface DailyPageViewCount {
  date: string;
  viewCount: number;
}

export interface PageViewCount {
  path: string;
  viewCount: number;
}

export interface ReferrerCount {
  referrer: string;
  viewCount: number;
}

export async function getOverview(from: string, to: string): Promise<AnalyticsOverview> {
  return apiClient<AnalyticsOverview>(`/admin/analytics/overview?from=${from}&to=${to}`);
}

export async function getVisitorStats(): Promise<{ today: number; yesterday: number; total: number }> {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - 30);
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  return apiClient<{ today: number; yesterday: number; total: number }>(
    `/admin/analytics/overview?from=${formatDate(from)}&to=${formatDate(today)}`
  );
}

export async function getDailyPageViews(from: string, to: string): Promise<DailyPageViewCount[]> {
  return apiClient<DailyPageViewCount[]>(`/admin/analytics/page-views?from=${from}&to=${to}`);
}

export async function getTopPages(from: string, to: string): Promise<PageViewCount[]> {
  return apiClient<PageViewCount[]>(`/admin/analytics/top-pages?from=${from}&to=${to}`);
}

export async function getTopReferrers(from: string, to: string): Promise<ReferrerCount[]> {
  return apiClient<ReferrerCount[]>(`/admin/analytics/referrers?from=${from}&to=${to}`);
}
