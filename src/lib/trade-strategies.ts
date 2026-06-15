export const TRADE_STRATEGIES = [
  { value: "breakout", label: "Breakout" },
  { value: "scalp", label: "Scalp" },
  { value: "swing", label: "Swing" },
  { value: "trend", label: "Trend following" },
  { value: "mean_reversion", label: "Mean reversion" },
  { value: "earnings", label: "Earnings" },
  { value: "other", label: "Other" },
] as const;

export type TradeStrategy = (typeof TRADE_STRATEGIES)[number]["value"];
