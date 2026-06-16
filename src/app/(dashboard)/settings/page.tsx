import { SettingsForm } from "@/components/settings/settings-form";
import { PageHeader } from "@/components/layout/page-header";
import {
  getAccounts,
  getProfile,
  getTradingRules,
} from "@/lib/data/accounts";
import { pageMain } from "@/lib/ui-classes";

export default async function SettingsPage() {
  const [profile, accounts, rules] = await Promise.all([
    getProfile(),
    getAccounts(),
    getTradingRules(false),
  ]);

  return (
    <main className={pageMain}>
      <PageHeader
        title="Settings"
        description="Profile, risk limits, accounts, and trading rules"
      />

      <div className="mx-auto max-w-4xl">
        <SettingsForm profile={profile} accounts={accounts} rules={rules} />
      </div>
    </main>
  );
}
