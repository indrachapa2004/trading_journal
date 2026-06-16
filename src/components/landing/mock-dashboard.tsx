"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EMERALD = "#10b981";

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

const miniStats = [
  { label: "Net P&L", value: "+$4,200", accent: "text-emerald-400" },
  { label: "Win rate", value: "62.4%", accent: "text-zinc-100" },
  { label: "Profit factor", value: "2.18", accent: "text-zinc-100" },
];

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function MacWindowControls() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      <span className="size-2.5 rounded-full bg-[#ff5f57] ring-1 ring-black/20" />
      <span className="size-2.5 rounded-full bg-[#febc2e] ring-1 ring-black/20" />
      <span className="size-2.5 rounded-full bg-[#28c840] ring-1 ring-black/20" />
    </div>
  );
}

export function MockDashboard({ className }: { className?: string }) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 shadow-2xl shadow-emerald-500/10 backdrop-blur-md",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
        <MacWindowControls />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-zinc-800/80">
            <TrendingUp className="size-3 text-emerald-400" />
          </div>
          <span className="truncate text-sm font-medium text-zinc-300">
            Performance overview
          </span>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 border-emerald-500/20 bg-emerald-500/5 text-[10px] text-emerald-400/90"
        >
          Live
        </Badge>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {miniStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-white/5 bg-zinc-950/40 px-3 py-2.5 backdrop-blur-sm"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {stat.label}
            </p>
            <p
              className={cn(
                "mt-0.5 font-mono text-lg font-semibold tabular-nums",
                stat.accent
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 px-4 pb-4 pt-3">
        <p className="mb-2 text-xs font-medium text-zinc-500">Equity curve</p>
        <div className="h-[180px] w-full sm:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockEquity}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={EMERALD} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={EMERALD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#52525b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#52525b" }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(24, 24, 27, 0.85)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  fontSize: 12,
                  backdropFilter: "blur(8px)",
                }}
                formatter={(value) => [formatUsd(Number(value)), "Balance"]}
                cursor={{ stroke: EMERALD, strokeWidth: 1, strokeOpacity: 0.2 }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={EMERALD}
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 3, fill: EMERALD, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
