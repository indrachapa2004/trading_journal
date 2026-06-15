import type { Trade } from "@/types/database";

export function calculatePnl(trade: Pick<
  Trade,
  "direction" | "entry_price" | "exit_price" | "quantity" | "fees"
>): number | null {
  if (trade.exit_price == null) return null;

  const gross =
    trade.direction === "long"
      ? (trade.exit_price - trade.entry_price) * trade.quantity
      : (trade.entry_price - trade.exit_price) * trade.quantity;

  return gross - (trade.fees ?? 0);
}

export function isWinningTrade(trade: Trade): boolean | null {
  const pnl = calculatePnl(trade);
  return pnl == null ? null : pnl > 0;
}

export type TradeStats = {
  totalTrades: number;
  closedTrades: number;
  openTrades: number;
  totalPnl: number;
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
};

export function computeTradeStats(trades: Trade[]): TradeStats {
  const closed = trades.filter((t) => t.exit_price != null);
  const pnls = closed
    .map((t) => calculatePnl(t))
    .filter((p): p is number => p != null);

  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);
  const grossWins = wins.reduce((sum, p) => sum + p, 0);
  const grossLosses = Math.abs(losses.reduce((sum, p) => sum + p, 0));

  return {
    totalTrades: trades.length,
    closedTrades: closed.length,
    openTrades: trades.length - closed.length,
    totalPnl: pnls.reduce((sum, p) => sum + p, 0),
    winRate: closed.length ? (wins.length / closed.length) * 100 : 0,
    profitFactor: grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? Infinity : 0,
    avgWin: wins.length ? grossWins / wins.length : 0,
    avgLoss: losses.length ? grossLosses / losses.length : 0,
  };
}

export type EquityPoint = {
  date: string;
  pnl: number;
  cumulative: number;
};

export function buildEquityCurve(trades: Trade[]): EquityPoint[] {
  const closed = trades
    .filter((t) => t.exit_at && t.exit_price != null)
    .sort(
      (a, b) =>
        new Date(a.exit_at!).getTime() - new Date(b.exit_at!).getTime()
    );

  let cumulative = 0;

  return closed.map((trade) => {
    const pnl = calculatePnl(trade) ?? 0;
    cumulative += pnl;
    return {
      date: trade.exit_at!.slice(0, 10),
      pnl,
      cumulative,
    };
  });
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}
