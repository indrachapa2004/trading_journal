import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCurrency,
  formatPercent,
  formatProfitFactor,
  formatRiskReward,
  type TradeStats,
} from "@/lib/trades";
import { cn } from "@/lib/utils";

const metrics: {
  key: keyof Pick<
    TradeStats,
    "totalPnl" | "winRate" | "avgRiskReward" | "profitFactor"
  >;
  label: string;
  format: (value: number) => string;
  valueClassName?: (stats: TradeStats) => string | undefined;
}[] = [
  {
    key: "totalPnl",
    label: "Net P&L",
    format: formatCurrency,
    valueClassName: (stats) =>
      stats.totalPnl > 0
        ? "text-emerald-400"
        : stats.totalPnl < 0
          ? "text-rose-400"
          : "text-zinc-100",
  },
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
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const value = stats[metric.key];
        const display =
          typeof value === "number" ? metric.format(value) : String(value);

        return (
          <Card
            key={metric.key}
            className="border-zinc-700/50 bg-zinc-900/50 text-zinc-100 shadow-lg ring-1 ring-white/10 backdrop-blur-md"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={cn(
                  "text-2xl font-semibold tracking-tight font-mono tabular-nums",
                  metric.valueClassName?.(stats)
                )}
              >
                {display}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
