import { getAccounts, getActiveAccount } from "@/lib/data/accounts";
import { getCurrentUserEmail } from "@/lib/data/trades";

import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userEmail, accounts, activeAccount] = await Promise.all([
    getCurrentUserEmail(),
    getAccounts(),
    getActiveAccount(),
  ]);

  return (
    <DashboardShell
      userEmail={userEmail}
      accounts={accounts}
      activeAccount={activeAccount}
    >
      {children}
    </DashboardShell>
  );
}
