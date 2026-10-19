import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-col gap-8 border-y border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
            Make the next review count
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight text-zinc-50 sm:text-3xl">
            A better process starts with an honest record.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Start with the details you already know. Let the patterns emerge
            over time.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 gap-2 bg-emerald-300 px-5 text-[#102016] hover:bg-emerald-200"
            )}
          >
            Create your account
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <p className="mt-2 text-xs text-zinc-500">Free to start</p>
        </div>
      </div>
    </section>
  );
}
