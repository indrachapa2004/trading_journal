"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MockDashboard } from "@/components/landing/mock-dashboard";

export function DemoPreview() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="demo"
      className="scroll-mt-20 px-4 pb-20 pt-4 sm:pb-28"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-500/80">
            Live preview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">
            Your command center for every trade
          </h2>
        </div>

        <motion.div
          className="mx-auto max-w-4xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="[perspective:1000px]">
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            >
              <div className="transition-transform duration-500 ease-out [transform:rotateX(12deg)_rotateY(-7deg)] hover:[transform:rotateX(6deg)_rotateY(-3deg)]">
                <div className="rounded-xl bg-gradient-to-b from-zinc-800/50 to-transparent p-1">
                  <MockDashboard />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
