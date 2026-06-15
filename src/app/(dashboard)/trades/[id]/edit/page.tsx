import { notFound } from "next/navigation";

import { TradeForm } from "@/components/trades/trade-form";
import { getTradeById } from "@/lib/data/trades";

export default async function EditTradePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trade = await getTradeById(id);

  if (!trade) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit trade</h1>
        <p className="text-sm text-muted-foreground">
          Update trade details and notes.
        </p>
      </div>
      <TradeForm trade={trade} />
    </div>
  );
}
