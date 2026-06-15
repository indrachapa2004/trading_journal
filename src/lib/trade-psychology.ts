export const TRADE_MISTAKES = [
  { value: "felt_fomo", label: "Felt FOMO" },
  { value: "moved_stop_loss", label: "Moved Stop Loss" },
  { value: "revenge_trade", label: "Revenge Trade" },
  { value: "early_exit", label: "Early Exit" },
] as const;

export type TradeMistake = (typeof TRADE_MISTAKES)[number]["value"];

export const TRADE_MISTAKE_VALUES = [
  "felt_fomo",
  "moved_stop_loss",
  "revenge_trade",
  "early_exit",
] as const satisfies readonly TradeMistake[];

export function getMistakeLabel(value: string) {
  return TRADE_MISTAKES.find((item) => item.value === value)?.label ?? value;
}
