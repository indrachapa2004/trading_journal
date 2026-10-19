"use client";

import { format } from "date-fns";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

import { TradeRowActions } from "@/components/trades/trade-row-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  calculatePnl,
  formatRiskReward,
  formatSignedCurrency,
  getTradeRiskReward,
} from "@/lib/trades";
import { cn } from "@/lib/utils";
import type { Trade } from "@/types/database";

export function TradesTable({
  trades,
  compact = false,
  onViewTrade,
  onDeleteOptimistic,
  onUndoOptimistic,
}: {
  trades: Trade[];
  compact?: boolean;
  onViewTrade?: (id: string) => void;
  /** Called when a trade is optimistically deleted (for undo) */
  onDeleteOptimistic?: (tradeId: string) => void;
  /** Called when Undo is clicked to restore the trade */
  onUndoOptimistic?: (tradeId: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Date</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Side</TableHead>
          <TableHead className="text-right">R/R</TableHead>
          <TableHead className="text-right">P&L</TableHead>
          {!compact ? <TableHead className="w-12 text-right">Action</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade, index) => {
          const pnl = calculatePnl(trade);
          const riskReward = getTradeRiskReward(trade);

          return (
            <TableRow
              key={trade.id}
              className={cn(
                "group cursor-pointer border-zinc-800 transition-[background-color,box-shadow] hover:bg-zinc-900/80 hover:shadow-[inset_2px_0_0_0_rgb(16_185_129)]",
                index % 2 === 1 && "bg-zinc-900/30"
              )}
              onClick={() => onViewTrade?.(trade.id)}
            >
              <TableCell className="text-sm text-zinc-400">
                {format(new Date(trade.entry_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {onViewTrade ? (
                  <button
                    type="button"
                    aria-label={`Open ${trade.symbol} trade details`}
                    className="font-semibold text-zinc-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    onClick={(event) => {
                      event.stopPropagation();
                      onViewTrade(trade.id);
                    }}
                  >
                    {trade.symbol}
                  </button>
                ) : (
                  <span className="font-semibold text-zinc-100">{trade.symbol}</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "border-0 font-medium capitalize",
                    trade.direction === "long"
                      ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/15"
                      : "bg-rose-500/15 text-rose-400 hover:bg-rose-500/15"
                  )}
                >
                  {trade.direction === "long" ? "Long" : "Short"}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-sm text-zinc-300">
                {formatRiskReward(riskReward)}
              </TableCell>
              <TableCell className="text-right">
                {pnl == null ? (
                  <span className="font-mono text-sm text-muted-foreground">
                    Open
                  </span>
                ) : (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 font-mono text-sm font-medium",
                      pnl > 0 && "text-emerald-400",
                      pnl < 0 && "text-rose-400",
                      pnl === 0 && "text-zinc-400"
                    )}
                  >
                    {pnl > 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : pnl < 0 ? (
                      <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : null}
                    {formatSignedCurrency(pnl)}
                  </span>
                )}
              </TableCell>
              {!compact ? (
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    <TradeRowActions
                      tradeId={trade.id}
                      onDeleteOptimistic={() => onDeleteOptimistic?.(trade.id)}
                      onUndoOptimistic={() => onUndoOptimistic?.(trade.id)}
                    />
                  </div>
                </TableCell>
              ) : (
                <TableCell
                  className="w-8 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
