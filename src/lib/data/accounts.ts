import { createClient } from "@/lib/supabase/server";
import { getActiveAccountIdFromCookie } from "@/lib/account";
import type { Account, MonthlyGoal, Profile, TradingRule } from "@/types/database";

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getProfile(): Promise<Profile | null> {
  const { supabase, user } = await getAuthUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Profile | null;
}

export async function getAccounts(): Promise<Account[]> {
  const { supabase, user } = await getAuthUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Account[];
}

export async function getActiveAccount(): Promise<Account | null> {
  const accounts = await getAccounts();
  if (accounts.length === 0) return null;

  const cookieId = await getActiveAccountIdFromCookie();
  if (cookieId) {
    const match = accounts.find((a) => a.id === cookieId);
    if (match) return match;
  }

  const profile = await getProfile();
  if (profile?.active_account_id) {
    const match = accounts.find((a) => a.id === profile.active_account_id);
    if (match) return match;
  }

  return accounts.find((a) => a.is_default) ?? accounts[0];
}

export async function getActiveAccountStartingBalance(): Promise<number> {
  const account = await getActiveAccount();
  return Number(account?.starting_balance ?? 0);
}

export async function getActiveAccountCurrency(): Promise<string> {
  const account = await getActiveAccount();
  return account?.currency ?? "USD";
}

export async function getTradingRules(activeOnly = true): Promise<TradingRule[]> {
  const { supabase, user } = await getAuthUser();
  if (!user) return [];

  let query = supabase
    .from("trading_rules")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return (data ?? []) as TradingRule[];
}

export async function getMonthlyGoal(
  year: number,
  month: number
): Promise<MonthlyGoal | null> {
  const { supabase, user } = await getAuthUser();
  if (!user) return null;

  const account = await getActiveAccount();
  if (!account) return null;

  const { data, error } = await supabase
    .from("monthly_goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("account_id", account.id)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as MonthlyGoal | null;
}
