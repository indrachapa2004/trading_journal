import Link from "next/link";
import { redirect } from "next/navigation";

import { CursorSpotlight } from "@/components/landing/cursor-spotlight";
import { DemoPreview } from "@/components/landing/demo-preview";
import { FeatureBento } from "@/components/landing/feature-bento";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Trading Journal — Fix Your Trading Edge",
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
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <CursorSpotlight />
      <MarketingHeader />

      <main className="relative z-10">
        <LandingHero />
        <DemoPreview />

        <div className="py-20">
          <FeatureBento />
        </div>

        {/* Pricing teaser */}
        <section id="pricing" className="scroll-mt-20 border-t border-zinc-800/80 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-semibold text-zinc-100">
              Simple, honest pricing
            </h2>
            <p className="mt-2 text-zinc-400">
              Start free. Upgrade when you need multi-account and advanced
              exports.
            </p>
            <div className="mt-8 inline-flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-10 py-8 ring-1 ring-white/5">
              <p className="font-mono text-5xl font-bold text-zinc-50">$0</p>
              <p className="mt-1 text-sm text-zinc-500">per month to start</p>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-6 bg-zinc-100 text-zinc-900 hover:bg-white"
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
