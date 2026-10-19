"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { TradeDeleteButton } from "@/components/trades/trade-delete-button";
import { PsychologyTracker } from "@/components/trades/psychology-tracker";
import { ScreenshotGallery } from "@/components/trades/screenshot-gallery";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatSignedCurrency } from "@/lib/trades";
import { cn } from "@/lib/utils";
import type { Trade, TradeScreenshot } from "@/types/database";

type ScreenshotWithUrl = TradeScreenshot & { url: string };

export function TradeDetailPageContent({
  id,
  trade,
  screenshotsWithUrls,
  pnl,
  duration,
}: {
  id: string;
  trade: Trade;
  screenshotsWithUrls: ScreenshotWithUrl[];
  pnl: number | null;
  duration: number | null;
}) {
  const [isDeleted, setIsDeleted] = useState(false);

  if (isDeleted) {
    return (
      <div className="container max-w-6xl py-8 md:py-10">
        <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 py-16 text-center">
          <p className="text-lg font-medium text-zinc-400">Trade deleted</p>
          <p className="mt-2 text-sm text-zinc-500">
            Undo is available in the toast above. The trade will be permanently removed in 10 seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 md:py-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <Link href="/trades">
            <ChevronLeft className="size-4 text-zinc-500" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            {trade.symbol}
          </h1>
          <Badge className="capitalize">{trade.direction}</Badge>
          <Badge variant="outline">{trade.asset_class}</Badge>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/trades/${id}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Edit
          </Link>
          <TradeDeleteButton
            tradeId={id}
            hidden={isDeleted}
            onHide={() => setIsDeleted(true)}
            onUnhide={() => setIsDeleted(false)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-950/50 shadow-lg ring-1 ring-white/5 backdrop-blur-sm">
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
              P&L
            </p>
            <p
              className={cn(
                "text-2xl font-semibold tracking-tight font-mono tabular-nums",
                pnl != null && pnl > 0
                  ? "text-emerald-400"
                  : pnl != null && pnl < 0
                    ? "text-rose-400"
                    : "text-zinc-100"
              )}
            >
              {pnl != null ? formatSignedCurrency(pnl) : "Open"}
            </p>
          </div>
        </Card>
        <Card className="border-zinc-800 bg-zinc-950/50 shadow-lg ring-1 ring-white/5 backdrop-blur-sm">
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
              Entry
            </p>
            <p className="text-2xl font-semibold tracking-tight font-mono tabular-nums text-zinc-100">
              {formatCurrency(trade.entry_price)}
            </p>
          </div>
        </Card>
        <Card className="border-zinc-800 bg-zinc-950/50 shadow-lg ring-1 ring-white/5 backdrop-blur-sm">
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
              Exit
            </p>
            <p className="text-2xl font-semibold tracking-tight font-mono tabular-nums text-zinc-100">
              {trade.exit_price != null
                ? formatCurrency(trade.exit_price)
                : "—"}
            </p>
          </div>
        </Card>
        <Card className="border-zinc-800 bg-zinc-950/50 shadow-lg ring-1 ring-white/5 backdrop-blur-sm">
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
              Quantity
            </p>
            <p className="text-2xl font-semibold tracking-tight font-mono tabular-nums text-zinc-100">
              {trade.quantity}
            </p>
          </div>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-950/50 ring-1 ring-white/5 backdrop-blur-sm">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Trade details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Fees</span>
              <span className="font-mono text-zinc-200">
                {formatCurrency(trade.fees)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Stop loss</span>
              <span className="font-mono text-zinc-200">
                {trade.stop_loss != null
                  ? formatCurrency(trade.stop_loss)
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Take profit</span>
              <span className="font-mono text-zinc-200">
                {trade.take_profit != null
                  ? formatCurrency(trade.take_profit)
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Duration</span>
              <span className="font-mono text-zinc-200">
                {duration != null ? `${duration.toFixed(1)}h` : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Emotional state</span>
              <span className="font-mono text-zinc-200 capitalize">
                {trade.emotional_state ?? "—"}
              </span>
            </div>
            <Separator />
            <div>
              <p className="text-zinc-500 mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {trade.tags.length > 0 ? (
                  trade.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-zinc-500">—</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/50 ring-1 ring-white/5 backdrop-blur-sm">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Pre-trade</p>
              <p className="whitespace-pre-wrap text-zinc-400">
                {trade.pre_trade_notes || "No pre-trade notes."}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Post-trade</p>
              <p className="whitespace-pre-wrap text-zinc-400">
                {trade.post_trade_notes || "No post-trade notes."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Psychology Tracker */}
      <Card className="border-zinc-800 bg-zinc-950/50 ring-1 ring-white/5 backdrop-blur-sm">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Psychology tracker
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Tag mistakes and rate your execution for later analytics.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <PsychologyTracker
            key={trade.updated_at}
            tradeId={id}
            initialMistakes={trade.mistakes ?? []}
            initialSelfRating={trade.self_rating}
            initialEmotion={trade.emotional_state}
          />
        </CardContent>
      </Card>

      {/* Screenshots */}
      <Card className="border-zinc-800 bg-zinc-950/50 ring-1 ring-white/5 backdrop-blur-sm">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Screenshots
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Chart images for this trade
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <ScreenshotGallery
            tradeId={id}
            screenshots={screenshotsWithUrls.filter((s) => s.url)}
          />
        </CardContent>
      </Card>
    </div>
  );
}