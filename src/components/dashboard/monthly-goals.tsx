"use client";

import { useState } from "react";
import { Target } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/lib/trades";
import { cn } from "@/lib/utils";
import type { MonthlyGoal } from "@/types/database";

type MonthlyGoalsProps = {
  goal: MonthlyGoal | null;
  accountId: string;
  currentPnl: number;
  currentWinRate: number;
  currency: string;
  onSave: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
};

export function MonthlyGoalsCard({
  goal,
  accountId,
  currentPnl,
  currentWinRate,
  currency,
  onSave,
}: MonthlyGoalsProps) {
  const now = new Date();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pnlTarget = goal?.pnl_target ?? null;
  const winRateTarget = goal?.win_rate_target ?? null;

  const pnlProgress =
    pnlTarget && pnlTarget > 0
      ? Math.min(100, Math.max(0, (currentPnl / pnlTarget) * 100))
      : null;
  const winRateProgress =
    winRateTarget && winRateTarget > 0
      ? Math.min(100, Math.max(0, (currentWinRate / winRateTarget) * 100))
      : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await onSave(formData);
    if (result.error) setError(result.error);
    setSaving(false);
  }

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="size-4 text-emerald-400" />
          <CardTitle className="text-zinc-100">Monthly targets</CardTitle>
        </div>
        <CardDescription className="text-zinc-500">
          {now.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {pnlTarget != null ? (
          <GoalBar
            label="P&L target"
            current={formatCurrency(currentPnl, currency)}
            target={formatCurrency(pnlTarget, currency)}
            progress={pnlProgress ?? 0}
            positive={currentPnl >= 0}
          />
        ) : null}
        {winRateTarget != null ? (
          <GoalBar
            label="Win rate target"
            current={formatPercent(currentWinRate)}
            target={formatPercent(winRateTarget)}
            progress={winRateProgress ?? 0}
            positive={currentWinRate >= winRateTarget}
          />
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="account_id" value={accountId} />
          <input type="hidden" name="year" value={now.getFullYear()} />
          <input type="hidden" name="month" value={now.getMonth() + 1} />
          <div className="space-y-1.5">
            <Label htmlFor="pnl_target" className="text-zinc-400">
              P&L target ({currency})
            </Label>
            <Input
              id="pnl_target"
              name="pnl_target"
              type="number"
              step="any"
              defaultValue={goal?.pnl_target ?? ""}
              placeholder="5000"
              className="border-zinc-700 bg-zinc-950 font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="win_rate_target" className="text-zinc-400">
              Win rate target (%)
            </Label>
            <Input
              id="win_rate_target"
              name="win_rate_target"
              type="number"
              step="0.1"
              defaultValue={goal?.win_rate_target ?? ""}
              placeholder="55"
              className="border-zinc-700 bg-zinc-950 font-mono"
            />
          </div>
          {error ? <p className="text-sm text-rose-400 sm:col-span-2">{error}</p> : null}
          <Button
            type="submit"
            size="sm"
            disabled={saving}
            className="sm:col-span-2"
          >
            {saving ? "Saving..." : "Save targets"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function GoalBar({
  label,
  current,
  target,
  progress,
  positive,
}: {
  label: string;
  current: string;
  target: string;
  progress: number;
  positive: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-zinc-300">
          {current} / {target}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            positive ? "bg-emerald-500" : "bg-rose-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
