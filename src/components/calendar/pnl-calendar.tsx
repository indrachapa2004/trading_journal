"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DailyPnl } from "@/lib/analytics";
import { formatSignedCurrency } from "@/lib/trades";
import { cn } from "@/lib/utils";
import type { Trade } from "@/types/database";

type PnlCalendarProps = {
  dailyPnl: DailyPnl[];
  trades: Trade[];
  currency?: string;
};

export function PnlCalendar({
  dailyPnl,
  trades,
  currency = "USD",
}: PnlCalendarProps) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const pnlMap = useMemo(
    () => new Map(dailyPnl.map((d) => [d.date, d])),
    [dailyPnl]
  );

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - getDay(monthStart));
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - getDay(monthEnd)));

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const selectedTrades = selectedDate
    ? trades.filter((t) => {
        const d = (t.exit_at ?? t.entry_at).slice(0, 10);
        return d === selectedDate;
      })
    : [];

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-zinc-100">P&L calendar</CardTitle>
            <CardDescription className="text-zinc-500">
              Daily realized P&L heatmap
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setMonth((m) => subMonths(m, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[120px] text-center text-sm font-medium text-zinc-300">
              {format(month, "MMMM yyyy")}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setMonth((m) => addMonths(m, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const entry = pnlMap.get(key);
            const inMonth = isSameMonth(day, month);
            const pnl = entry?.pnl ?? 0;
            const hasTrades = (entry?.trades ?? 0) > 0;

            return (
              <button
                key={key}
                type="button"
                disabled={!inMonth}
                onClick={() => hasTrades && setSelectedDate(key)}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center rounded-md border text-xs transition-colors",
                  !inMonth && "invisible",
                  inMonth && !hasTrades && "border-zinc-800 bg-zinc-950/50 text-zinc-600",
                  hasTrades &&
                    pnl > 0 &&
                    "border-emerald-900/50 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/40",
                  hasTrades &&
                    pnl < 0 &&
                    "border-rose-900/50 bg-rose-950/60 text-rose-300 hover:bg-rose-900/40",
                  hasTrades &&
                    pnl === 0 &&
                    "border-zinc-700 bg-zinc-800/50 text-zinc-400",
                  selectedDate === key && "ring-2 ring-emerald-500/50"
                )}
              >
                <span className="font-mono">{format(day, "d")}</span>
                {hasTrades ? (
                  <span className="mt-0.5 font-mono text-[10px]">
                    {pnl > 0 ? "+" : ""}
                    {Math.abs(pnl) >= 1000
                      ? `${(pnl / 1000).toFixed(1)}k`
                      : pnl.toFixed(0)}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {selectedDate ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-200">
                {format(new Date(selectedDate), "EEEE, MMM d")}
              </p>
              <p className="font-mono text-sm text-zinc-400">
                {formatSignedCurrency(pnlMap.get(selectedDate)?.pnl ?? 0, currency)}
              </p>
            </div>
            {selectedTrades.length === 0 ? (
              <p className="text-sm text-zinc-500">No trades this day.</p>
            ) : (
              <ul className="space-y-2">
                {selectedTrades.map((trade) => (
                  <li
                    key={trade.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-zinc-300">{trade.symbol}</span>
                    <span className="font-mono text-zinc-400">
                      {trade.direction} · qty {trade.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
