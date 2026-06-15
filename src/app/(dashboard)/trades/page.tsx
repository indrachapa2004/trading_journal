import Link from "next/link";

import { TradesTable } from "@/components/trades/trades-table";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTrades } from "@/lib/data/trades";
import { cn } from "@/lib/utils";

export default async function TradesPage() {
  const tradeList = await getTrades();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trades</h1>
          <p className="text-sm text-muted-foreground">
            All logged trades with P&amp;L and tags.
          </p>
        </div>
        <Link href="/trades/new" className={cn(buttonVariants())}>
          Add trade
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trade log</CardTitle>
          <CardDescription>
            {tradeList.length} trade{tradeList.length === 1 ? "" : "s"} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tradeList.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No trades logged yet.
            </p>
          ) : (
            <TradesTable trades={tradeList} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
