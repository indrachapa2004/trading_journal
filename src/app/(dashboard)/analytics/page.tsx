import { EquityCurve } from "@/components/dashboard/equity-curve";
import { AdvancedStatsRibbon } from "@/components/dashboard/advanced-stats-ribbon";
import { SummaryRibbon } from "@/components/dashboard/summary-ribbon";
import { BreakdownChart } from "@/components/analytics/breakdown-chart";
import { WinLossChart } from "@/components/analytics/win-loss-chart";
import {
  getActiveAccountCurrency,
} from "@/lib/data/accounts";
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

export default async function AnalyticsPage() {
  const [trades, currency] = await Promise.all([
    getTrades(),
    getActiveAccountCurrency(),
  ]);

  const stats = computeTradeStats(trades);
  const advanced = computeAdvancedStats(trades);
  const winLoss = computeWinLossDistribution(trades);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Performance breakdowns, distributions, and advanced metrics
        </p>
      </div>

      <SummaryRibbon stats={stats} />
      <AdvancedStatsRibbon stats={advanced} currency={currency} />

      <EquityCurve />

      <WinLossChart data={winLoss} />

      <div className="grid gap-6 lg:grid-cols-2">
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
    </div>
  );
}
