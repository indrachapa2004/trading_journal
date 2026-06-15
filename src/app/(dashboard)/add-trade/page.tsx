import { AddTradeForm } from "@/components/trades/add-trade-form";
import { getTradingRules } from "@/lib/data/accounts";

import { ArrowLeft } from "lucide-react";

import { LinkButton } from "@/components/ui/link-button";

export default async function AddTradePage() {
  const rules = await getTradingRules();

  return (
    <section className="space-y-6">
      <div className="space-y-4">
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
            Add trade
          </h1>
          <p className="text-sm text-zinc-500">
            Record a new trade in your journal.
          </p>
        </div>
      </div>
      <AddTradeForm rules={rules} />
    </section>
  );
}
