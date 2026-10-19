import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="relative overflow-hidden rounded-xl border border-slate-700/60 bg-[#0e1223] p-8 text-center ring-1 ring-white/5 sm:p-14">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.08),transparent_60%)]"
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            Ready to trade with clarity?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-300">
            Your edge starts with honest journaling — track every trade, review
            what worked, and improve with data.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 bg-green-500 px-8 text-base text-slate-950 hover:bg-green-400"
              )}
            >
              Get started now
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            No credit card required · Free to start
          </p>
        </div>
      </div>
    </section>
  );
}
