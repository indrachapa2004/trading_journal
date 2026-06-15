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
import type { BreakdownItem } from "@/lib/analytics";
import { formatCurrency } from "@/lib/trades";

export function BreakdownChart({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: BreakdownItem[];
}) {
  return (
    <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
      <CardHeader>
        <CardTitle className="text-zinc-100">{title}</CardTitle>
        <CardDescription className="text-zinc-500">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">No data yet.</p>
        ) : (
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#3f3f46" />
                <XAxis
                  type="number"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  tickFormatter={(v) => formatCurrency(Number(v))}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  width={72}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 8,
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value ?? 0)),
                    "P&L",
                  ]}
                />
                <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                  {data.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={entry.pnl >= 0 ? "#10b981" : "#e11d48"}
                    />
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
