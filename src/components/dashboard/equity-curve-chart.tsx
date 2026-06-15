"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, type EquityPoint } from "@/lib/trades";

const EMERALD_500 = "#10b981";

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: EquityPoint }>;
};

function EquityCurveTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{point.dateLabel}</p>
      <p className="mt-1 text-sm font-medium">{point.symbol}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-emerald-600">
        {formatCurrency(point.balance)}
      </p>
    </div>
  );
}

function formatAxisDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function EquityCurveChart({ data }: { data: EquityPoint[] }) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
      <CardHeader>
        <CardTitle className="text-zinc-100">Equity curve</CardTitle>
        <CardDescription className="text-zinc-500">
          Account balance from closed trades
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            Close a few trades to see your equity curve.
          </p>
        ) : (
          <div className="relative isolate z-0 h-[300px] w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id={gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={EMERALD_500} stopOpacity={0.35} />
                    <stop
                      offset="100%"
                      stopColor={EMERALD_500}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#3f3f46"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#a1a1aa" }}
                  tickMargin={8}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatAxisDate}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#a1a1aa" }}
                  tickFormatter={(value) => formatCurrency(Number(value))}
                  tickLine={false}
                  axisLine={false}
                  width={88}
                />
                <Tooltip
                  content={<EquityCurveTooltip />}
                  cursor={{ stroke: EMERALD_500, strokeOpacity: 0.2 }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke={EMERALD_500}
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  dot={false}
                  activeDot={{ r: 4, fill: EMERALD_500, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
