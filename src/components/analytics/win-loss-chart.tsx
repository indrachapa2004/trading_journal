"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import type { WinLossBucket } from "@/lib/analytics";
import { formatCurrency } from "@/lib/trades";
import { sectionLabel, terminalCard } from "@/lib/ui-classes";

const COLORS = ["#10b981", "#e11d48"];

export function WinLossChart({ data }: { data: WinLossBucket[] }) {
  return (
    <Card className={terminalCard}>
      <div className="p-6">
        <div className="mb-6">
          <p className={sectionLabel}>Win / loss distribution</p>
          <p className="text-sm text-zinc-500">
            Total size of wins vs losses
          </p>
        </div>
        {data.every((d) => d.count === 0) ? (
          <p className="flex min-h-[260px] items-center justify-center text-center text-sm text-zinc-500">
            No closed trades yet.
          </p>
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                <XAxis dataKey="label" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  tickFormatter={(v) => formatCurrency(Number(v))}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 8,
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value ?? 0)),
                    "Amount",
                  ]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
