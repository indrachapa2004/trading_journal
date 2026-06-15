"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import type { TradingRule } from "@/types/database";

export function RuleChecklist({
  rules,
  value,
  onChange,
  required = true,
}: {
  rules: TradingRule[];
  value: string[];
  onChange: (ids: string[]) => void;
  required?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  const allChecked = rules.length > 0 && rules.every((r) => value.includes(r.id));
  const showError = required && touched && !allChecked;

  function toggle(id: string) {
    setTouched(true);
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  }

  if (rules.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No trading rules configured. Add rules in Settings.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {rules.map((rule) => {
        const checked = value.includes(rule.id);
        return (
          <label
            key={rule.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
              checked
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-600"
            )}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(rule.id)}
              className="mt-0.5 size-4 rounded border-zinc-600 accent-emerald-500"
            />
            <span className="text-sm text-zinc-300">{rule.label}</span>
          </label>
        );
      })}
      {showError ? (
        <p className="text-sm text-rose-400">
          Acknowledge all rules before logging this trade.
        </p>
      ) : null}
    </div>
  );
}

export function useRulesValid(rules: TradingRule[], acknowledged: string[]) {
  return rules.length === 0 || rules.every((r) => acknowledged.includes(r.id));
}
