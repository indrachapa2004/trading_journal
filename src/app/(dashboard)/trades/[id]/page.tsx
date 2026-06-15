import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";

import { TradeDeleteButton } from "@/components/trades/trade-delete-button";
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
  const trade = await getTradeById(id);

  if (!trade) notFound();

  const pnl = calculatePnl(trade);
  const screenshotsWithUrls = await getTradeScreenshots(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {trade.symbol}
            </h1>
            <Badge>{trade.direction}</Badge>
            <Badge variant="outline">{trade.asset_class}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>P&L</CardDescription>
            <CardTitle
              className={
                pnl != null && pnl < 0
                  ? "text-destructive"
                  : pnl != null && pnl > 0
                    ? "text-emerald-600"
                    : undefined
              }
            >
              {pnl == null ? "Open" : formatCurrency(pnl)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Entry</CardDescription>
            <CardTitle>{formatCurrency(trade.entry_price)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Exit</CardDescription>
            <CardTitle>
              {trade.exit_price != null
                ? formatCurrency(trade.exit_price)
                : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Quantity</CardDescription>
            <CardTitle>{trade.quantity}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trade details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fees</span>
              <span>{formatCurrency(trade.fees)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stop loss</span>
              <span>
                {trade.stop_loss != null
                  ? formatCurrency(trade.stop_loss)
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Take profit</span>
              <span>
                {trade.take_profit != null
                  ? formatCurrency(trade.take_profit)
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Emotional state</span>
              <span>{trade.emotional_state ?? "—"}</span>
            </div>
            <Separator />
            <div>
              <p className="mb-1 text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-1">
                {trade.tags.length > 0 ? (
                  trade.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="mb-1 font-medium">Pre-trade</p>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {trade.pre_trade_notes || "No pre-trade notes."}
              </p>
            </div>
            <Separator />
            <div>
              <p className="mb-1 font-medium">Post-trade</p>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {trade.post_trade_notes || "No post-trade notes."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Screenshots</CardTitle>
          <CardDescription>Chart images for this trade</CardDescription>
        </CardHeader>
        <CardContent>
          <ScreenshotGallery
            tradeId={id}
            screenshots={screenshotsWithUrls.filter((s) => s.url)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
