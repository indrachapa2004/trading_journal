"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculatePositionSize } from "@/lib/risk";
import { formatCurrency } from "@/lib/trades";
import { sectionLabel, terminalCard } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export function PositionSizeCalculator({
  defaultBalance = 10000,
  currency = "USD",
}: {
  defaultBalance?: number;
  currency?: string;
}) {
  const [balance, setBalance] = useState(String(defaultBalance));
  const [riskPercent, setRiskPercent] = useState("1");
  const [entry, setEntry] = useState("");
  const [stopLoss, setStopLoss] = useState("");

  const result = useMemo(() => {
    return calculatePositionSize({
      accountBalance: Number(balance) || 0,
      riskPercent: Number(riskPercent) || 0,
      entryPrice: Number(entry) || 0,
      stopLoss: Number(stopLoss) || 0,
    });
  }, [balance, riskPercent, entry, stopLoss]);

  return (
    <Card className={cn("flex flex-1 flex-col", terminalCard)}>
      <div className="flex flex-1 flex-col p-6">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="size-4 text-emerald-400" />
            <h3 className="text-base font-medium text-zinc-100">Position size</h3>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Risk-based share/lot sizing calculator
          </p>
        </div>

        <div className="mt-6 shrink-0 space-y-3">
          <div>
            <Label className={cn(sectionLabel, "normal-case")}>Account balance</Label>
            <Input
              type="number"
              step="any"
              value={balance}
              onValueChange={setBalance}
              className="border-zinc-700 bg-zinc-950 font-mono tabular-nums"
            />
          </div>
          <div>
            <Label className={cn(sectionLabel, "normal-case")}>Risk %</Label>
            <Input
              type="number"
              step="0.1"
              value={riskPercent}
              onValueChange={setRiskPercent}
              className="border-zinc-700 bg-zinc-950 font-mono tabular-nums"
            />
          </div>
          <div>
            <Label className={cn(sectionLabel, "normal-case")}>Entry price</Label>
            <Input
              type="number"
              step="any"
              value={entry}
              onValueChange={setEntry}
              className="border-zinc-700 bg-zinc-950 font-mono tabular-nums"
            />
          </div>
          <div>
            <Label className={cn(sectionLabel, "normal-case")}>Stop loss</Label>
            <Input
              type="number"
              step="any"
              value={stopLoss}
              onValueChange={setStopLoss}
              className="border-zinc-700 bg-zinc-950 font-mono tabular-nums"
            />
          </div>
        </div>

        {/* Absorbs vertical stretch; keeps a minimum gap above results */}
        <div className="min-h-8 flex-1 shrink" aria-hidden />

        <div className="shrink-0 grid gap-3 rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
          <div>
            <p className={sectionLabel}>Position size</p>
            <p className="font-mono text-lg font-semibold tabular-nums text-emerald-400">
              {result.shares.toLocaleString()}
            </p>
          </div>
          <div>
            <p className={sectionLabel}>$ at risk</p>
            <p className="font-mono text-lg font-semibold tabular-nums text-zinc-100">
              {formatCurrency(result.totalAtRisk, currency)}
            </p>
          </div>
          <div>
            <p className={sectionLabel}>Risk budget</p>
            <p className="font-mono text-lg font-semibold tabular-nums text-zinc-100">
              {formatCurrency(result.riskAmount, currency)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
