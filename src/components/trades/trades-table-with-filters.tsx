"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";

import { TradesTableWithSheet } from "@/components/trades/trades-table-with-sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Trade } from "@/types/database";

type DirectionFilter = "all" | "long" | "short";
type AssetFilter = "all" | "stocks" | "forex" | "crypto" | "options" | "futures";
type DateFilter = "all" | "week" | "month" | "quarter";

const DIRECTION_OPTIONS: { value: DirectionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "long", label: "Long" },
  { value: "short", label: "Short" },
];

const ASSET_OPTIONS: { value: AssetFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "stocks", label: "Stocks" },
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Crypto" },
  { value: "options", label: "Options" },
  { value: "futures", label: "Futures" },
];

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "quarter", label: "This quarter" },
];

function FilterChip<T extends string>({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
        selected
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
      )}
    >
      {label}
    </button>
  );
}

export function TradesTableWithFilters({
  trades,
  currency = "USD",
}: {
  trades: Trade[];
  currency?: string;
}) {
  const [direction, setDirection] = useState<DirectionFilter>("all");
  const [assetClass, setAssetClass] = useState<AssetFilter>("all");
  const [dateRange, setDateRange] = useState<DateFilter>("all");

  const activeFilterCount = [
    direction !== "all",
    assetClass !== "all",
    dateRange !== "all",
  ].filter(Boolean).length;

  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      // Direction filter
      if (direction !== "all" && trade.direction !== direction) return false;

      // Asset class filter
      if (assetClass !== "all" && trade.asset_class !== assetClass) return false;

      // Date range filter
      if (dateRange !== "all") {
        const now = new Date();
        const tradeDate = new Date(trade.exit_at ?? trade.entry_at);
        const diffMs = now.getTime() - tradeDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateRange === "week" && diffDays > 7) return false;
        if (dateRange === "month" && diffDays > 30) return false;
        if (dateRange === "quarter" && diffDays > 90) return false;
      }

      return true;
    });
  }, [trades, direction, assetClass, dateRange]);

  function resetFilters() {
    setDirection("all");
    setAssetClass("all");
    setDateRange("all");
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/40 px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-medium text-emerald-400">
              {activeFilterCount}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Direction filter">
          {DIRECTION_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              selected={direction === opt.value}
              onClick={() => setDirection(opt.value)}
            />
          ))}
        </div>

        <div className="hidden h-4 w-px bg-zinc-800 sm:block" />

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Asset class filter">
          {ASSET_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              selected={assetClass === opt.value}
              onClick={() => setAssetClass(opt.value)}
            />
          ))}
        </div>

        <div className="hidden h-4 w-px bg-zinc-800 sm:block" />

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Date range filter">
          {DATE_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              selected={dateRange === opt.value}
              onClick={() => setDateRange(opt.value)}
            />
          ))}
        </div>

        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto text-xs text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {/* Results count */}
      <p className="text-xs text-zinc-600">
        Showing {filteredTrades.length} of {trades.length} trade{trades.length === 1 ? "" : "s"}
      </p>

      {/* Table */}
      <TradesTableWithSheet trades={filteredTrades} currency={currency} />
    </div>
  );
}