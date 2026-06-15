import type { Trade } from "@/types/database";
import { calculatePnl, computeTradeStats, type TradeStats } from "@/lib/trades";

export type AdvancedStats = TradeStats & {
  sharpeRatio: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  expectancy: number;
  avgTradeDurationHours: number;
};

export type BreakdownItem = {
  key: string;
  label: string;
  pnl: number;
  trades: number;
  winRate: number;
};

export type WinLossBucket = {
  label: string;
  amount: number;
  count: number;
};

export type DailyPnl = {
  date: string;
  pnl: number;
  trades: number;
};

function getClosedTrades(trades: Trade[]) {
  return trades.filter((t) => t.exit_price != null && t.exit_at);
}

function getTradeDurationHours(trade: Trade): number | null {
  if (!trade.exit_at) return null;
  const ms =
    new Date(trade.exit_at).getTime() - new Date(trade.entry_at).getTime();
  if (ms <= 0) return null;
  return ms / (1000 * 60 * 60);
}

export function computeAdvancedStats(trades: Trade[]): AdvancedStats {
  const base = computeTradeStats(trades);
  const closed = getClosedTrades(trades);
  const pnls = closed
    .map((t) => calculatePnl(t))
    .filter((p): p is number => p != null);

  const durations = closed
    .map(getTradeDurationHours)
    .filter((d): d is number => d != null);

  const avgTradeDurationHours = durations.length
    ? durations.reduce((s, d) => s + d, 0) / durations.length
    : 0;

  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);
  const winRate = pnls.length ? wins.length / pnls.length : 0;
  const lossRate = pnls.length ? losses.length / pnls.length : 0;
  const avgWin = wins.length
    ? wins.reduce((s, p) => s + p, 0) / wins.length
    : 0;
  const avgLoss = losses.length
    ? Math.abs(losses.reduce((s, p) => s + p, 0) / losses.length)
    : 0;

  const expectancy = winRate * avgWin - lossRate * avgLoss;

  let peak = 0;
  let cumulative = 0;
  let maxDrawdown = 0;

  for (const pnl of pnls) {
    cumulative += pnl;
    if (cumulative > peak) peak = cumulative;
    const drawdown = peak - cumulative;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  const maxDrawdownPercent = peak > 0 ? (maxDrawdown / peak) * 100 : 0;

  let sharpeRatio = 0;
  if (pnls.length > 1) {
    const mean = pnls.reduce((s, p) => s + p, 0) / pnls.length;
    const variance =
      pnls.reduce((s, p) => s + (p - mean) ** 2, 0) / (pnls.length - 1);
    const stdDev = Math.sqrt(variance);
    sharpeRatio = stdDev > 0 ? (mean / stdDev) * Math.sqrt(252) : 0;
  }

  return {
    ...base,
    sharpeRatio,
    maxDrawdown,
    maxDrawdownPercent,
    expectancy,
    avgTradeDurationHours,
  };
}

export function computeWinLossDistribution(trades: Trade[]): WinLossBucket[] {
  const closed = getClosedTrades(trades);
  const wins: number[] = [];
  const losses: number[] = [];

  for (const trade of closed) {
    const pnl = calculatePnl(trade);
    if (pnl == null) continue;
    if (pnl > 0) wins.push(pnl);
    else if (pnl < 0) losses.push(Math.abs(pnl));
  }

  return [
    {
      label: "Wins",
      amount: wins.reduce((s, p) => s + p, 0),
      count: wins.length,
    },
    {
      label: "Losses",
      amount: losses.reduce((s, p) => s + p, 0),
      count: losses.length,
    },
  ];
}

function buildBreakdown(
  trades: Trade[],
  getKey: (trade: Trade) => string,
  getLabel: (key: string) => string
): BreakdownItem[] {
  const map = new Map<string, Trade[]>();

  for (const trade of getClosedTrades(trades)) {
    const key = getKey(trade);
    const list = map.get(key) ?? [];
    list.push(trade);
    map.set(key, list);
  }

  return Array.from(map.entries())
    .map(([key, group]) => {
      const pnls = group
        .map((t) => calculatePnl(t))
        .filter((p): p is number => p != null);
      const wins = pnls.filter((p) => p > 0).length;

      return {
        key,
        label: getLabel(key),
        pnl: pnls.reduce((s, p) => s + p, 0),
        trades: group.length,
        winRate: pnls.length ? (wins / pnls.length) * 100 : 0,
      };
    })
    .sort((a, b) => b.pnl - a.pnl);
}

