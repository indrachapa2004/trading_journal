import { EquityCurveChart } from "@/components/dashboard/equity-curve-chart";
import { getStartingBalance, getTrades } from "@/lib/data/trades";
import { buildEquityCurve } from "@/lib/trades";
import type { Trade } from "@/types/database";

export async function EquityCurve({
  trades,
  startingBalance,
}: {
  trades?: Trade[];
  startingBalance?: number;
} = {}) {
  const [resolvedTrades, resolvedStartingBalance] = await Promise.all([
    trades ?? getTrades(),
    startingBalance ?? getStartingBalance(),
  ]);

  const data = buildEquityCurve(resolvedTrades, resolvedStartingBalance);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EquityCurveChart data={data} />
    </div>
  );
}
