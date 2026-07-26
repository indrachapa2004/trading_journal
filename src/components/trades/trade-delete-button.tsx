"use client";

import { useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTrade } from "@/app/(dashboard)/trades/actions";
import { Button } from "@/components/ui/button";

const UNDO_TIMEOUT_MS = 10000;

export function TradeDeleteButton({
  tradeId,
  onDeleteOptimistic,
  onUndoOptimistic,
  /** Lifted hidden state (for parent to control full page hiding) */
  hidden,
  onHide,
  onUnhide,
}: {
  tradeId: string;
  /** Called immediately to remove the item from the UI */
  onDeleteOptimistic?: () => void;
  /** Called when Undo is clicked to restore the item in the UI */
  onUndoOptimistic?: () => void;
  /** When provided, the component uses this instead of internal state */
  hidden?: boolean;
  onHide?: () => void;
  onUnhide?: () => void;
}) {
  const router = useRouter();
  const [internalHidden, setInternalHidden] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);

  // Use lifted state if provided, otherwise use internal state
  const isHidden = hidden !== undefined ? hidden : internalHidden;
  const setHidden = hidden !== undefined ? (onHide ?? (() => {})) : setInternalHidden;

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  function handleDelete() {
    cleanup();
    cancelledRef.current = false;

    // Immediately hide the content
    setHidden(true);
    onDeleteOptimistic?.();

    // Show toast with undo option
    toast("Trade deleted", {
      description: "Tap Undo to restore. Deleting in 10s...",
      duration: UNDO_TIMEOUT_MS + 1000,
      action: {
        label: "Undo",
        onClick: () => {
          cancelledRef.current = true;
          cleanup();
          setHidden(false);
          onUndoOptimistic?.();
          toast.success("Delete cancelled");
        },
      },
    });

    // Actually delete after timeout
    timeoutRef.current = setTimeout(async () => {
      if (cancelledRef.current) return;

      setIsPending(true);
      const result = await deleteTrade(tradeId);
      setIsPending(false);

      if (result?.error) {
        toast.error(result.error);
        setHidden(false);
        return;
      }

      toast.success("Trade permanently deleted");
      router.refresh();
    }, UNDO_TIMEOUT_MS);
  }

  if (isHidden) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-500">
        <span>Trade deleted — undo available in toast</span>
      </div>
    );
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
