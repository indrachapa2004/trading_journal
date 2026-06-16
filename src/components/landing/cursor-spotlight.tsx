"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect } from "react";

export function CursorSpotlight() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 28, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 28, mass: 0.8 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    function onMove(event: MouseEvent) {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  const background = useMotionTemplate`radial-gradient(520px circle at ${springX}px ${springY}px, rgba(255,255,255,0.07), transparent 72%)`;

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ background }}
      aria-hidden
    />
  );
}
