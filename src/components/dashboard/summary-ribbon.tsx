import { Card } from "@/components/ui/card";
import {
  formatCurrency,
  formatPercent,
  formatProfitFactor,
  formatRiskReward,
  type TradeStats,
} from "@/lib/trades";
import { sectionLabel, terminalCard } from "@/lib/ui-classes";
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
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-lg ring-1 ring-white/10 backdrop-blur-md">
        <div className="p-6">
          <p className={sectionLabel}>Net P&L</p>
          <p
            className={cn(
              "text-3xl font-semibold tracking-tight font-mono tabular-nums sm:text-4xl",
              pnlClass
            )}
          >
            {pnlDisplay}
          </p>
        </div>
      </Card>

      {secondaryMetrics.map((metric) => {
        const value = stats[metric.key];
        const display =
          typeof value === "number" ? metric.format(value) : String(value);

        return (
          <Card
            key={metric.key}
            className={cn(terminalCard, "shadow-lg backdrop-blur-md")}
          >
            <div className="p-6">
              <p className={sectionLabel}>{metric.label}</p>
              <p className="text-2xl font-semibold tracking-tight font-mono tabular-nums text-zinc-100">
                {display}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
