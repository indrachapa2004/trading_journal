import { SettingsForm } from "@/components/settings/settings-form";
import {
  getAccounts,
  getProfile,
  getTradingRules,
} from "@/lib/data/accounts";

export default async function SettingsPage() {
  const [profile, accounts, rules] = await Promise.all([
    getProfile(),
    getAccounts(),
    getTradingRules(false),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Profile, risk limits, accounts, and trading rules
        </p>
      </div>

      <SettingsForm profile={profile} accounts={accounts} rules={rules} />
    </section>
  );
}
