import { Inter } from "next/font/google";
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

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tradventure — Make Every Trade Teach You Something",
  description:
    "Most journals are spreadsheets. This is a performance lab. Track your data, tag your emotions, and stop repeating the same mistakes.",
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
    <div
      className={cn(
        inter.className,
        "relative min-h-screen bg-[#020617] text-slate-50"
      )}
    >
      <MarketingHeader />

      <main className="relative z-10">
        <LandingHero />

        <div className="border-b border-slate-800/70 py-16 sm:py-20">
          <FeatureBento />
        </div>

        {/* Pricing teaser */}
        <section
          id="pricing"
          className="scroll-mt-20 border-b border-slate-800/70 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-400">
              Straightforward pricing
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-50 sm:text-3xl">
              Simple, honest pricing
            </h2>
            <p className="mt-3 text-slate-400">
              Start free. Upgrade when you need multi-account and advanced
              exports.
            </p>
            <div className="mt-8 inline-flex flex-col items-center rounded-xl border border-slate-700/60 bg-[#0e1223] px-10 py-8 ring-1 ring-white/5">
              <p className="font-mono text-5xl font-semibold tabular-nums text-slate-50">
                $0
              </p>
              <p className="mt-1 text-sm text-slate-400">per month to start</p>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-6 h-11 bg-green-500 px-6 text-slate-950 hover:bg-green-400"
                )}
              >
                Create free account
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
