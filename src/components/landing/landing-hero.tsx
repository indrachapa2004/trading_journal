"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CircleCheck } from "lucide-react";

import { MockDashboard } from "@/components/landing/mock-dashboard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="min-h-[100svh] overflow-hidden border-b border-white/10 pt-16 sm:pt-0" style={{ paddingTop: undefined }} >
      <motion.div
        className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:py-20"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.45,
          ease: "easeOut",
        }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
            FOR TRADERS WHO CHASE EDGE, NOT LUCK
          </p>

          <h1 className="mt-6 max-w-xl text-balance text-4xl font-medium leading-[1.08] tracking-[-0.045em] text-zinc-50 sm:text-5xl lg:text-[3.75rem]">
            Fix Your Trading Edge.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Log the setup, the mindset, the outcome. Then map where your edge
            actually lives.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 bg-emerald-300 px-5 text-[#102016] hover:bg-emerald-200",
              )}
            >
              Start your journal
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="#demo"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-white/15 bg-transparent px-5 text-zinc-200 hover:border-white/30 hover:bg-white/5",
              )}
            >
              See how it works
            </Link>
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
            <CircleCheck
              className="size-4 text-emerald-300"
              aria-hidden="true"
            />
            Free to start. No credit card required.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-sm text-zinc-400">
            <span>Execution notes</span>
            <span>Risk tracking</span>
            <span>Performance review</span>
          </div>
        </div>

        <div id="demo" className="min-w-0 scroll-mt-24">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              A look inside the journal
            </p>
            <p className="border border-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
              Illustrative data
            </p>
          </div>
          <MockDashboard />
          <p className="mt-3 text-right text-xs text-zinc-500">
            Example metrics shown for demonstration.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
