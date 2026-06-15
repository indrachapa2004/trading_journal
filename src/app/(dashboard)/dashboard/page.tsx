import Link from "next/link";

import { EquityCurveChart } from "@/components/dashboard/equity-curve-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TradesTable } from "@/components/trades/trades-table";
import { getTrades } from "@/lib/data/trades";
import { buildEquityCurve, computeTradeStats } from "@/lib/trades";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const tradeList = await getTrades();
  const stats = computeTradeStats(tradeList);
  const equityCurve = buildEquityCurve(tradeList);
  const recentTrades = tradeList.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your trading performance.
          </p>
        </div>
        <Link href="/trades/new" className={cn(buttonVariants())}>
          Log a trade
        </Link>
      </div>

      <StatsCards stats={stats} />

      <EquityCurveChart data={equityCurve} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent trades</CardTitle>
            <CardDescription>Your latest logged trades</CardDescription>
          </div>
          <Link
            href="/trades"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentTrades.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No trades yet.{" "}
              <Link href="/trades/new" className="underline">
                Add your first trade
              </Link>
              .
            </p>
          ) : (
            <TradesTable trades={recentTrades} compact />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
