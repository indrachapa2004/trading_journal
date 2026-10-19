import type { AdvancedStats } from "@/lib/analytics";
import { formatDuration } from "@/lib/analytics";
import { formatCurrency } from "@/lib/trades";
import { sectionLabel } from "@/lib/ui-classes";
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
  ];

  return (
    <div className="space-y-4">
      <p className={sectionLabel}>Advanced metrics</p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-white/10 bg-[#151b16] p-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className={cn(sectionLabel, "mb-1")}>{item.label}</dt>
            <dd
              className={cn(
                "text-sm font-semibold tracking-tight font-mono tabular-nums text-zinc-300 sm:text-base",
                item.className
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
