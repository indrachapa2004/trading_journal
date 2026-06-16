import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Set up your profile — Trading Journal",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // If they've already completed onboarding, skip straight to dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarding_completed) redirect("/dashboard");

  return <OnboardingFlow />;
}
