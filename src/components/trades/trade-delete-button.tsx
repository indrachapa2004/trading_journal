"use client";

import { useTransition } from "react";

import { deleteTrade } from "@/app/(dashboard)/trades/actions";
import { Button } from "@/components/ui/button";

export function TradeDeleteButton({ tradeId }: { tradeId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !confirm(
        "Delete this trade and its screenshots? This cannot be undone."
      )
    ) {
      return;
    }

    startTransition(async () => {
      await deleteTrade(tradeId);
    });
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
    >
      {isPending ? "Deleting..." : "Delete trade"}
    </Button>
  );
}
