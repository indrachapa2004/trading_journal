import { EquityCurve } from "@/components/dashboard/equity-curve";
import { AdvancedStatsRibbon } from "@/components/dashboard/advanced-stats-ribbon";
import { SummaryRibbon } from "@/components/dashboard/summary-ribbon";
import { BreakdownChart } from "@/components/analytics/breakdown-chart";
import { WinLossChart } from "@/components/analytics/win-loss-chart";
import { PageHeader } from "@/components/layout/page-header";
import { getActiveAccountCurrency } from "@/lib/data/accounts";
import { getTrades } from "@/lib/data/trades";
import {
  computeAdvancedStats,
  computeAssetClassBreakdown,
  computeSymbolBreakdown,
  computeTagBreakdown,
  computeTimeOfDayBreakdown,
  computeWinLossDistribution,
} from "@/lib/analytics";
import { computeTradeStats } from "@/lib/trades";
import { pageMain } from "@/lib/ui-classes";

export default async function AnalyticsPage() {
  const [trades, currency] = await Promise.all([
    getTrades(),
    getActiveAccountCurrency(),
  ]);

  const stats = computeTradeStats(trades);
  const advanced = computeAdvancedStats(trades);
  const winLoss = computeWinLossDistribution(trades);

  return (
    <main className={pageMain}>
      <PageHeader
        title="Analytics"
        description="Performance breakdowns, distributions, and advanced metrics"
      />

      <div className="space-y-6">
        <SummaryRibbon stats={stats} />
        <AdvancedStatsRibbon stats={advanced} currency={currency} />
        <EquityCurve />
      </div>

      <WinLossChart data={winLoss} />

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        <BreakdownChart
          title="By symbol"
          description="Top symbols by realized P&L"
          data={computeSymbolBreakdown(trades)}
        />
        <BreakdownChart
          title="By asset class"
          description="P&L across asset classes"
          data={computeAssetClassBreakdown(trades)}
        />
        <BreakdownChart
          title="By strategy tag"
          description="Performance by setup tag"
          data={computeTagBreakdown(trades)}
        />
        <BreakdownChart
          title="By time of day"
          description="Entry time session breakdown"
          data={computeTimeOfDayBreakdown(trades)}
        />
      </div>
    </main>
  );
}
