"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { MockDashboard } from "@/components/landing/mock-dashboard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden border-b border-slate-800/70">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_48%,rgba(34,197,94,0.08),transparent_42%)]" />
      </div>

      <motion.div
        className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:py-24"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.45,
          ease: "easeOut",
        }}
      >
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-green-400">
            <span
              className="size-1.5 rounded-full bg-green-400"
              aria-hidden="true"
            />
            Trading journal &amp; performance analytics
          </p>

          <h1 className="mt-7 max-w-xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-slate-50 sm:text-5xl lg:text-[3.75rem]">
            Make every trade teach you{" "}
            <span className="text-green-400">something.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Log the trade. Capture your mindset. Review the patterns behind
            your results—and build a process you can trust.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 bg-green-500 px-5 text-slate-950 hover:bg-green-400"
              )}
            >
              Start journaling for free
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="#demo"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-slate-700 bg-slate-950/70 px-5 text-slate-200 hover:border-slate-600 hover:bg-slate-900"
              )}
            >
              Explore the preview
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Free to start <span aria-hidden="true">·</span> No credit card
            required
          </p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-800/80 pt-5 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
            <span>Trade journal</span>
            <span>Risk review</span>
            <span>Performance insights</span>
          </div>
        </div>

        <div id="demo" className="min-w-0 scroll-mt-24">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              Workspace preview
            </p>
            <p className="rounded-full border border-green-500/25 bg-green-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-green-300">
              Sample data
            </p>
          </div>
          <MockDashboard />
          <p className="mt-3 text-right text-xs text-slate-400">
            Illustrative account data for preview purposes.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
