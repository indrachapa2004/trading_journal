import Link from "next/link";

import { AdvancedStatsRibbon } from "@/components/dashboard/advanced-stats-ribbon";
import { EquityCurve } from "@/components/dashboard/equity-curve";
import { MonthlyGoalsCard } from "@/components/dashboard/monthly-goals";
import { PositionSizeCalculator } from "@/components/dashboard/position-size-calculator";
import { SummaryRibbon } from "@/components/dashboard/summary-ribbon";
import { RiskLimitBanner } from "@/components/layout/risk-limit-banner";
import { TradesTableWithSheet } from "@/components/trades/trades-table-with-sheet";
import { LinkButton } from "@/components/ui/link-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            {account?.name ?? "Portfolio"} · Terminal overview
          </p>
        </div>
        <div className="relative z-30 flex flex-wrap gap-2 isolate">
          <LinkButton href="/reports/monthly" variant="outline">
            Monthly review
          </LinkButton>
          <LinkButton href="/add-trade">Log a trade</LinkButton>
        </div>
      </div>

      <RiskLimitBanner />

      <SummaryRibbon stats={stats} />

      <AdvancedStatsRibbon stats={advanced} currency={currency} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EquityCurve />
        </div>
        <div className="space-y-6">
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

      <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-zinc-100">Recent trades</CardTitle>
            <CardDescription className="text-zinc-500">
              Latest logged trades
            </CardDescription>
          </div>
          <Link
            href="/trades"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-zinc-700")}
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentTrades.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No trades yet.{" "}
              <Link href="/add-trade" className="text-emerald-400 underline">
                Add your first trade
              </Link>
            </p>
          ) : (
            <TradesTableWithSheet trades={recentTrades} compact currency={currency} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
