import { SidebarContent } from "@/components/layout/sidebar-content";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/database";

type AppSidebarProps = {
  email: string | null;
  accounts: Account[];
  activeAccount: Account | null;
  className?: string;
};

export function AppSidebar({
  email,
  accounts,
  activeAccount,
  className,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-screen w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950",
        className
      )}
    >
      <SidebarContent
        email={email}
        accounts={accounts}
        activeAccount={activeAccount}
      />
    </aside>
  );
}
