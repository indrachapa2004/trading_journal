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
import { TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

const chartColor = "#83b995";

const mockEquity = [
  { label: "Jan", balance: 10200 },
  { label: "Feb", balance: 10850 },
  { label: "Mar", balance: 10420 },
  { label: "Apr", balance: 11200 },
  { label: "May", balance: 12150 },
  { label: "Jun", balance: 12840 },
  { label: "Jul", balance: 13420 },
  { label: "Aug", balance: 14200 },
];

const metrics = [
  { label: "Net P&L", value: "+$4,200", className: "text-emerald-300" },
  { label: "Win rate", value: "62.4%" },
  { label: "Profit factor", value: "2.18" },
];

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function MockDashboard({ className }: { className?: string }) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-white/10 bg-[#151b16]",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <TrendingUp className="size-4 text-emerald-300" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-200">
          Portfolio overview
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Preview
        </span>
      </div>

      <dl className="grid grid-cols-3 border-b border-white/10">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn(
              "min-w-0 px-3 py-3 sm:px-5 sm:py-4",
              index > 0 && "border-l border-white/10"
            )}
          >
            <dt className="truncate text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {metric.label}
            </dt>
            <dd
              className={cn(
                "mt-1 truncate font-mono text-base font-medium tabular-nums text-zinc-100 sm:text-lg",
                metric.className
              )}
            >
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="px-4 pb-3 pt-4 sm:px-5">
        <p className="mb-2 text-xs font-medium text-zinc-400">Equity curve</p>
        <div className="h-[160px] w-full sm:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockEquity}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="2 4"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#8d988e" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8d988e" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "#1b241d",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                formatter={(value) => [formatUsd(Number(value)), "Balance"]}
                cursor={{ stroke: chartColor, strokeWidth: 1, strokeOpacity: 0.25 }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={chartColor}
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 3, fill: chartColor, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
