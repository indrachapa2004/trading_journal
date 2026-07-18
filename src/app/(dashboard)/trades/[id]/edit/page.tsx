import { notFound } from "next/navigation";

import { TradeForm } from "@/components/trades/trade-form";
import { getTradeById } from "@/lib/data/trades";

import { ArrowLeft } from "lucide-react";

import { LinkButton } from "@/components/ui/link-button";

export default async function EditTradePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trade = await getTradeById(id);

  if (!trade) notFound();

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-10">
      <div className="mb-6 space-y-4">
        <LinkButton
          href="/trades"
          variant="ghost"
          size="sm"
          className="-ml-2 text-zinc-400"
        >
          <ArrowLeft className="size-4" />
          Back
        </LinkButton>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Edit trade
          </h1>
          <p className="text-sm text-zinc-500">
            Update trade details and notes.
          </p>
        </div>
      </div>
      <TradeForm trade={trade} />
    </div>
  );
}
