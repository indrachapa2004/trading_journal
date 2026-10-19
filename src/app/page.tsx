import Link from "next/link";
import { redirect } from "next/navigation";

import { FeatureBento } from "@/components/landing/feature-bento";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Tradventure — A trading journal built around your process",
  description:
    "Record the setup, risk, mindset, and outcome behind every trade. Review your patterns and make your process more deliberate.",
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className={cn("min-h-screen bg-[#101510] text-zinc-100")}>
      <MarketingHeader />

      <main className="relative z-10">
        <LandingHero />

        <div className="border-b border-white/10 py-16 sm:py-20">
          <FeatureBento />
        </div>

        {/* Pricing teaser */}
        <section
          id="pricing"
          className="scroll-mt-20 border-b border-white/10 py-16 sm:py-20"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
                Straightforward pricing
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                Start with the essentials.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                Keep a clear record of your trades for free. Upgrade when you
                need multi-account tools and advanced exports.
              </p>
            </div>
            <div className="flex items-center justify-between gap-8 border-y border-white/10 py-5 md:min-w-80 md:border-y-0 md:border-l md:pl-8">
              <div>
                <p className="font-mono text-4xl font-medium tabular-nums text-zinc-50">
                  $0
                </p>
                <p className="mt-1 text-sm text-zinc-400">to get started</p>
              </div>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-10 bg-emerald-300 px-5 text-[#102016] hover:bg-emerald-200"
                )}
              >
                Create account
              </Link>
            </div>
          </div>
        </section>

        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
