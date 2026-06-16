import { createClient } from "@/lib/supabase/server";

const DEFAULT_TRADING_RULES = [
  { label: "Reviewed my trading plan", sort_order: 1 },
  { label: "Defined stop loss before entry", sort_order: 2 },
  { label: "Position size within risk limit", sort_order: 3 },
  { label: "Not trading out of revenge/FOMO", sort_order: 4 },
] as const;

export async function ensureUserSetup(
  userId: string,
  firstName: string,
  lastName: string
) {
  const supabase = await createClient();
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      first_name: firstName || null,
      last_name: lastName || null,
      display_name: displayName,
    });
    if (profileError) throw new Error(profileError.message);
  } else if (firstName || lastName) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: firstName || null,
        last_name: lastName || null,
        display_name: displayName,
      })
      .eq("id", userId);
    if (profileError) throw new Error(profileError.message);
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (!account) {
    const { error: accountError } = await supabase.from("accounts").insert({
      user_id: userId,
      name: "Main Account",
      is_default: true,
    });
    if (accountError) throw new Error(accountError.message);
  }

  const { count } = await supabase
    .from("trading_rules")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if ((count ?? 0) === 0) {
    const { error: rulesError } = await supabase.from("trading_rules").insert(
      DEFAULT_TRADING_RULES.map((rule) => ({
        user_id: userId,
        label: rule.label,
        sort_order: rule.sort_order,
      }))
    );
    if (rulesError) throw new Error(rulesError.message);
  }
}

/** Skip onboarding for established users; send new signups through onboarding. */
export async function resolvePostAuthRedirect(
  userId: string
): Promise<"/onboarding" | "/dashboard"> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return "/onboarding";
  if (profile.onboarding_completed) return "/dashboard";

  const { count: tradeCount } = await supabase
    .from("trades")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if ((tradeCount ?? 0) > 0) {
    await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", userId);
    return "/dashboard";
  }

  return "/onboarding";
}
