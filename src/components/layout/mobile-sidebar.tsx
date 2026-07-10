"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { SidebarContent } from "@/components/layout/sidebar-content";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

import type { Account } from "@/types/database";

type MobileSidebarProps = {
  email: string | null;
  accounts: Account[];
  activeAccount: Account | null;
};

export function MobileSidebar({
  email,
  accounts,
  activeAccount,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4 lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="size-4" />
        </Button>
        <span className="font-semibold text-zinc-100 ml-auto">TJ</span>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        {open ? (
          <SheetContent
            side="left"
            showCloseButton
            className="w-64 max-w-[85vw] border-zinc-800 bg-zinc-950 p-0 text-zinc-100"
          >
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <SidebarContent
              email={email}
              accounts={accounts}
              activeAccount={activeAccount}
              onNavigate={() => setOpen(false)}
              className="h-full"
            />
          </SheetContent>
        ) : null}
      </Sheet>
    </>
  );
}
