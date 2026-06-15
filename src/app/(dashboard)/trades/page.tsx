import { CsvImport } from "@/components/trades/csv-import";
import { ExportTradesButton } from "@/components/trades/export-trades-button";
import { TradesTableWithSheet } from "@/components/trades/trades-table-with-sheet";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveAccountCurrency } from "@/lib/data/accounts";
import { getTrades } from "@/lib/data/trades";

export default async function TradesPage() {
  const [tradeList, currency] = await Promise.all([
    getTrades(),
    getActiveAccountCurrency(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Journal
          </h1>
          <p className="text-sm text-zinc-500">
            All logged trades with side, risk/reward, and P&L
          </p>
        </div>
        <div className="relative z-30 flex flex-wrap gap-2 isolate">
          <ExportTradesButton />
          <LinkButton href="/add-trade">Add trade</LinkButton>
        </div>
      </div>

      <CsvImport />

      <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
        <CardHeader>
          <CardTitle className="text-zinc-100">Trade log</CardTitle>
          <CardDescription className="text-zinc-500">
            {tradeList.length} trade{tradeList.length === 1 ? "" : "s"} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tradeList.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No trades logged yet.
            </p>
          ) : (
            <TradesTableWithSheet trades={tradeList} currency={currency} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
