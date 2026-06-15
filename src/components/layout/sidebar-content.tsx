import Link from "next/link";
import { TrendingUp } from "lucide-react";

import { AccountSwitcher } from "@/components/layout/account-switcher";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarUser } from "@/components/layout/sidebar-user";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/database";

type SidebarContentProps = {
  email: string | null;
  accounts: Account[];
  activeAccount: Account | null;
  onNavigate?: () => void;
  className?: string;
};

export function SidebarContent({
  email,
  accounts,
  activeAccount,
  onNavigate,
  className,
}: SidebarContentProps) {
  return (
    <div className={cn("flex h-full flex-col bg-zinc-950", className)}>
      <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-800">
          <TrendingUp className="size-4 text-emerald-400" />
        </div>
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="font-semibold tracking-tight text-zinc-100"
        >
          Trading Journal
        </Link>
      </div>

      <div className="space-y-4 px-4 py-4">
        <AccountSwitcher accounts={accounts} activeAccount={activeAccount} />
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <SidebarNav onNavigate={onNavigate} />
      </div>

      <SidebarUser email={email} />
    </div>
  );
}
