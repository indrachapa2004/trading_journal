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
    <div className="flex min-h-screen bg-zinc-950">
      <AppSidebar
        email={userEmail}
        accounts={accounts}
        activeAccount={activeAccount}
        className="hidden lg:flex"
      />

      <div className="flex min-w-0 flex-1 flex-col border-l border-zinc-800">
        <MobileSidebar
          email={userEmail}
          accounts={accounts}
          activeAccount={activeAccount}
        />

        <main className="flex-1 overflow-auto bg-zinc-950">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
