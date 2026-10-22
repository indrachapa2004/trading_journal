"use client";

import { useState, useTransition } from "react";
import { AlertCircle } from "lucide-react";

import {
  createTrade,
  updateTrade,
} from "@/app/(dashboard)/trades/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Trade } from "@/types/database";

const selectClassName =
  "flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-emerald-500/20";

type TradeFormProps = {
  trade?: Trade;
};

type FieldErrors = Record<string, string>;

function toLocalInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function validateField(name: string, value: string): string | null {
  switch (name) {
    case "symbol": {
      const trimmed = value.trim();
      if (!trimmed) return "Symbol is required";
      if (trimmed.length > 20) return "Symbol must be 20 characters or less";
      return null;
    }
    case "quantity": {
      const num = Number(value);
      if (!value || isNaN(num)) return "Quantity is required";
      if (num <= 0) return "Quantity must be positive";
      return null;
    }
    case "entry_price": {
      const num = Number(value);
      if (!value || isNaN(num)) return "Entry price is required";
      if (num <= 0) return "Entry price must be positive";
      return null;
    }
    case "exit_price": {
      if (!value) return null;
      const num = Number(value);
      if (isNaN(num) || num <= 0) return "Exit price must be positive";
      return null;
    }
    case "fees": {
      const num = Number(value);
      if (isNaN(num) || num < 0) return "Fees cannot be negative";
      return null;
    }
    case "stop_loss": {
      if (!value) return null;
      const num = Number(value);
      if (isNaN(num) || num <= 0) return "Stop loss must be positive";
      return null;
    }
    case "take_profit": {
      if (!value) return null;
      const num = Number(value);
      if (isNaN(num) || num <= 0) return "Take profit must be positive";
      return null;
    }
    default:
      return null;
  }
}

const VALIDATION_FIELDS = [
  "symbol",
  "quantity",
  "entry_price",
  "exit_price",
  "fees",
  "stop_loss",
  "take_profit",
];

function ErrorLabel({ message }: { message: string | undefined }) {
  if (!message) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-rose-400">
      <AlertCircle className="h-3 w-3" />
      {message}
    </span>
  );
}

export function TradeForm({ trade }: TradeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(trade);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (!VALIDATION_FIELDS.includes(name)) return;
    const errorMsg = validateField(name, value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (errorMsg) {
        next[name] = errorMsg;
      } else {
        delete next[name];
      }
      return next;
    });
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (!VALIDATION_FIELDS.includes(name)) return;
    const errorMsg = validateField(name, value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (errorMsg) {
        next[name] = errorMsg;
      } else {
        delete next[name];
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Validate all fields before submit
    const newErrors: FieldErrors = {};
    for (const fieldName of VALIDATION_FIELDS) {
      const value = formData.get(fieldName)?.toString() ?? "";
      const errorMsg = validateField(fieldName, value);
      if (errorMsg) {
        newErrors[fieldName] = errorMsg;
      }
    }
    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    startTransition(async () => {
      const result = trade
        ? await updateTrade(trade.id, formData)
        : await createTrade(formData);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  function inputError(name: string): string | undefined {
    return fieldErrors[name];
  }

  function inputClass(name: string, extra = ""): string {
    return cn(
      "border-zinc-700 bg-zinc-950 font-mono",
      inputError(name) && "border-rose-500/50 ring-1 ring-rose-500/20",
      extra
    );
  }

  function renderField(label: string, name: string, input: React.ReactNode) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={name} className="text-zinc-300">{label}</Label>
          <ErrorLabel message={inputError(name)} />
        </div>
        {input}
      </div>
    );
  }

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-zinc-100">
          {isEditing ? "Edit trade" : "Add trade"}
        </CardTitle>
        <CardDescription className="text-zinc-500">
          {isEditing
            ? "Update trade details and notes."
            : "Log the basics now — you can add screenshots on the detail page."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {renderField("Symbol", "symbol",
              <Input
                id="symbol"
                name="symbol"
                placeholder="AAPL"
                defaultValue={trade?.symbol}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass("symbol")}
              />
            )}
            <div className="space-y-2">
              <Label htmlFor="asset_class" className="text-zinc-300">Asset class</Label>
              <select
                id="asset_class"
                name="asset_class"
                className={selectClassName}
                defaultValue={trade?.asset_class ?? "stocks"}
                onChange={handleChange}
              >
                <option value="stocks">Stocks</option>
                <option value="forex">Forex</option>
                <option value="crypto">Crypto</option>
                <option value="options">Options</option>
                <option value="futures">Futures</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="direction" className="text-zinc-300">Direction</Label>
              <select
                id="direction"
                name="direction"
                className={selectClassName}
                defaultValue={trade?.direction ?? "long"}
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>
            {renderField("Quantity", "quantity",
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.quantity}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass("quantity")}
              />
            )}
            {renderField("Entry price", "entry_price",
              <Input
                id="entry_price"
                name="entry_price"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.entry_price}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass("entry_price")}
              />
            )}
            {renderField("Exit price", "exit_price",
              <Input
                id="exit_price"
                name="exit_price"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.exit_price ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass("exit_price")}
              />
            )}
            <div className="space-y-2">
              <Label htmlFor="entry_at" className="text-zinc-300">Entry time</Label>
              <Input
                id="entry_at"
                name="entry_at"
                type="datetime-local"
                defaultValue={toLocalInputValue(trade?.entry_at)}
                required
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exit_at" className="text-zinc-300">Exit time</Label>
              <Input
                id="exit_at"
                name="exit_at"
                type="datetime-local"
                defaultValue={toLocalInputValue(trade?.exit_at)}
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
            {renderField("Stop loss", "stop_loss",
              <Input
                id="stop_loss"
                name="stop_loss"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.stop_loss ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass("stop_loss")}
              />
            )}
            {renderField("Take profit", "take_profit",
              <Input
                id="take_profit"
                name="take_profit"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.take_profit ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass("take_profit")}
              />
            )}
            {renderField("Fees / commission", "fees",
              <Input
                id="fees"
                name="fees"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.fees ?? 0}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass("fees")}
              />
            )}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tags" className="text-zinc-300">Tags</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="breakout, scalp, swing"
                defaultValue={trade?.tags.join(", ") ?? ""}
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/40 p-6">
            <div className="space-y-2">
              <Label htmlFor="emotional_state" className="text-zinc-300">Emotional state</Label>
              <select
                id="emotional_state"
                name="emotional_state"
                className={selectClassName}
                defaultValue={trade?.emotional_state ?? ""}
              >
                <option value="">Not set</option>
                <option value="calm">Calm</option>
                <option value="confident">Confident</option>
                <option value="anxious">Anxious</option>
                <option value="fomo">FOMO</option>
                <option value="revenge">Revenge trading</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pre_trade_notes" className="text-zinc-300">Pre-trade notes</Label>
              <Textarea
                id="pre_trade_notes"
                name="pre_trade_notes"
                rows={4}
                defaultValue={trade?.pre_trade_notes ?? ""}
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post_trade_notes" className="text-zinc-300">Post-trade notes</Label>
              <Textarea
                id="post_trade_notes"
                name="post_trade_notes"
                rows={4}
                defaultValue={trade?.post_trade_notes ?? ""}
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <CardFooter className="p-0 pt-6">
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending
                ? "Saving…"
                : isEditing
                  ? "Save changes"
                  : "Create trade"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}