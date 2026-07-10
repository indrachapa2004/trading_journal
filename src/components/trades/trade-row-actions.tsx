"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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

export function TradeRowActions({
  tradeId,
  onView,
}: {
  tradeId: string;
  onView?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !confirm("Delete this trade and its screenshots? This cannot be undone.")
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteTrade(tradeId);
      if (result && "error" in result) {
        alert(result.error);
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "text-muted-foreground"
        )}
        disabled={isPending}
        aria-label="Open trade actions"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onView}>
          <Eye className="size-4" />
          View details
        </DropdownMenuItem>
        
        {/* Fixed: Replaced DropdownMenuLinkItem with a native standard link setup */}
        <DropdownMenuItem asChild>
          <Link href={`/trades/${tradeId}/edit`} className="flex w-full items-center gap-2">
            <Pencil className="size-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <Trash2 className="size-4" />
          {isPending ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}