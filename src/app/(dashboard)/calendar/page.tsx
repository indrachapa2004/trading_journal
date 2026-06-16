import { PnlCalendar } from "@/components/calendar/pnl-calendar";
import { PageHeader } from "@/components/layout/page-header";
import { getActiveAccountCurrency } from "@/lib/data/accounts";
import { getTrades } from "@/lib/data/trades";
import { computeDailyPnl } from "@/lib/analytics";
import { pageMain } from "@/lib/ui-classes";

export default async function CalendarPage() {
  const [trades, currency] = await Promise.all([
    getTrades(),
    getActiveAccountCurrency(),
  ]);

  const dailyPnl = computeDailyPnl(trades);

  return (
    <main className={pageMain}>
      <PageHeader
        title="Calendar"
        description="Daily P&L heatmap — emerald for profit, rose for loss"
      />

      <PnlCalendar dailyPnl={dailyPnl} trades={trades} currency={currency} />
    </main>
  );
}
