import { EquityCurveChart } from "@/components/dashboard/equity-curve-chart";
import { getStartingBalance, getTrades } from "@/lib/data/trades";
import { buildEquityCurve } from "@/lib/trades";

export async function EquityCurve() {
  const [trades, startingBalance] = await Promise.all([
    getTrades(),
    getStartingBalance(),
  ]);

  const data = buildEquityCurve(trades, startingBalance);

  return <EquityCurveChart data={data} />;
}
