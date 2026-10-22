"use client";

import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteTrade } from "@/app/(dashboard)/trades/actions";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const UNDO_TIMEOUT_MS = 10000;

export function TradeRowActions({
  tradeId,
  onDeleteOptimistic,
  onUndoOptimistic,
}: {
  tradeId: string;
  /** Called immediately to remove the row from the UI */
  onDeleteOptimistic?: () => void;
  /** Called when Undo is clicked to restore the row in the UI */
  onUndoOptimistic?: () => void;
}) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  function handleDelete() {
    cleanup();
    cancelledRef.current = false;

    // Immediately remove from list
    onDeleteOptimistic?.();

    // Show undo toast
    toast("Trade deleted", {
      description: "Tap Undo to restore. Deleting in 10s...",
      duration: UNDO_TIMEOUT_MS + 1000,
      action: {
        label: "Undo",
        onClick: () => {
          cancelledRef.current = true;
          cleanup();
          onUndoOptimistic?.();
          toast.success("Delete cancelled");
        },
      },
    });

    // Actually delete after timeout
    timeoutRef.current = setTimeout(async () => {
      if (cancelledRef.current) return;

      const result = await deleteTrade(tradeId);
      if (result && "error" in result) {
        toast.error(result.error ?? "Delete failed");
        onUndoOptimistic?.(); // restore row on error
        return;
      }

      toast.success("Trade permanently deleted");
      router.refresh();
    }, UNDO_TIMEOUT_MS);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Trade actions"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "text-muted-foreground"
        )}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => router.push(`/trades/${tradeId}`)}>
          <Eye className="size-4 mr-2" />
          <span>View details</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push(`/trades/${tradeId}/edit`)}>
          <Pencil className="size-4 mr-2" />
          <span>Edit</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <Trash2 className="size-4 mr-2" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}