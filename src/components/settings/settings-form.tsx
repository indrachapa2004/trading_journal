"use client";

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Account, Profile, TradingRule } from "@/types/database";

export function SettingsForm({
  profile,
  accounts,
  rules,
}: {
  profile: Profile | null;
  accounts: Account[];
  rules: TradingRule[];
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) setError(result.error);
      else setMessage("Profile saved.");
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
      else setMessage("Account created.");
      e.currentTarget.reset();
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
      else setMessage("Rule added.");
      e.currentTarget.reset();
    });
  }

  function handleDeleteRule(ruleId: string) {
    startTransition(async () => {
      const result = await deleteTradingRule(ruleId);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
        <CardHeader>
          <CardTitle className="text-zinc-100">Profile & risk limits</CardTitle>
          <CardDescription className="text-zinc-500">
            Display name, currency, and daily/weekly loss limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfile} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-zinc-400">Display name</Label>
              <Input
                name="display_name"
                defaultValue={profile?.display_name ?? ""}
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-400">Default currency</Label>
              <Input
                name="default_currency"
                defaultValue={profile?.default_currency ?? "USD"}
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
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
            <Button type="submit" disabled={isPending} className="sm:col-span-2">
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
        <CardHeader>
          <CardTitle className="text-zinc-100">Accounts</CardTitle>
          <CardDescription className="text-zinc-500">
            Manage portfolios (live, prop firm, paper)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2 text-sm"
              >
                <span className="text-zinc-200">{account.name}</span>
                <span className="font-mono text-zinc-500">
                  {account.currency} · {account.starting_balance.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAccount} className="grid gap-3 sm:grid-cols-2">
            <Input name="name" placeholder="Account name" required className="border-zinc-700 bg-zinc-950" />
            <Input name="broker" placeholder="Broker (optional)" className="border-zinc-700 bg-zinc-950" />
            <Input name="starting_balance" type="number" step="any" placeholder="Starting balance" defaultValue="0" className="border-zinc-700 bg-zinc-950 font-mono" />
            <Input name="currency" placeholder="USD" defaultValue="USD" className="border-zinc-700 bg-zinc-950 font-mono" />
            <Button type="submit" disabled={isPending} className="sm:col-span-2">
              Add account
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
        <CardHeader>
          <CardTitle className="text-zinc-100">Trading rules</CardTitle>
          <CardDescription className="text-zinc-500">
            Pre-trade checklist items shown when logging trades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2"
              >
                <span className="text-sm text-zinc-300">{rule.label}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDeleteRule(rule.id)}
                  disabled={isPending}
                >
                  <Trash2 className="size-4 text-zinc-500" />
                </Button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddRule} className="flex gap-2">
            <Input name="label" placeholder="New rule..." required className="border-zinc-700 bg-zinc-950" />
            <Button type="submit" disabled={isPending}>Add</Button>
          </form>
        </CardContent>
      </Card>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
