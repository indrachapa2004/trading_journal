import { TrendingUp } from "lucide-react";

import { AccountSwitcher } from "@/components/layout/account-switcher";
import { Logo } from "@/components/ui/Logo";
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
    <div className={cn("flex h-full min-h-0 flex-col bg-zinc-950", className)}>
      <div className="flex h-14 shrink-0 items-center border-b border-zinc-800 px-2">
        <Logo className="scale-50 -ml-2" />
      </div>

      <div className="shrink-0 space-y-4 px-4 py-4">
        <AccountSwitcher accounts={accounts} activeAccount={activeAccount} />
      </div>

      <div className="min-h-0 flex-1 py-2">
        <SidebarNav onNavigate={onNavigate} />
      </div>

      <div className="shrink-0">
        <SidebarUser email={email} />
      </div>
    </div>
  );
}
