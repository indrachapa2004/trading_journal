import Link from "next/link";

import { AdvancedStatsRibbon } from "@/components/dashboard/advanced-stats-ribbon";
import { EquityCurve } from "@/components/dashboard/equity-curve";
import { MonthlyGoalsCard } from "@/components/dashboard/monthly-goals";
import { PositionSizeCalculator } from "@/components/dashboard/position-size-calculator";
import { SummaryRibbon } from "@/components/dashboard/summary-ribbon";
import { PageHeader } from "@/components/layout/page-header";
import { RiskLimitBanner } from "@/components/layout/risk-limit-banner";
import { TradesTableWithSheet } from "@/components/trades/trades-table-with-sheet";
import { LinkButton } from "@/components/ui/link-button";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { upsertMonthlyGoal } from "@/app/(dashboard)/settings/actions";
import {
  getActiveAccount,
  getActiveAccountCurrency,
  getMonthlyGoal,
} from "@/lib/data/accounts";
import { getTrades } from "@/lib/data/trades";
import { computeAdvancedStats } from "@/lib/analytics";
import { computeTradeStats } from "@/lib/trades";
import { cn } from "@/lib/utils";
import { pageMain, sectionLabel, terminalCard } from "@/lib/ui-classes";

export default async function DashboardPage() {
  const now = new Date();
  const [tradeList, account, currency, goal] = await Promise.all([
    getTrades(),
    getActiveAccount(),
    getActiveAccountCurrency(),
    getMonthlyGoal(now.getFullYear(), now.getMonth() + 1),
  ]);

  const stats = computeTradeStats(tradeList);
  const advanced = computeAdvancedStats(tradeList);
  const recentTrades = tradeList.slice(0, 5);

  const monthTrades = tradeList.filter((t) => {
    const d = new Date(t.exit_at ?? t.entry_at);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      t.exit_price != null
    );
  });
  const monthStats = computeTradeStats(monthTrades);

  return (
    <main className={pageMain}>
        <PageHeader
          title="Dashboard"
          description={`${account?.name ?? "Portfolio"} · Terminal overview`}
        >
          <LinkButton href="/reports/monthly" variant="outline">
            Monthly review
          </LinkButton>
          <LinkButton href="/add-trade">Log a trade</LinkButton>
        </PageHeader>

        <RiskLimitBanner />

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left: stats + chart */}
          <div className="flex h-full flex-col space-y-6 lg:col-span-8">
            <SummaryRibbon stats={stats} />
            <AdvancedStatsRibbon stats={advanced} currency={currency} />
            <div className="flex min-h-0 flex-1 flex-col">
              <EquityCurve />
            </div>
          </div>

          {/* Right: calculators sidebar */}
          <div className="flex h-full flex-col gap-6 lg:col-span-4">
            {account ? (
              <MonthlyGoalsCard
                goal={goal}
                accountId={account.id}
                currentPnl={monthStats.totalPnl}
                currentWinRate={monthStats.winRate}
                currency={currency}
                onSave={upsertMonthlyGoal}
              />
            ) : null}
            <PositionSizeCalculator
              defaultBalance={account?.starting_balance ?? 10000}
              currency={currency}
            />
          </div>
        </div>

        <Card className={terminalCard}>
          <div className="p-6">
            <div className="mb-6 flex flex-row items-center justify-between">
              <div>
                <p className={sectionLabel}>
                  Recent trades
                </p>
                <p className="text-sm text-zinc-500">Latest logged trades</p>
              </div>
              <Link
                href="/trades"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "border-zinc-700"
                )}
              >
                View all
              </Link>
            </div>

            {recentTrades.length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-500">
                No trades yet.{" "}
                <Link href="/add-trade" className="text-emerald-400 underline">
                  Add your first trade
                </Link>
              </p>
            ) : (
              <TradesTableWithSheet
                trades={recentTrades}
                compact
                currency={currency}
              />
            )}
          </div>
        </Card>
    </main>
  );
}
