import { AddTradeForm } from "@/components/trades/add-trade-form";
import { PageHeader } from "@/components/layout/page-header";
import { getTradingRules } from "@/lib/data/accounts";
import { LinkButton } from "@/components/ui/link-button";

export default async function AddTradePage() {
  const rules = await getTradingRules();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Log a trade"
        description="Capture the execution, risk, and decisions behind this trade."
      >
        <LinkButton href="/trades" variant="outline">
          Cancel
        </LinkButton>
      </PageHeader>
      <AddTradeForm rules={rules} />
    </div>
  );
}
