import Link from "next/link";
import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";

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
import { getTradeById, getTradeScreenshots } from "@/lib/data/trades";
import { calculatePnl, formatCurrency } from "@/lib/trades";
import { cn } from "@/lib/utils";

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new" || id === "add") {
    redirect("/add-trade");
  }

  const trade = await getTradeById(id);

  if (!trade) notFound();

  const pnl = calculatePnl(trade);
  const screenshotsWithUrls = await getTradeScreenshots(id);

  return (
    <div className="container max-w-6xl py-8 md:py-10 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              {trade.symbol}
            </h1>
            <Badge>{trade.direction}</Badge>
            <Badge variant="outline">{trade.asset_class}</Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Entered {format(new Date(trade.entry_at), "MMM d, yyyy h:mm a")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/trades/${id}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Edit
          </Link>
          <TradeDeleteButton tradeId={id} />
        </div>
      </div>

      {/* ── Summary Cards (Dashboard-style) ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-lg ring-1 ring-white/10 backdrop-blur-md">
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
              P&L
            </p>
            <p
              className={cn(
                "font-mono text-2xl font-semibold tracking-tight tabular-nums",
                pnl != null && pnl < 0
                  ? "text-rose-400"
                  : pnl != null && pnl > 0
                    ? "text-emerald-400"
                    : "text-zinc-100"
              )}
            >
              {pnl == null ? "Open" : formatCurrency(pnl)}
            </p>
          </div>
        </Card>
        <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5 shadow-lg backdrop-blur-md">
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
              Entry
            </p>
            <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-zinc-100">
              {formatCurrency(trade.entry_price)}
            </p>
          </div>
        </Card>
        <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5 shadow-lg backdrop-blur-md">
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
              Exit
            </p>
            <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-zinc-100">
              {trade.exit_price != null
                ? formatCurrency(trade.exit_price)
                : "—"}
            </p>
          </div>
        </Card>
        <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5 shadow-lg backdrop-blur-md">
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
              Quantity
            </p>
            <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-zinc-100">
              {trade.quantity}
            </p>
          </div>
        </Card>
      </div>

      {/* ── Details & Notes Grid ── */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-zinc-800/80 bg-zinc-950/50 ring-1 ring-white/5 backdrop-blur-sm">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Trade details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Fees</span>
              <span className="font-mono text-zinc-200">
                {formatCurrency(trade.fees)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Stop loss</span>
              <span className="font-mono text-zinc-200">
                {trade.stop_loss != null
                  ? formatCurrency(trade.stop_loss)
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Take profit</span>
              <span className="font-mono text-zinc-200">
                {trade.take_profit != null
                  ? formatCurrency(trade.take_profit)
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Emotional state</span>
              <span className="font-mono text-zinc-200 capitalize">
                {trade.emotional_state ?? "—"}
              </span>
            </div>
            <Separator className="bg-zinc-800" />
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

        <Card className="border-zinc-800/80 bg-zinc-950/50 ring-1 ring-white/5 backdrop-blur-sm">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 text-sm">
            <div>
              <p className="text-zinc-500 mb-1">Pre-trade</p>
              <p className="whitespace-pre-wrap text-zinc-400">
                {trade.pre_trade_notes || "No pre-trade notes."}
              </p>
            </div>
            <Separator className="bg-zinc-800" />
            <div>
              <p className="text-zinc-500 mb-1">Post-trade</p>
              <p className="whitespace-pre-wrap text-zinc-400">
                {trade.post_trade_notes || "No post-trade notes."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Psychology Tracker ── */}
      <Card className="border-zinc-800/80 bg-zinc-950/50 ring-1 ring-white/5 backdrop-blur-sm">
        <CardHeader className="p-8 pb-0">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Psychology tracker
          </CardTitle>
          <CardDescription className="text-zinc-500 mt-1">
            Tag mistakes and rate your execution for later analytics.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <PsychologyTracker
            key={trade.updated_at}
            tradeId={id}
            initialMistakes={trade.mistakes ?? []}
            initialSelfRating={trade.self_rating}
            initialEmotion={trade.emotional_state}
          />
        </CardContent>
      </Card>

      {/* ── Screenshots ── */}
      <Card className="border-zinc-800/80 bg-zinc-950/50 ring-1 ring-white/5 backdrop-blur-sm">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Screenshots
          </CardTitle>
          <CardDescription className="text-zinc-500 mt-1">
            Chart images for this trade
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ScreenshotGallery
            tradeId={id}
            screenshots={screenshotsWithUrls.filter((s) => s.url)}
          />
        </CardContent>
      </Card>
    </div>
  );
}