export function computeSymbolBreakdown(trades: Trade[]) {
  return buildBreakdown(
    trades,
    (t) => t.symbol,
    (key) => key
  ).slice(0, 10);
}

export function computeAssetClassBreakdown(trades: Trade[]) {
  return buildBreakdown(trades, (t) => t.asset_class, (key) =>
    key.charAt(0).toUpperCase() + key.slice(1)
  );
}

export function computeTagBreakdown(trades: Trade[]) {
  const tagged = getClosedTrades(trades).filter((t) => t.tags.length > 0);
  const expanded: Trade[] = [];

  for (const trade of tagged) {
    for (const tag of trade.tags) {
      expanded.push({ ...trade, tags: [tag] });
    }
  }

  return buildBreakdown(expanded, (t) => t.tags[0] ?? "untagged", (key) => key).slice(
    0,
    10
  );
}

export function computeTimeOfDayBreakdown(trades: Trade[]) {
  const buckets = [
    { key: "pre_market", label: "Pre-Market (4–9)", min: 4, max: 9 },
    { key: "morning", label: "Morning (9–12)", min: 9, max: 12 },
    { key: "afternoon", label: "Afternoon (12–16)", min: 12, max: 16 },
    { key: "evening", label: "Evening (16–20)", min: 16, max: 20 },
    { key: "night", label: "Night (20–4)", min: 20, max: 28 },
  ];

  const map = new Map<string, Trade[]>();
  for (const b of buckets) map.set(b.key, []);

  for (const trade of getClosedTrades(trades)) {
    const hour = new Date(trade.entry_at).getHours();
    const bucket =
      hour >= 20 || hour < 4
        ? "night"
        : hour < 9
          ? "pre_market"
          : hour < 12
            ? "morning"
            : hour < 16
              ? "afternoon"
              : "evening";
    map.get(bucket)?.push(trade);
  }

  return buckets.map((b) => {
    const group = map.get(b.key) ?? [];
    const pnls = group
      .map((t) => calculatePnl(t))
      .filter((p): p is number => p != null);
    const wins = pnls.filter((p) => p > 0).length;

    return {
      key: b.key,
      label: b.label,
      pnl: pnls.reduce((s, p) => s + p, 0),
      trades: group.length,
      winRate: pnls.length ? (wins / pnls.length) * 100 : 0,
    };
  });
}

export function computeDailyPnl(trades: Trade[]): DailyPnl[] {
  const map = new Map<string, { pnl: number; trades: number }>();

  for (const trade of getClosedTrades(trades)) {
    const pnl = calculatePnl(trade);
    if (pnl == null || !trade.exit_at) continue;
    const date = trade.exit_at.slice(0, 10);
    const current = map.get(date) ?? { pnl: 0, trades: 0 };
    current.pnl += pnl;
    current.trades += 1;
    map.set(date, current);
  }

  return Array.from(map.entries())
    .map(([date, value]) => ({ date, ...value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function computePeriodPnl(
  trades: Trade[],
  start: Date,
  end: Date
): number {
  return getClosedTrades(trades)
    .filter((t) => {
      if (!t.exit_at) return false;
      const d = new Date(t.exit_at);
      return d >= start && d <= end;
    })
    .reduce((sum, t) => sum + (calculatePnl(t) ?? 0), 0);
}

export function getTradeRoiPercent(trade: Trade): number | null {
  const pnl = calculatePnl(trade);
  if (pnl == null) return null;
  const cost = trade.entry_price * trade.quantity;
  if (cost <= 0) return null;
  return (pnl / cost) * 100;
}

export function formatDuration(hours: number | null): string {
  if (hours == null || !Number.isFinite(hours)) return "—";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}
