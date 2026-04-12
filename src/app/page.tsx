import {
  getOverview,
  getDailyPageViews,
  getTopReferrers,
} from "@/actions/analytics";
import { AnalyticsContent } from "@/components/analytics/AnalyticsContent";

export const dynamic = "force-dynamic";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default async function DashboardPage() {
  const to = formatDate(new Date());
  const from = formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

  const [overviewResult, dailyResult, referrersResult] = await Promise.allSettled([
    getOverview(from, to),
    getDailyPageViews(from, to),
    getTopReferrers(from, to),
  ]);

  return (
    <div className="p-8">
      <AnalyticsContent
        initialOverview={overviewResult.status === "fulfilled" ? overviewResult.value : null}
        initialDailyViews={dailyResult.status === "fulfilled" ? dailyResult.value : []}
        initialReferrers={referrersResult.status === "fulfilled" ? referrersResult.value : []}
        initialFrom={from}
        initialTo={to}
      />
    </div>
  );
}
