import Link from "next/link";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculatePnl, formatCurrency } from "@/lib/trades";
import type { Trade } from "@/types/database";

export function TradesTable({
  trades,
  compact = false,
}: {
  trades: Trade[];
  compact?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Direction</TableHead>
          <TableHead>Entry</TableHead>
          {!compact ? <TableHead>Exit</TableHead> : null}
          <TableHead>P&L</TableHead>
          {!compact ? <TableHead>Tags</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => {
          const pnl = calculatePnl(trade);

          return (
            <TableRow key={trade.id}>
              <TableCell>
                <Link
                  href={`/trades/${trade.id}`}
                  className="font-medium hover:underline"
                >
                  {trade.symbol}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={trade.direction === "long" ? "default" : "secondary"}>
                  {trade.direction}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {formatCurrency(trade.entry_price)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(trade.entry_at), "MMM d, yyyy")}
                </div>
              </TableCell>
              {!compact ? (
                <TableCell>
                  {trade.exit_price != null ? (
                    <>
                      <div className="text-sm">
                        {formatCurrency(trade.exit_price)}
                      </div>
                      {trade.exit_at ? (
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(trade.exit_at), "MMM d, yyyy")}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Open</span>
                  )}
                </TableCell>
              ) : null}
              <TableCell>
                {pnl == null ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  <span
                    className={
                      pnl >= 0 ? "text-emerald-600" : "text-destructive"
                    }
                  >
                    {formatCurrency(pnl)}
                  </span>
                )}
              </TableCell>
              {!compact ? (
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {trade.tags.length > 0 ? (
                      trade.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>
              ) : null}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
