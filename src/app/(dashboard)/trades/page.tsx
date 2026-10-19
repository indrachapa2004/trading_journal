import { FileSpreadsheet } from "lucide-react";
import { CsvImport } from "@/components/trades/csv-import";
import { ExportTradesButton } from "@/components/trades/export-trades-button";
import { TradesTableWithFilters } from "@/components/trades/trades-table-with-filters";
import { EmptyState } from "@/components/ui/empty-state";
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
    <div className={pageMain}>
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
            <EmptyState
              icon="FileSpreadsheet"
              title="No trades logged yet"
              description="Your journal is empty. Start by adding your first trade — you can fill in details like screenshots and psychology notes later."
              actionLabel="Add your first trade"
              actionHref="/add-trade"
              secondaryHint="Tip: You can also import trades from a CSV file using the button above."
            />
          ) : (
            <TradesTableWithFilters trades={tradeList} currency={currency} />
          )}
        </div>
      </Card>
    </div>
  );
}
