import Link from "next/link";
import { BarChart3, BookOpen, Plus } from "lucide-react";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCurrentUserEmail } from "@/lib/data/trades";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/trades", label: "Trades", icon: BookOpen },
];

export async function AppNav() {
  const email = await getCurrentUserEmail();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold tracking-tight">
            Trading Journal
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/trades/new"
            className={cn(buttonVariants({ size: "sm" }), "gap-2")}
          >
            <Plus className="size-4" />
            Add trade
          </Link>
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <span className="hidden max-w-[180px] truncate text-sm text-muted-foreground sm:block">
            {email}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
