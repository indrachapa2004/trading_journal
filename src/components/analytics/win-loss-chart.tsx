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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WinLossBucket } from "@/lib/analytics";
import { formatCurrency } from "@/lib/trades";

const COLORS = ["#10b981", "#e11d48"];

export function WinLossChart({ data }: { data: WinLossBucket[] }) {
  return (
    <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
      <CardHeader>
        <CardTitle className="text-zinc-100">Win / loss distribution</CardTitle>
        <CardDescription className="text-zinc-500">
          Total size of wins vs losses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.every((d) => d.count === 0) ? (
          <p className="py-12 text-center text-sm text-zinc-500">
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
      </CardContent>
    </Card>
  );
}
