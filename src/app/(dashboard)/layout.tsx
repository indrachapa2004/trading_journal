import { Toaster } from "sonner";
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
    <>
      <DashboardShell
        userEmail={userEmail}
        accounts={accounts}
        activeAccount={activeAccount}
      >
        {children}
      </DashboardShell>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#18181b",
            border: "1px solid #27272a",
            color: "#e4e4e7",
          },
        }}
      />
    </>
  );
}
