"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function LandingHero() {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const item = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : fadeUp.hidden,
    visible: {
      ...fadeUp.visible,
      transition: { duration: 0.65, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative overflow-hidden bg-zinc-950 px-4 pb-16 pt-20 sm:pb-24 sm:pt-28">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        <div className="hero-grid absolute inset-0" />
        <div className="hero-spotlight absolute inset-0" />
        <div className="absolute bottom-0 left-1/2 h-px w-[min(100%,640px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item}>
          <Badge
            variant="outline"
            className="mb-8 border-zinc-800 bg-zinc-900/80 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-zinc-500"
          >
            <Sparkles className="size-3 text-zinc-400" />
            Trading journal
          </Badge>
        </motion.div>

        <motion.h1
          variants={item}
          className="hero-headline-gradient text-balance text-3xl font-bold leading-[1.2] tracking-tighter sm:text-4xl sm:leading-[1.18] md:text-5xl md:leading-[1.15]"
        >
          Fix your trading edge.
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg sm:leading-relaxed"
        >
          Most journals are spreadsheets. This is a performance lab. Track your
          data, tag your emotions, and stop repeating the same mistakes.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "hero-cta-primary h-11 gap-2 rounded-lg bg-white px-7 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
            )}
          >
            Start journaling for free
            <ArrowRight className="size-4 text-zinc-700" />
          </Link>
          <Link
            href="#demo"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-lg border border-zinc-800 bg-zinc-950/50 px-7 text-sm font-medium text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
            )}
          >
            View live demo
          </Link>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-5 text-xs tracking-wide text-zinc-600"
        >
          Free to start · No credit card required
        </motion.p>
      </motion.div>
    </section>
  );
}
