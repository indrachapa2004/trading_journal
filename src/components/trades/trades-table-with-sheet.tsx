"use client";

import { useState } from "react";

import { TradesTable } from "@/components/trades/trades-table";
import { TradeDetailSheet } from "@/components/trades/trade-detail-sheet";
import type { Trade } from "@/types/database";

export function TradesTableWithSheet({
  trades,
  compact = false,
  currency = "USD",
}: {
  trades: Trade[];
  compact?: boolean;
  currency?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function openTrade(id: string) {
    setSelectedId(id);
    setSheetOpen(true);
  }

  return (
    <>
      <TradesTable
        trades={trades}
        compact={compact}
        onViewTrade={openTrade}
      />
      <TradeDetailSheet
        tradeId={selectedId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        currency={currency}
      />
    </>
  );
}
