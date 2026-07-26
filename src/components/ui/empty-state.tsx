"use client";

import Link from "next/link";
import {
  FileSpreadsheet,
  BarChart3,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IconName = "FileSpreadsheet" | "BarChart3" | "CalendarDays";

const iconMap: Record<IconName, LucideIcon> = {
  FileSpreadsheet,
  BarChart3,
  CalendarDays,
};

type EmptyStateProps = {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryHint?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryHint,
}: EmptyStateProps) {
  const Icon = iconMap[icon];
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 py-16 px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800">
        <Icon className="h-6 w-6 text-zinc-500" />
      </div>
      <h3 className="text-base font-semibold text-zinc-300">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "mt-6"
          )}
        >
          {actionLabel}
        </Link>
      ) : null}
      {secondaryHint ? (
        <p className="mt-3 text-xs text-zinc-600">{secondaryHint}</p>
      ) : null}
    </div>
  );
}