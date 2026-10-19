"use client";

import { MotionConfig, motion } from "framer-motion";

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0.15, transform: "translateY(1rem)" }}
        whileInView={{ opacity: 1, transform: "none" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
