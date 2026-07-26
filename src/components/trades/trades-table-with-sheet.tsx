"use client";

import { useState, useCallback, useRef } from "react";

import { TradesTable } from "@/components/trades/trades-table";
import { TradeDetailSheet } from "@/components/trades/trade-detail-sheet";
import type { Trade } from "@/types/database";

export function TradesTableWithSheet({
  trades: initialTrades,
  compact = false,
  currency = "USD",
}: {
  trades: Trade[];
  compact?: boolean;
  currency?: string;
}) {
  const [trades, setTrades] = useState(initialTrades);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const removedTradesRef = useRef<Map<string, Trade>>(new Map());

  const openTrade = useCallback((id: string) => {
    setSelectedId(id);
    setSheetOpen(true);
  }, []);

  const handleDeleteOptimistic = useCallback((tradeId: string) => {
    // Store the removed trade for potential undo
    const trade = trades.find((t) => t.id === tradeId);
    if (trade) {
      removedTradesRef.current.set(tradeId, trade);
    }
    setTrades((prev) => prev.filter((t) => t.id !== tradeId));
  }, [trades]);

  const handleUndoOptimistic = useCallback((tradeId: string) => {
    const trade = removedTradesRef.current.get(tradeId);
    if (trade) {
      setTrades((prev) => [...prev, trade]);
      removedTradesRef.current.delete(tradeId);
    }
  }, []);

  return (
    <>
      <TradesTable
        trades={trades}
        compact={compact}
        onViewTrade={openTrade}
        onDeleteOptimistic={handleDeleteOptimistic}
        onUndoOptimistic={handleUndoOptimistic}
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