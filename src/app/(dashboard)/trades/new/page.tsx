import { TradeForm } from "@/components/trades/trade-form";

export default function NewTradePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add trade</h1>
        <p className="text-sm text-muted-foreground">
          Record a new trade in your journal.
        </p>
      </div>
      <TradeForm />
    </div>
  );
}
