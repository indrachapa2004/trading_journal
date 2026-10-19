"use client";

import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const links = [
  { label: "Features", href: "#features" },
  { label: "Preview", href: "#demo" },
  { label: "Pricing", href: "#pricing" },
  { label: "Sign in", href: "/login" },
];

export function LandingFooter() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const activeItem = hoveredItem ?? focusedItem;

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-zinc-100"
          >
            Tradventure
          </Link>
          <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
            A trading journal for clearer decisions and more deliberate review.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setHoveredItem(null);
          }}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget;
            if (
              !(nextTarget instanceof Node) ||
              !event.currentTarget.contains(nextTarget)
            ) {
              setFocusedItem(null);
            }
          }}
        >
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <LayoutGroup id="landing-footer-nav">
              {links.map((link, index) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setHoveredItem(index);
                    }}
                    onFocus={(event) => {
                      if (event.currentTarget.matches(":focus-visible")) {
                        setFocusedItem(index);
                      }
                    }}
                    className={`relative text-xs text-zinc-400 transition-colors hover:text-zinc-100 ${
                      activeItem === index ? "font-medium" : ""
                    }`}
                  >
                    {link.label}
                    {activeItem === index && (
                      <motion.span
                        aria-hidden="true"
                        layoutId={
                          prefersReducedMotion
                            ? undefined
                            : "landing-footer-underline"
                        }
                        initial={prefersReducedMotion ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        transition={{
                          layout: {
                            duration: 0.15,
                            ease: [0.77, 0, 0.175, 1],
                          },
                          opacity: { duration: 0.1, ease: "easeOut" },
                        }}
                        className="pointer-events-none absolute inset-x-0 -bottom-1 h-px bg-emerald-300/60"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </LayoutGroup>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-zinc-500 sm:px-6">
          © {new Date().getFullYear()} Tradventure
        </p>
      </div>
    </footer>
  );
}
