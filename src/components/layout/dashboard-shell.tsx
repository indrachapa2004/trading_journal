import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DevelopmentNotice } from "@/components/layout/development-notice";
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
    <div className="fixed inset-0 flex overflow-hidden bg-[#101510]">
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

        <DevelopmentNotice userEmail={userEmail} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto bg-[#101510]">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
