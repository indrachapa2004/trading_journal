"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import {
  addTradingRule,
  createAccount,
  deleteTradingRule,
  updateProfile,
} from "@/app/(dashboard)/settings/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Account, Profile, TradingRule } from "@/types/database";
import { terminalCard } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "BTC"];

/** Reset shadcn Card default py/gap so padding matches other dashboard tabs */
const settingsCard = cn(terminalCard, "gap-0 py-0");
const cardHeaderClass = "px-6 pt-6 pb-0";
const cardContentClass = "space-y-4 px-6 pt-6";
const cardContentWithFooterClass = "space-y-4 px-6 pb-6 pt-6";
const cardFooterClass =
  "flex justify-end border-t border-zinc-800 bg-transparent px-6 py-4";

export function SettingsForm({
  profile,
  accounts,
  rules,
}: {
  profile: Profile | null;
  accounts: Account[];
  rules: TradingRule[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState(profile?.default_currency ?? "USD");
  const [isPending, startTransition] = useTransition();

  function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) setError(result.error);
      else {
        setMessage("Profile saved.");
        router.refresh();
      }
    });
  }

  function handleAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createAccount(formData);
      if (result.error) setError(result.error);
      else {
        setMessage("Account created.");
        e.currentTarget.reset();
        router.refresh();
      }
    });
  }

  function handleAddRule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addTradingRule(formData);
      if (result.error) setError(result.error);
      else {
        setMessage("Rule added.");
        e.currentTarget.reset();
        router.refresh();
      }
    });
  }

  function handleDeleteRule(ruleId: string) {
    startTransition(async () => {
      const result = await deleteTradingRule(ruleId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <Card className={settingsCard}>
        <form onSubmit={handleProfile} className="contents">
          <CardHeader className={cardHeaderClass}>
            <CardTitle className="text-xl font-semibold text-zinc-100">
              Profile & risk limits
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500">
              Name, base currency, and daily/weekly loss limits
            </CardDescription>
          </CardHeader>

          <CardContent className={cardContentWithFooterClass}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-zinc-400">First name</Label>
                <Input
                  name="first_name"
                  defaultValue={profile?.first_name ?? ""}
                  placeholder="Alex"
                  autoComplete="given-name"
                  className="border-zinc-700 bg-zinc-950"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-400">Last name</Label>
                <Input
                  name="last_name"
                  defaultValue={profile?.last_name ?? ""}
                  placeholder="Rivera"
                  autoComplete="family-name"
                  className="border-zinc-700 bg-zinc-950"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-400">Base currency</Label>
              <input type="hidden" name="default_currency" value={currency} />
              <div className="flex flex-wrap gap-2">
                {CURRENCIES.map((c) => {
                  const selected = currency === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-mono font-medium transition-colors",
                        selected
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                          : "border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-zinc-400">Daily loss limit</Label>
                <Input
                  name="daily_loss_limit"
                  type="number"
                  step="any"
                  defaultValue={profile?.daily_loss_limit ?? ""}
                  placeholder="500"
                  className="border-zinc-700 bg-zinc-950 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-400">Weekly loss limit</Label>
                <Input
                  name="weekly_loss_limit"
                  type="number"
                  step="any"
                  defaultValue={profile?.weekly_loss_limit ?? ""}
                  placeholder="1500"
                  className="border-zinc-700 bg-zinc-950 font-mono"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className={cardFooterClass}>
            <Button type="submit" disabled={isPending} className="w-fit px-8">
              Save profile
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className={settingsCard}>
        <form onSubmit={handleAccount} className="contents">
          <CardHeader className={cardHeaderClass}>
            <CardTitle className="text-xl font-semibold text-zinc-100">
              Accounts
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500">
              Manage portfolios (live, prop firm, paper)
            </CardDescription>
          </CardHeader>

          <CardContent className={cardContentWithFooterClass}>
            {accounts.length > 0 ? (
              <ul className="space-y-2">
                {accounts.map((account) => (
                  <li
                    key={account.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-4 py-2.5 text-sm"
                  >
                    <span className="font-medium text-zinc-200">{account.name}</span>
                    <span className="font-mono text-zinc-500">
                      {account.currency} · {account.starting_balance.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500">No accounts yet.</p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-zinc-400">Account name</Label>
                <Input
                  name="name"
                  placeholder="Main portfolio"
                  required
                  className="border-zinc-700 bg-zinc-950"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-400">Broker</Label>
                <Input
                  name="broker"
                  placeholder="Optional"
                  className="border-zinc-700 bg-zinc-950"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-400">Starting balance</Label>
                <Input
                  name="starting_balance"
                  type="number"
                  step="any"
                  placeholder="10000"
                  defaultValue="0"
                  className="border-zinc-700 bg-zinc-950 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-400">Currency</Label>
                <Input
                  name="currency"
                  placeholder="USD"
                  defaultValue="USD"
                  className="border-zinc-700 bg-zinc-950 font-mono"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className={cardFooterClass}>
            <Button type="submit" disabled={isPending} className="w-fit px-8">
              Add account
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className={settingsCard}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle className="text-xl font-semibold text-zinc-100">
            Trading rules
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500">
            Pre-trade checklist items shown when logging trades
          </CardDescription>
        </CardHeader>

        <CardContent className={cn(cardContentClass, "pb-6")}>
          {rules.length > 0 ? (
            <ul className="space-y-2">
              {rules.map((rule) => (
                <li
                  key={rule.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-4 py-2.5"
                >
                  <span className="text-sm text-zinc-300">{rule.label}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDeleteRule(rule.id)}
                    disabled={isPending}
                    className="shrink-0 text-zinc-500 hover:bg-zinc-800/80 hover:text-rose-400"
                    aria-label={`Delete rule: ${rule.label}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No trading rules yet.</p>
          )}

          <form onSubmit={handleAddRule} className="flex items-center gap-2">
            <Input
              name="label"
              placeholder="New rule..."
              required
              className="min-w-0 flex-1 border-zinc-700 bg-zinc-950"
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-fit shrink-0 px-6"
            >
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
