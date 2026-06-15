"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculatePositionSize } from "@/lib/risk";
import { formatCurrency } from "@/lib/trades";

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
    <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="size-4 text-emerald-400" />
          <CardTitle className="text-zinc-100">Position size</CardTitle>
        </div>
        <CardDescription className="text-zinc-500">
          Risk-based share/lot sizing calculator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-zinc-400">Account balance</Label>
            <Input
              type="number"
              step="any"
              value={balance}
              onValueChange={setBalance}
              className="border-zinc-700 bg-zinc-950 font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-zinc-400">Risk %</Label>
            <Input
              type="number"
              step="0.1"
              value={riskPercent}
              onValueChange={setRiskPercent}
              className="border-zinc-700 bg-zinc-950 font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-zinc-400">Entry price</Label>
            <Input
              type="number"
              step="any"
              value={entry}
              onValueChange={setEntry}
              className="border-zinc-700 bg-zinc-950 font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-zinc-400">Stop loss</Label>
            <Input
              type="number"
              step="any"
              value={stopLoss}
              onValueChange={setStopLoss}
              className="border-zinc-700 bg-zinc-950 font-mono"
            />
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Position size
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-emerald-400">
              {result.shares.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              $ at risk
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-zinc-100">
              {formatCurrency(result.totalAtRisk, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Risk budget
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-zinc-100">
              {formatCurrency(result.riskAmount, currency)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
