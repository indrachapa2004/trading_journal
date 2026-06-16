import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import type { Account } from "@/types/database";

type DashboardShellProps = {
  children: React.ReactNode;
  userEmail: string | null;
  accounts: Account[];
  activeAccount: Account | null;
};

export function DashboardShell({
  children,
  userEmail,
  accounts,
  activeAccount,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <AppSidebar
        email={userEmail}
        accounts={accounts}
        activeAccount={activeAccount}
        className="hidden lg:flex"
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <MobileSidebar
          email={userEmail}
          accounts={accounts}
          activeAccount={activeAccount}
        />

        <main className="min-h-0 flex-1 overflow-y-auto bg-zinc-950">
          <div className="mx-auto max-w-7xl p-8 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
