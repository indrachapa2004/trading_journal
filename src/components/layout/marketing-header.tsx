import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo className="-ml-2 hidden scale-[0.8] sm:flex" />
        <Link
          href="/"
          aria-label="Tradventure home"
          className="text-lg font-semibold tracking-tight text-slate-50 sm:hidden"
        >
          Trad<span className="text-green-400">venture</span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="#features"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden text-slate-300 hover:text-slate-50 sm:inline-flex"
            )}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden text-slate-300 hover:text-slate-50 sm:inline-flex"
            )}
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "px-2 text-slate-300 hover:text-slate-50 sm:px-2.5"
            )}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 bg-green-500 px-2 text-slate-950 hover:bg-green-400 sm:px-4"
            )}
          >
            <span className="sm:hidden">Sign up</span>
            <span className="hidden sm:inline">Get started</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
