"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const onboardingSchema = z.object({
  trading_experience: z.enum(["beginner", "intermediate", "pro"]),
  starting_balance: z.coerce.number().min(0),
  risk_per_trade_percent: z.coerce.number().min(0.1).max(100),
  primary_asset_class: z.string().min(1),
  monthly_profit_goal: z.coerce.number().min(0).max(1000).optional(),
});

export async function completeOnboarding(data: {
  trading_experience: string;
  starting_balance: number;
  risk_per_trade_percent: number;
  primary_asset_class: string;
  monthly_profit_goal?: number;
}) {
  const parsed = onboardingSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const d = parsed.data;

  // Update profile
  const { error: profileErr } = await supabase
    .from("profiles")
    .update({
      trading_experience: d.trading_experience,
      onboarding_completed: true,
      primary_asset_class: d.primary_asset_class,
    })
    .eq("id", user.id);

  if (profileErr) return { error: profileErr.message };

  // Update or create the default account with balance, currency, risk
  const { data: accounts } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .limit(1);

  const accountId = accounts?.[0]?.id;

  if (accountId) {
    await supabase
      .from("accounts")
      .update({
        starting_balance: d.starting_balance,
        risk_per_trade_percent: d.risk_per_trade_percent,
      })
      .eq("id", accountId);
  } else {
    await supabase.from("accounts").insert({
      user_id: user.id,
      name: "Main Account",
      starting_balance: d.starting_balance,
      risk_per_trade_percent: d.risk_per_trade_percent,
      is_default: true,
    });
  }

  // Optionally set a monthly P&L goal for the current month
  if (d.monthly_profit_goal && d.monthly_profit_goal > 0 && accountId) {
    const now = new Date();
    const pnlTarget = (d.starting_balance * d.monthly_profit_goal) / 100;
    await supabase.from("monthly_goals").upsert(
      {
        user_id: user.id,
        account_id: accountId,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        pnl_target: pnlTarget,
      },
      { onConflict: "user_id,account_id,year,month" }
    );
  }

  redirect("/dashboard");
}

export async function skipOnboarding() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  redirect("/dashboard");
}
