import { PnlCalendar } from "@/components/calendar/pnl-calendar";
import { getActiveAccountCurrency } from "@/lib/data/accounts";
import { getTrades } from "@/lib/data/trades";
import { computeDailyPnl } from "@/lib/analytics";

export default async function CalendarPage() {
  const [trades, currency] = await Promise.all([
    getTrades(),
    getActiveAccountCurrency(),
  ]);

  const dailyPnl = computeDailyPnl(trades);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Calendar
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Daily P&L heatmap — emerald for profit, rose for loss
        </p>
      </div>

      <PnlCalendar dailyPnl={dailyPnl} trades={trades} currency={currency} />
    </div>
  );
}
