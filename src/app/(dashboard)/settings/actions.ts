"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { ACTIVE_ACCOUNT_COOKIE } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, userId: user.id };
}

export async function switchAccount(accountId: string) {
  const { supabase, userId } = await getUserId();

  const { data: account } = await supabase
    .from("accounts")
    .select("id")
    .eq("id", accountId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!account) return { error: "Account not found." };

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ACCOUNT_COOKIE, accountId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  await supabase
    .from("profiles")
    .update({ active_account_id: accountId })
    .eq("id", userId);

  revalidatePath("/", "layout");
  return { success: true };
}

const accountSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  broker: z.string().max(50).optional(),
  starting_balance: z.coerce.number().min(0),
  currency: z.string().min(3).max(3).default("USD"),
});

export async function createAccount(formData: FormData) {
  const parsed = accountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const { supabase, userId } = await getUserId();
  const { count } = await supabase
    .from("accounts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id: userId,
      name: parsed.data.name,
      broker: parsed.data.broker || null,
      starting_balance: parsed.data.starting_balance,
      currency: parsed.data.currency.toUpperCase(),
      is_default: (count ?? 0) === 0,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  if ((count ?? 0) === 0) {
    await switchAccount(data.id);
  }

  revalidatePath("/", "layout");
  return { success: true, accountId: data.id };
}

const profileSchema = z.object({
  first_name: z.string().max(50).optional(),
  last_name: z.string().max(50).optional(),
  default_currency: z.string().min(3).max(3),
  daily_loss_limit: z.coerce.number().min(0).optional().or(z.literal("")),
  weekly_loss_limit: z.coerce.number().min(0).optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData) {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const { supabase, userId } = await getUserId();
  const firstName = parsed.data.first_name?.trim() || null;
  const lastName = parsed.data.last_name?.trim() || null;
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || null;
  const currency = parsed.data.default_currency.toUpperCase();

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      display_name: displayName,
      default_currency: currency,
      daily_loss_limit:
        parsed.data.daily_loss_limit === ""
          ? null
          : Number(parsed.data.daily_loss_limit),
      weekly_loss_limit:
        parsed.data.weekly_loss_limit === ""
          ? null
          : Number(parsed.data.weekly_loss_limit),
    })
    .eq("id", userId);

  if (error) return { error: error.message };

  await supabase
    .from("accounts")
    .update({ currency })
    .eq("user_id", userId)
    .eq("is_default", true);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

const ruleSchema = z.object({
  label: z.string().min(1).max(120),
});

export async function addTradingRule(formData: FormData) {
  const parsed = ruleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Invalid rule label." };

  const { supabase, userId } = await getUserId();
  const { count } = await supabase
    .from("trading_rules")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { error } = await supabase.from("trading_rules").insert({
    user_id: userId,
    label: parsed.data.label.trim(),
    sort_order: (count ?? 0) + 1,
  });

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/add-trade");
  return { success: true };
}

export async function deleteTradingRule(ruleId: string) {
  const { supabase, userId } = await getUserId();

  const { error } = await supabase
    .from("trading_rules")
    .delete()
    .eq("id", ruleId)
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/add-trade");
  return { success: true };
}

const goalSchema = z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  pnl_target: z.coerce.number().optional().or(z.literal("")),
  win_rate_target: z.coerce.number().min(0).max(100).optional().or(z.literal("")),
  account_id: z.string().uuid(),
});

export async function upsertMonthlyGoal(formData: FormData) {
  const parsed = goalSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid goal data" };
  }

  const { supabase, userId } = await getUserId();

  const { error } = await supabase.from("monthly_goals").upsert(
    {
      user_id: userId,
      account_id: parsed.data.account_id,
      year: parsed.data.year,
      month: parsed.data.month,
      pnl_target:
        parsed.data.pnl_target === "" ? null : Number(parsed.data.pnl_target),
      win_rate_target:
        parsed.data.win_rate_target === ""
          ? null
          : Number(parsed.data.win_rate_target),
    },
    { onConflict: "user_id,account_id,year,month" }
  );

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateAccountBalance(
  accountId: string,
  newBalance: number
) {
  const { supabase, userId } = await getUserId();

  const { error } = await supabase
    .from("accounts")
    .update({ starting_balance: newBalance })
    .eq("id", accountId)
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function exportTradesCsv() {
  const { supabase, userId } = await getUserId();
  const cookieStore = await cookies();
  const accountId = cookieStore.get(ACTIVE_ACCOUNT_COOKIE)?.value;

  let query = supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .order("entry_at", { ascending: false });

  if (accountId) query = query.eq("account_id", accountId);

  const { data, error } = await query;
  if (error) return { error: error.message };

  const { tradesToCsv } = await import("@/lib/risk");
  return { csv: tradesToCsv((data ?? []) as import("@/types/database").Trade[]) };
}
