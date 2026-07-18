"use client";

import { useState, useTransition } from "react";

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
import type { Trade } from "@/types/database";

const selectClassName =
  "flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-emerald-500/20";

type TradeFormProps = {
  trade?: Trade;
};

function toLocalInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function TradeForm({ trade }: TradeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(trade);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = trade
        ? await updateTrade(trade.id, formData)
        : await createTrade(formData);

      if (result?.error) {
        setError(result.error);
      }
    });
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
        <form action={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-zinc-300">Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                placeholder="AAPL"
                defaultValue={trade?.symbol}
                required
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset_class" className="text-zinc-300">Asset class</Label>
              <select
                id="asset_class"
                name="asset_class"
                className={selectClassName}
                defaultValue={trade?.asset_class ?? "stocks"}
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
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-zinc-300">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.quantity}
                required
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entry_price" className="text-zinc-300">Entry price</Label>
              <Input
                id="entry_price"
                name="entry_price"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.entry_price}
                required
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exit_price" className="text-zinc-300">Exit price</Label>
              <Input
                id="exit_price"
                name="exit_price"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.exit_price ?? ""}
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="stop_loss" className="text-zinc-300">Stop loss</Label>
              <Input
                id="stop_loss"
                name="stop_loss"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.stop_loss ?? ""}
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="take_profit" className="text-zinc-300">Take profit</Label>
              <Input
                id="take_profit"
                name="take_profit"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.take_profit ?? ""}
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fees" className="text-zinc-300">Fees / commission</Label>
              <Input
                id="fees"
                name="fees"
                type="number"
                step="any"
                min="0"
                defaultValue={trade?.fees ?? 0}
                className="border-zinc-700 bg-zinc-950 font-mono"
              />
            </div>
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
        </form>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Create trade"}
        </Button>
      </CardFooter>
    </Card>
  );
}
