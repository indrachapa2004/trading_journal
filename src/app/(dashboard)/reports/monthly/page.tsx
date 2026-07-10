import { format } from "date-fns";

import { AdvancedStatsRibbon } from "@/components/dashboard/advanced-stats-ribbon";
import { SummaryRibbon } from "@/components/dashboard/summary-ribbon";
import { EquityCurve } from "@/components/dashboard/equity-curve";
import { MonthlyReportClient } from "@/components/reports/monthly-report-client";
import { WinLossChart } from "@/components/analytics/win-loss-chart";
import {
  getActiveAccount,
  getActiveAccountCurrency,
} from "@/lib/data/accounts";
import { getTrades } from "@/lib/data/trades";
import {
  computeAdvancedStats,
  computeWinLossDistribution,
} from "@/lib/analytics";
import { computeTradeStats } from "@/lib/trades";

export default async function MonthlyReportPage() {
  const now = new Date();
  const [trades, account, currency] = await Promise.all([
    getTrades(),
    getActiveAccount(),
    getActiveAccountCurrency(),
  ]);

  const monthTrades = trades.filter((t) => {
    const d = new Date(t.exit_at ?? t.entry_at);
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  });

  const stats = computeTradeStats(monthTrades);
  const advanced = computeAdvancedStats(monthTrades);
  const winLoss = computeWinLossDistribution(monthTrades);

  return (
    <>
      <MonthlyReportClient />
      <article className="mx-auto max-w-4xl space-y-8 bg-zinc-950 p-8 print:bg-white print:p-0 print:text-black">
        <header className="border-b border-zinc-800 pb-6 print:border-zinc-300">
          <p className="text-sm text-zinc-500 print:text-zinc-600">
            Monthly Trading Review
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-100 print:text-black">
            {format(now, "MMMM yyyy")}
          </h1>
          <p className="mt-2 text-sm text-zinc-400 print:text-zinc-600">
            {account?.name ?? "Account"} · Generated{" "}
            {format(now, "MMM d, yyyy")}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-medium text-zinc-200 print:text-black">
            Summary statistics
          </h2>
          <SummaryRibbon stats={stats} />
          <AdvancedStatsRibbon stats={advanced} currency={currency} />
        </section>

        <section className="space-y-4 print:break-inside-avoid">
          <h2 className="text-lg font-medium text-zinc-200 print:text-black">
            Equity curve
          </h2>
          <EquityCurve />
        </section>

        <section className="space-y-4 print:break-inside-avoid">
          <h2 className="text-lg font-medium text-zinc-200 print:text-black">
            Win / loss distribution
          </h2>
          <WinLossChart data={winLoss} />
        </section>

        <footer className="border-t border-zinc-800 pt-6 text-xs text-zinc-600 print:border-zinc-300">
          {monthTrades.length} trades this month · Tradventure
        </footer>
      </article>
    </>
  );
}
