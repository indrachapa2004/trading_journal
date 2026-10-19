import { notFound } from "next/navigation";
import { getTradeById, getTradeScreenshots } from "@/lib/data/trades";
import { calculatePnl } from "@/lib/trades";
import { TradeDetailPageContent } from "./trade-detail-content";

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trade = await getTradeById(id);
  const screenshotsWithUrls = await getTradeScreenshots(id);

  if (!trade) notFound();

  const pnl = calculatePnl(trade);
  const entryAt = new Date(trade.entry_at);
  const exitAt = trade.exit_at ? new Date(trade.exit_at) : null;
  const duration = exitAt
    ? (exitAt.getTime() - entryAt.getTime()) / (1000 * 60 * 60)
    : null;

  return (
    <TradeDetailPageContent
      id={id}
      trade={trade}
      screenshotsWithUrls={screenshotsWithUrls}
      pnl={pnl}
      duration={duration}
    />
  );
}
