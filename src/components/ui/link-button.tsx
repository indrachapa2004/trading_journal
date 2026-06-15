"use client";

import { useRouter } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof buttonVariants>;

export function LinkButton({
  href,
  children,
  className,
  variant,
  size,
}: LinkButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={() => router.push(href)}
    >
      {children}
    </button>
  );
}
