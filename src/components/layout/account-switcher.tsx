"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown, Wallet } from "lucide-react";

import { switchAccount } from "@/app/(dashboard)/settings/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/database";

export function AccountSwitcher({
  accounts,
  activeAccount,
}: {
  accounts: Account[];
  activeAccount: Account | null;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (accounts.length === 0) return null;

  function handleSwitch(accountId: string) {
    startTransition(async () => {
      await switchAccount(accountId);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "w-full justify-between border-zinc-700 bg-zinc-900/50 text-zinc-100 hover:bg-zinc-800"
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <Wallet className="size-3.5 shrink-0 text-emerald-400" />
          <span className="truncate">{activeAccount?.name ?? "Select account"}</span>
        </span>
        <ChevronDown className="size-3.5 shrink-0 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[var(--anchor-width)] border-zinc-700 bg-zinc-900"
      >
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            onClick={() => handleSwitch(account.id)}
            className={cn(
              account.id === activeAccount?.id && "bg-zinc-800 text-emerald-400"
            )}
          >
            <span className="truncate">{account.name}</span>
            <span className="ml-auto font-mono text-xs text-zinc-500">
              {account.currency}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
