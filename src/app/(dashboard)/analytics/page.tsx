import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getActiveAccountCurrency } from "@/lib/data/accounts";
import { getTrades } from "@/lib/data/trades";
import { pageMain } from "@/lib/ui-classes";

export default async function AnalyticsPage() {
  const [trades, currency] = await Promise.all([
    getTrades(),
    getActiveAccountCurrency(),
  ]);

  return (
    <div className={pageMain}>
      <PageHeader
        title="Analytics"
        description="Performance breakdowns, distributions, and advanced metrics"
      />

      {trades.length === 0 ? (
        <EmptyState
          icon="BarChart3"
          title="No data yet"
          description="Log at least a few trades to see performance analytics, equity curves, and breakdowns."
          actionLabel="Log a trade"
          actionHref="/add-trade"
          secondaryHint="Analytics and charts appear after you've closed a few trades."
        />
      ) : (
        <AnalyticsOverview trades={trades} currency={currency} />
      )}
    </div>
  );
}
