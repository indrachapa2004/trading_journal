import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdvancedStats } from "@/lib/analytics";
import {
  formatCurrency,
  formatPercent,
  formatProfitFactor,
} from "@/lib/trades";
import { formatDuration } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const terminalCard =
  "border-zinc-800/80 bg-zinc-900/50 text-zinc-100 shadow-lg ring-1 ring-white/5 backdrop-blur-md";

export function AdvancedStatsRibbon({
  stats,
  currency = "USD",
}: {
  stats: AdvancedStats;
  currency?: string;
}) {
  const items = [
    {
      label: "Sharpe ratio",
      value: stats.sharpeRatio.toFixed(2),
      mono: true,
    },
    {
      label: "Profit factor",
      value: formatProfitFactor(stats.profitFactor),
      mono: true,
    },
    {
      label: "Max drawdown",
      value: formatCurrency(stats.maxDrawdown, currency),
      className: "text-rose-400",
      mono: true,
    },
    {
      label: "Expectancy",
      value: formatCurrency(stats.expectancy, currency),
      className:
        stats.expectancy > 0
          ? "text-emerald-400"
          : stats.expectancy < 0
            ? "text-rose-400"
            : undefined,
      mono: true,
    },
    {
      label: "Avg duration",
      value: formatDuration(stats.avgTradeDurationHours),
      mono: true,
    },
    {
      label: "Win rate",
      value: formatPercent(stats.winRate),
      mono: true,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <Card key={item.label} className={terminalCard}>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={cn(
                "text-lg font-semibold tracking-tight",
                item.mono && "font-mono",
                item.className
              )}
            >
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
