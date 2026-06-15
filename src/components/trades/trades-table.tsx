"use client";

import { format } from "date-fns";

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
}: {
  trades: Trade[];
  compact?: boolean;
  onViewTrade?: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Date</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Side</TableHead>
          <TableHead className="text-right">R/R</TableHead>
          <TableHead className="text-right">P&amp;L</TableHead>
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
                "cursor-pointer border-zinc-800 transition-colors hover:bg-zinc-900/80",
                index % 2 === 1 && "bg-zinc-900/30"
              )}
              onClick={() => onViewTrade?.(trade.id)}
            >
              <TableCell className="text-sm text-zinc-400">
                {format(new Date(trade.entry_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <span className="font-semibold text-zinc-100">
                  {trade.symbol}
                </span>
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
                      "font-mono text-sm font-medium",
                      pnl > 0 && "text-emerald-400",
                      pnl < 0 && "text-rose-400",
                      pnl === 0 && "text-zinc-400"
                    )}
                  >
                    {formatSignedCurrency(pnl)}
                  </span>
                )}
              </TableCell>
              {!compact ? (
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <TradeRowActions
                    tradeId={trade.id}
                    onView={() => onViewTrade?.(trade.id)}
                  />
                </TableCell>
              ) : null}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
