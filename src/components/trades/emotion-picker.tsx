"use client";

import type { EmotionalState } from "@/types/database";
import { EMOTIONAL_STATES } from "@/lib/trade-emotions";
import { cn } from "@/lib/utils";

export function EmotionPicker({
  value,
  onChange,
}: {
  value: EmotionalState | null;
  onChange: (value: EmotionalState) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {EMOTIONAL_STATES.map((emotion) => {
        const Icon = emotion.icon;
        const selected = value === emotion.value;

        return (
          <button
            key={emotion.value}
            type="button"
            onClick={() => onChange(emotion.value)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
              selected
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            )}
            aria-pressed={selected}
          >
            <Icon className="size-4" />
            {emotion.label}
          </button>
        );
      })}
    </div>
  );
}
