"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this trade? This cannot be undone.")) return;

    startTransition(async () => {
      const result = await deleteTrade(tradeId);
      if (result && "error" in result) alert(result.error);
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
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onView}>
          <Eye className="size-4 mr-2" />
          <span>View details</span>
        </DropdownMenuItem>
        
        {/* FIX: Removed asChild/Link and replaced with onClick + router.push */}
        <DropdownMenuItem onClick={() => router.push(`/trades/${tradeId}/edit`)}>
          <Pencil className="size-4 mr-2" />
          <span>Edit</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <Trash2 className="size-4 mr-2" />
          <span>{isPending ? "Deleting..." : "Delete"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}