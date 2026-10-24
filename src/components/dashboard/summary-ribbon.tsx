import {
  formatCurrency,
  formatPercent,
  formatProfitFactor,
  formatRiskReward,
  type TradeStats,
} from "@/lib/trades";
import { sectionLabel } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

const secondaryMetrics: {
  key: keyof Pick<TradeStats, "winRate" | "avgRiskReward" | "profitFactor">;
  label: string;
  format: (value: number) => string;
}[] = [
  {
    key: "winRate",
    label: "Win rate",
    format: formatPercent,
  },
  {
    key: "avgRiskReward",
    label: "Avg. R/R",
    format: (value) => formatRiskReward(value > 0 ? value : null),
  },
  {
    key: "profitFactor",
    label: "Profit factor",
    format: formatProfitFactor,
  },
];

export function SummaryRibbon({ stats }: { stats: TradeStats }) {
  const pnlDisplay = formatCurrency(stats.totalPnl);
  const pnlClass =
    stats.totalPnl > 0
      ? "text-emerald-400"
      : stats.totalPnl < 0
        ? "text-rose-400"
        : "text-zinc-100";

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-4">
      <div className="min-w-0 bg-[#171d18] p-4 sm:p-5">
        <dt className={sectionLabel}>Net P&L</dt>
        <dd
          className={cn(
            "text-xl font-medium tracking-tight font-mono tabular-nums sm:text-2xl",
            pnlClass,
          )}
        >
          {pnlDisplay}
        </dd>
      </div>

      {secondaryMetrics.map((metric) => {
        const value = stats[metric.key];
        const display =
          typeof value === "number" ? metric.format(value) : String(value);

        return (
          <div key={metric.key} className="min-w-0 bg-[#171d18] p-4 sm:p-5">
            <dt className={sectionLabel}>{metric.label}</dt>
            <dd className="text-lg font-medium tracking-tight font-mono tabular-nums text-zinc-100 sm:text-xl">
              {display}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
