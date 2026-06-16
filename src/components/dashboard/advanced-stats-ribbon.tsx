import { Card } from "@/components/ui/card";
import type { AdvancedStats } from "@/lib/analytics";
import { formatDuration } from "@/lib/analytics";
import {
  formatCurrency,
  formatPercent,
  formatProfitFactor,
} from "@/lib/trades";
import { sectionLabel, terminalCardCompact } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

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
    },
    {
      label: "Profit factor",
      value: formatProfitFactor(stats.profitFactor),
    },
    {
      label: "Max drawdown",
      value: formatCurrency(stats.maxDrawdown, currency),
      className: "text-rose-400/90",
    },
    {
      label: "Expectancy",
      value: formatCurrency(stats.expectancy, currency),
      className:
        stats.expectancy > 0
          ? "text-emerald-400/90"
          : stats.expectancy < 0
            ? "text-rose-400/90"
            : "text-zinc-300",
    },
    {
      label: "Avg duration",
      value: formatDuration(stats.avgTradeDurationHours),
    },
    {
      label: "Win rate",
      value: formatPercent(stats.winRate),
    },
  ];

  return (
    <div className="space-y-4">
      <p className={sectionLabel}>Advanced metrics</p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <Card key={item.label} className={cn(terminalCardCompact, "p-4")}>
            <p className={sectionLabel}>{item.label}</p>
            <p
              className={cn(
                "text-base font-semibold tracking-tight font-mono tabular-nums text-zinc-300",
                item.className
              )}
            >
              {item.value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
