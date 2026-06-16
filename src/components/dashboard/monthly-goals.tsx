"use client";

import { useState } from "react";
import { Target } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/lib/trades";
import { sectionLabel, terminalCard } from "@/lib/ui-classes";
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
    <Card className={cn("shrink-0", terminalCard)}>
      <div className="space-y-4 p-6">
        <div>
          <div className="flex items-center gap-2">
            <Target className="size-4 text-emerald-400" />
            <h3 className="text-base font-medium text-zinc-100">Monthly targets</h3>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {now.toLocaleString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="account_id" value={accountId} />
          <input type="hidden" name="year" value={now.getFullYear()} />
          <input type="hidden" name="month" value={now.getMonth() + 1} />
          <div>
            <Label htmlFor="pnl_target" className={cn(sectionLabel, "normal-case")}>
              P&L target ({currency})
            </Label>
            <Input
              id="pnl_target"
              name="pnl_target"
              type="number"
              step="any"
              defaultValue={goal?.pnl_target ?? ""}
              placeholder="5000"
              className="border-zinc-700 bg-zinc-950 font-mono tabular-nums"
            />
          </div>
          <div>
            <Label htmlFor="win_rate_target" className={cn(sectionLabel, "normal-case")}>
              Win rate target (%)
            </Label>
            <Input
              id="win_rate_target"
              name="win_rate_target"
              type="number"
              step="0.1"
              defaultValue={goal?.win_rate_target ?? ""}
              placeholder="55"
              className="border-zinc-700 bg-zinc-950 font-mono tabular-nums"
            />
          </div>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <Button type="submit" size="sm" disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save targets"}
          </Button>
        </form>
      </div>
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
        <span className={sectionLabel}>{label}</span>
        <span className="font-mono tabular-nums text-zinc-300">
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
