import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Logo className="scale-75 -ml-3" />
        <nav className="flex items-center gap-2">
          <Link
            href="#features"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden text-zinc-400 hover:text-zinc-100 sm:inline-flex"
            )}
          >
            Features
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-zinc-400 hover:text-zinc-100"
            )}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-zinc-100 text-zinc-900 hover:bg-white"
            )}
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
