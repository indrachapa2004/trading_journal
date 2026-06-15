import type { Profile, Trade } from "@/types/database";
import { computePeriodPnl } from "@/lib/analytics";
import { calculatePnl } from "@/lib/trades";

export type RiskLimitStatus = {
  dailyLoss: number;
  weeklyLoss: number;
  dailyLimit: number | null;
  weeklyLimit: number | null;
  dailyExceeded: boolean;
  weeklyExceeded: boolean;
};

export function computeRiskLimitStatus(
  trades: Trade[],
  profile: Pick<Profile, "daily_loss_limit" | "weekly_loss_limit">
): RiskLimitStatus {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? 6 : day - 1;
  startOfWeek.setDate(startOfWeek.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const dailyPnl = computePeriodPnl(trades, startOfDay, endOfDay);
  const weeklyPnl = computePeriodPnl(trades, startOfWeek, endOfDay);

  const dailyLoss = dailyPnl < 0 ? Math.abs(dailyPnl) : 0;
  const weeklyLoss = weeklyPnl < 0 ? Math.abs(weeklyPnl) : 0;

  const dailyLimit = profile.daily_loss_limit;
  const weeklyLimit = profile.weekly_loss_limit;

  return {
    dailyLoss,
    weeklyLoss,
    dailyLimit,
    weeklyLimit,
    dailyExceeded: dailyLimit != null && dailyLimit > 0 && dailyLoss >= dailyLimit,
    weeklyExceeded:
      weeklyLimit != null && weeklyLimit > 0 && weeklyLoss >= weeklyLimit,
  };
}

export function calculatePositionSize({
  accountBalance,
  riskPercent,
  entryPrice,
  stopLoss,
}: {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLoss: number;
}) {
  const riskAmount = accountBalance * (riskPercent / 100);
  const riskPerUnit = Math.abs(entryPrice - stopLoss);

  if (riskPerUnit <= 0 || riskAmount <= 0) {
    return { shares: 0, riskAmount: 0, totalAtRisk: 0 };
  }

  const shares = Math.floor(riskAmount / riskPerUnit);
  const totalAtRisk = shares * riskPerUnit;

  return { shares, riskAmount, totalAtRisk };
}

export function tradesToCsv(trades: Trade[]): string {
  const headers = [
    "symbol",
    "direction",
    "asset_class",
    "quantity",
    "entry_price",
    "exit_price",
    "entry_at",
    "exit_at",
    "stop_loss",
    "take_profit",
    "fees",
    "pnl",
    "tags",
    "emotional_state",
    "mistakes",
    "self_rating",
    "pre_trade_notes",
    "post_trade_notes",
  ];

  const rows = trades.map((trade) => {
    const pnl = calculatePnl(trade);
    return [
      trade.symbol,
      trade.direction,
      trade.asset_class,
      trade.quantity,
      trade.entry_price,
      trade.exit_price ?? "",
      trade.entry_at,
      trade.exit_at ?? "",
      trade.stop_loss ?? "",
      trade.take_profit ?? "",
      trade.fees,
      pnl ?? "",
      trade.tags.join(";"),
      trade.emotional_state ?? "",
      trade.mistakes.join(";"),
      trade.self_rating ?? "",
      escapeCsv(trade.pre_trade_notes ?? ""),
      escapeCsv(trade.post_trade_notes ?? ""),
    ];
  });

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function escapeCsv(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
