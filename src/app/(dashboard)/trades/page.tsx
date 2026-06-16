import { CsvImport } from "@/components/trades/csv-import";
import { ExportTradesButton } from "@/components/trades/export-trades-button";
import { TradesTableWithSheet } from "@/components/trades/trades-table-with-sheet";
import { PageHeader } from "@/components/layout/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { Card } from "@/components/ui/card";
import { getActiveAccountCurrency } from "@/lib/data/accounts";
import { getTrades } from "@/lib/data/trades";
import { pageMain, sectionLabel, terminalCard } from "@/lib/ui-classes";

export default async function TradesPage() {
  const [tradeList, currency] = await Promise.all([
    getTrades(),
    getActiveAccountCurrency(),
  ]);

  return (
    <main className={pageMain}>
      <PageHeader
        title="Journal"
        description="All logged trades with side, risk/reward, and P&L"
      >
        <ExportTradesButton />
        <LinkButton href="/add-trade">Add trade</LinkButton>
      </PageHeader>

      <CsvImport />

      <Card className={terminalCard}>
        <div className="p-6">
          <div className="mb-6">
            <p className={sectionLabel}>Trade log</p>
            <p className="text-sm text-zinc-500">
              {tradeList.length} trade{tradeList.length === 1 ? "" : "s"} total
            </p>
          </div>

          {tradeList.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-500">
              No trades logged yet.
            </p>
          ) : (
            <TradesTableWithSheet trades={tradeList} currency={currency} />
          )}
        </div>
      </Card>
    </main>
  );
}
