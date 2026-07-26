"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { updateTradePsychology } from "@/app/(dashboard)/trades/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { TRADE_MISTAKES, type TradeMistake } from "@/lib/trade-psychology";
import { EmotionPicker } from "@/components/trades/emotion-picker";
import type { EmotionalState } from "@/types/database";
import { cn } from "@/lib/utils";

type PsychologyTrackerProps = {
  tradeId: string;
  initialMistakes: import("@/lib/trade-psychology").TradeMistake[];
  initialSelfRating: number | null;
  initialEmotion?: import("@/types/database").EmotionalState | null;
};

export function PsychologyTracker({
  tradeId,
  initialMistakes,
  initialSelfRating,
  initialEmotion = null,
}: PsychologyTrackerProps) {
  const [mistakes, setMistakes] = useState<TradeMistake[]>(initialMistakes);
  const [selfRating, setSelfRating] = useState<number | null>(
    initialSelfRating
  );
  const [emotion, setEmotion] = useState<EmotionalState | null>(initialEmotion);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const saveBarRef = useRef<HTMLDivElement>(null);

  const isDirty =
    JSON.stringify([...mistakes].sort()) !==
      JSON.stringify([...initialMistakes].sort()) ||
    selfRating !== initialSelfRating ||
    emotion !== initialEmotion;

  // Warn on unsaved changes when leaving the page
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (isDirty && !isPending) {
          handleSave();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDirty, isPending, mistakes, selfRating, emotion]);

  function toggleMistake(value: TradeMistake) {
    setMistakes((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
    setMessage(null);
    setError(null);
  }

  function handleSave() {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await updateTradePsychology(tradeId, {
        mistakes,
        self_rating: selfRating,
        emotional_state: emotion,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      setMessage("Psychology saved.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Sticky save bar */}
      {isDirty ? (
        <div
          ref={saveBarRef}
          className="sticky top-0 z-10 -mx-2 rounded-lg border border-emerald-500/20 bg-zinc-900/95 px-4 py-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-zinc-300">Unsaved changes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-zinc-500 sm:inline">
                Ctrl+S to save
              </span>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel className="text-zinc-300">Emotional state</FieldLabel>
          <EmotionPicker value={emotion} onChange={setEmotion} />
        </Field>

        <Field>
          <FieldLabel className="text-zinc-300">Mistakes</FieldLabel>
          <FieldDescription>
            Select any behaviors that applied to this trade.
          </FieldDescription>
          <div className="flex flex-wrap gap-2 pt-1">
            {TRADE_MISTAKES.map((mistake) => {
              const selected = mistakes.includes(mistake.value);

              return (
                <Badge
                  key={mistake.value}
                  render={<button type="button" />}
                  variant="outline"
                  className={cn(
                    "cursor-pointer px-3",
                    selected
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                      : "border-zinc-700 text-zinc-400"
                  )}
                  onClick={() => toggleMistake(mistake.value)}
                  aria-pressed={selected}
                >
                  {mistake.label}
                </Badge>
              );
            })}
          </div>
        </Field>

        <Field>
          <FieldLabel className="text-zinc-300">Self-rating</FieldLabel>
          <FieldDescription>
            How well did you follow your plan? 1 is poor, 10 is excellent.
          </FieldDescription>
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3">
              <span className="w-8 text-sm text-zinc-500">1</span>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={selfRating ?? 5}
                onChange={(event) => {
                  setSelfRating(Number(event.target.value));
                  setMessage(null);
                  setError(null);
                }}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-emerald-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-md"
                aria-label="Self-rating from 1 to 10"
              />
              <span className="w-8 text-right text-sm text-zinc-500">
                10
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 10 }, (_, index) => {
                  const starValue = index + 1;
                  const filled =
                    selfRating != null && starValue <= selfRating;

                  return (
                    <button
                      key={starValue}
                      type="button"
                      className="rounded p-0.5 transition-colors hover:bg-zinc-800"
                      onClick={() => {
                        setSelfRating(starValue);
                        setMessage(null);
                        setError(null);
                      }}
                      aria-label={`Rate ${starValue} out of 10`}
                    >
                      <Star
                        className={cn(
                          "size-4",
                          filled
                            ? "fill-emerald-400 text-emerald-400"
                            : "text-zinc-600"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold tabular-nums text-zinc-100">
                  {selfRating ?? "—"}
                  <span className="text-sm font-normal text-zinc-500">
                    /10
                  </span>
                </p>
              </div>
            </div>

            {selfRating != null ? (
              <button
                type="button"
                className="text-xs text-zinc-500 underline-offset-4 hover:underline"
                onClick={() => {
                  setSelfRating(null);
                  setMessage(null);
                  setError(null);
                }}
              >
                Clear rating
              </button>
            ) : null}
          </div>
        </Field>

        {error ? (
          <p className="text-sm text-rose-400" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="text-sm text-emerald-400" role="status">
            {message}
          </p>
        ) : null}

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending || !isDirty}
          >
            {isPending ? "Saving..." : "Save psychology"}
          </Button>
        </div>
      </FieldGroup>
    </div>
  );
}
