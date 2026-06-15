"use client";

import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  deleteTrade,
  getTradeDetail,
} from "@/app/(dashboard)/trades/actions";
import { MarkdownNotes } from "@/components/trades/markdown-notes";
import { PsychologyTracker } from "@/components/trades/psychology-tracker";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDuration, getTradeRoiPercent } from "@/lib/analytics";
import {
  calculatePnl,
  formatCurrency,
  formatRiskReward,
  formatSignedCurrency,
  getTradeRiskReward,
} from "@/lib/trades";
import { cn } from "@/lib/utils";
import type { Trade, TradeScreenshot } from "@/types/database";

type ScreenshotWithUrl = TradeScreenshot & { url: string };

type TradeDetailSheetProps = {
  tradeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency?: string;
};

export function TradeDetailSheet({
  tradeId,
  open,
  onOpenChange,
  currency = "USD",
}: TradeDetailSheetProps) {
  const router = useRouter();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [screenshots, setScreenshots] = useState<ScreenshotWithUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !tradeId) return;

    setLoading(true);
    getTradeDetail(tradeId).then((result) => {
      if ("trade" in result && result.trade) {
        setTrade(result.trade);
        setScreenshots(result.screenshots ?? []);
      }
      setLoading(false);
    });
  }, [open, tradeId]);

  if (!tradeId || !open) return null;

  const pnl = trade ? calculatePnl(trade) : null;
  const rr = trade ? getTradeRiskReward(trade) : null;
  const roi = trade ? getTradeRoiPercent(trade) : null;
  const duration =
    trade?.exit_at && trade?.entry_at
      ? (new Date(trade.exit_at).getTime() - new Date(trade.entry_at).getTime()) /
        (1000 * 60 * 60)
      : null;

  const beforeShots = screenshots.filter((s) => s.phase === "before");
  const afterShots = screenshots.filter((s) => s.phase === "after");

  function handleDelete() {
    if (!tradeId || !confirm("Delete this trade?")) return;
    startTransition(async () => {
      await deleteTrade(tradeId);
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-zinc-800 bg-zinc-950 sm:max-w-xl"
      >
        {loading || !trade ? (
          <div className="flex h-full items-center justify-center text-zinc-500">
            Loading trade...
          </div>
        ) : (
          <>
            <SheetHeader className="border-b border-zinc-800 pb-4">
              <div className="flex items-start justify-between gap-3 pr-8">
                <div>
                  <SheetTitle className="text-xl text-zinc-100">
                    {trade.symbol}
                  </SheetTitle>
                  <SheetDescription className="text-zinc-500">
                    {format(new Date(trade.entry_at), "MMM d, yyyy h:mm a")}
                  </SheetDescription>
                </div>
                <div className="flex gap-1">
                  <Badge className="capitalize">{trade.direction}</Badge>
                  <Badge variant="outline">{trade.asset_class}</Badge>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/trades/${trade.id}/edit`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </SheetHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric
                  label="P&L"
                  value={pnl == null ? "Open" : formatSignedCurrency(pnl, currency)}
                  className={
                    pnl != null && pnl > 0
                      ? "text-emerald-400"
                      : pnl != null && pnl < 0
                        ? "text-rose-400"
                        : undefined
                  }
                />
                <Metric label="R/R" value={formatRiskReward(rr)} />
                <Metric
                  label="ROI"
                  value={roi != null ? `${roi.toFixed(2)}%` : "—"}
                />
                <Metric label="Duration" value={formatDuration(duration)} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <StatRow label="Entry" value={formatCurrency(trade.entry_price, currency)} />
                <StatRow
                  label="Exit"
                  value={
                    trade.exit_price != null
                      ? formatCurrency(trade.exit_price, currency)
                      : "—"
                  }
                />
                <StatRow label="Qty" value={String(trade.quantity)} mono />
                <StatRow label="Fees" value={formatCurrency(trade.fees, currency)} />
                <StatRow
                  label="Stop"
                  value={
                    trade.stop_loss != null
                      ? formatCurrency(trade.stop_loss, currency)
                      : "—"
                  }
                />
                <StatRow
                  label="Target"
                  value={
                    trade.take_profit != null
                      ? formatCurrency(trade.take_profit, currency)
                      : "—"
                  }
                />
              </div>

              <MarkdownNotes
                label="Pre-trade notes"
                value={trade.pre_trade_notes ?? ""}
                readOnly
              />
              <MarkdownNotes
                label="Post-trade notes"
                value={trade.post_trade_notes ?? ""}
                readOnly
              />

              <PsychologyTracker
                key={trade.updated_at}
                tradeId={trade.id}
                initialMistakes={trade.mistakes ?? []}
                initialSelfRating={trade.self_rating}
                initialEmotion={trade.emotional_state}
              />

              {(beforeShots.length > 0 || afterShots.length > 0) && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-zinc-300">
                    Before / After gallery
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <GalleryColumn title="Before" shots={beforeShots} />
                    <GalleryColumn title="After" shots={afterShots} />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={cn("mt-1 font-mono text-lg font-semibold text-zinc-100", className)}>
        {value}
      </p>
    </div>
  );
}

function StatRow({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between rounded-md border border-zinc-800/50 px-3 py-2">
      <span className="text-zinc-500">{label}</span>
      <span className={cn("text-zinc-200", mono && "font-mono")}>{value}</span>
    </div>
  );
}

function GalleryColumn({
  title,
  shots,
}: {
  title: string;
  shots: ScreenshotWithUrl[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{title}</p>
      {shots.length === 0 ? (
        <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-zinc-800 text-xs text-zinc-600">
          No {title.toLowerCase()} shots
        </div>
      ) : (
        shots.map((shot) => (
          <div
            key={shot.id}
            className="relative aspect-video overflow-hidden rounded-lg border border-zinc-800"
          >
            <Image
              src={shot.url}
              alt={shot.caption ?? title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ))
      )}
    </div>
  );
}
