import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-8 text-center shadow-2xl sm:p-14">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-zinc-900/0"
          aria-hidden
        />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Ready to trade with clarity?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-zinc-400">
            Your edge starts with honest journaling — track every trade, review
            what worked, and improve with data.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 bg-zinc-100 px-8 text-base text-zinc-900 hover:bg-white"
              )}
            >
              Get started now
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            No credit card required · Free to start
          </p>
        </div>
      </div>
    </section>
  );
}
