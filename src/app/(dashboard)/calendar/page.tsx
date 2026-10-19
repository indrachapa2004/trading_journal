import { PnlCalendar } from "@/components/calendar/pnl-calendar";
import { EmptyState } from "@/components/ui/empty-state";
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
    <div className={pageMain}>
      <PageHeader
        title="Calendar"
        description="Daily P&L heatmap — emerald for profit, rose for loss"
      />

      {trades.length === 0 ? (
        <EmptyState
          icon="CalendarDays"
          title="No trades this month"
          description="Start logging trades to see your daily P&L heatmap on the calendar."
          actionLabel="Log a trade"
          actionHref="/add-trade"
          secondaryHint="Each day with a closed trade will show a colored tile — green for profit, red for loss."
        />
      ) : (
        <PnlCalendar dailyPnl={dailyPnl} trades={trades} currency={currency} />
      )}
    </div>
  );
}
