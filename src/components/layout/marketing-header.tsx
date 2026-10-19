"use client";

import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const activeItem = hoveredItem ?? focusedItem;

  const navItems = [
    { href: "#features", label: "Features", className: "hidden sm:inline-flex" },
    { href: "#pricing", label: "Pricing", className: "hidden sm:inline-flex" },
    { href: "/login", label: "Sign in", className: "px-2 sm:px-2.5" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101510]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo className="-ml-2 hidden scale-[0.8] sm:flex" />
        <Link
          href="/"
          aria-label="Tradventure home"
          className="text-lg font-semibold tracking-tight text-slate-50 sm:hidden"
        >
          Trad<span className="text-green-400">venture</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-1 sm:gap-2"
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setHoveredItem(null);
          }}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget;
            if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
              setFocusedItem(null);
            }
          }}
        >
          <LayoutGroup id="marketing-header-nav">
            {navItems.map((item, index) => {
              const isActive = activeItem === index;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setHoveredItem(index);
                  }}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible")) {
                      setFocusedItem(index);
                    }
                  }}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    item.className,
                    "relative text-zinc-300 hover:bg-transparent hover:text-zinc-50",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      aria-hidden="true"
                      layoutId={prefersReducedMotion ? undefined : "marketing-nav-underline"}
                      initial={prefersReducedMotion ? { opacity: 0 } : false}
                      animate={{ opacity: 1 }}
                      transition={{
                        layout: {
                          duration: 0.18,
                          ease: [0.77, 0, 0.175, 1],
                        },
                        opacity: { duration: 0.12, ease: "easeOut" },
                      }}
                      className="pointer-events-none absolute inset-x-2 bottom-0 h-0.5 bg-emerald-300"
                    />
                  )}
                </Link>
              );
            })}
          </LayoutGroup>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 bg-emerald-300 px-2 text-[#102016] hover:bg-emerald-200 sm:px-4"
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
