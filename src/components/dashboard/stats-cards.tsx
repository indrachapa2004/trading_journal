import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCurrency,
  formatPercent,
  type TradeStats,
} from "@/lib/trades";

const items: {
  key: keyof TradeStats;
  label: string;
  format: (value: number) => string;
}[] = [
  { key: "totalPnl", label: "Total P&L", format: formatCurrency },
  { key: "winRate", label: "Win rate", format: formatPercent },
  { key: "totalTrades", label: "Total trades", format: (v) => String(v) },
  {
    key: "profitFactor",
    label: "Profit factor",
    format: (v) => (v === Infinity ? "∞" : v.toFixed(2)),
  },
];

export function StatsCards({ stats }: { stats: TradeStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const value = stats[item.key];
        const display =
          typeof value === "number" ? item.format(value) : String(value);

        return (
          <Card key={item.key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={
                  item.key === "totalPnl" && stats.totalPnl < 0
                    ? "text-2xl font-semibold text-destructive"
                    : item.key === "totalPnl" && stats.totalPnl > 0
                      ? "text-2xl font-semibold text-emerald-600"
                      : "text-2xl font-semibold"
                }
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
