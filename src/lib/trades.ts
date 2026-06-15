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
  avgRiskReward: number;
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

  const riskRewards = closed
    .map((trade) => getTradeRiskReward(trade))
    .filter((value): value is number => value != null && Number.isFinite(value));

  return {
    totalTrades: trades.length,
    closedTrades: closed.length,
    openTrades: trades.length - closed.length,
    totalPnl: pnls.reduce((sum, p) => sum + p, 0),
    winRate: trades.length ? (wins.length / trades.length) * 100 : 0,
    profitFactor: grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? Infinity : 0,
    avgRiskReward: riskRewards.length
      ? riskRewards.reduce((sum, value) => sum + value, 0) / riskRewards.length
      : 0,
    avgWin: wins.length ? grossWins / wins.length : 0,
    avgLoss: losses.length ? grossLosses / losses.length : 0,
  };
}

export type EquityPoint = {
  date: string;
  dateLabel: string;
  symbol: string;
  pnl: number;
  cumulative: number;
  balance: number;
};

function formatEquityDateLabel(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function buildEquityCurve(
  trades: Trade[],
  startingBalance = 0
): EquityPoint[] {
  const closed = trades
    .filter((t) => t.exit_at && t.exit_price != null)
    .sort(
      (a, b) =>
        new Date(a.exit_at!).getTime() - new Date(b.exit_at!).getTime()
    );

  if (closed.length === 0) {
    return [];
  }

  const points: EquityPoint[] = [];
  let cumulative = 0;
  const firstExitAt = closed[0].exit_at!;

  points.push({
    date: firstExitAt,
    dateLabel: formatEquityDateLabel(firstExitAt),
    symbol: "—",
    pnl: 0,
    cumulative: 0,
    balance: startingBalance,
  });

  for (const trade of closed) {
    const pnl = calculatePnl(trade) ?? 0;
    cumulative += pnl;
    const exitAt = trade.exit_at!;

    points.push({
      date: exitAt,
      dateLabel: formatEquityDateLabel(exitAt),
      symbol: trade.symbol,
      pnl,
      cumulative,
      balance: startingBalance + cumulative,
    });
  }

  return points;
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

export function formatProfitFactor(value: number) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  if (value === Infinity) {
    return "∞";
  }

  return value.toFixed(2);
}

export function calculateRiskReward(
  direction: "long" | "short",
  entry: number | null | undefined,
  stopLoss: number | null | undefined,
  takeProfit: number | null | undefined
): number | null {
  if (
    entry == null ||
    stopLoss == null ||
    takeProfit == null ||
    !Number.isFinite(entry) ||
    !Number.isFinite(stopLoss) ||
    !Number.isFinite(takeProfit)
  ) {
    return null;
  }

  if (direction === "long") {
    const risk = entry - stopLoss;
    const reward = takeProfit - entry;
    if (risk <= 0) return null;
    return reward / risk;
  }

  const risk = stopLoss - entry;
  const reward = entry - takeProfit;
  if (risk <= 0) return null;
  return reward / risk;
}

export function formatRiskReward(value: number | null) {
  if (value == null || !Number.isFinite(value)) {
    return "—";
  }

  return `1:${value.toFixed(2)}`;
}

export function formatSignedCurrency(value: number | null, currency = "USD") {
  if (value == null || !Number.isFinite(value)) {
    return "—";
  }

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

export function getTradeRiskReward(
  trade: Pick<
    Trade,
    "direction" | "entry_price" | "stop_loss" | "take_profit"
  >
) {
  return calculateRiskReward(
    trade.direction,
    trade.entry_price,
    trade.stop_loss,
    trade.take_profit
  );
}
