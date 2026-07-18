"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  Controller,
  type FieldError as HookFormFieldError,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";

import { createTrade } from "@/app/(dashboard)/trades/actions";
import { EmotionPicker } from "@/components/trades/emotion-picker";
import { MarkdownNotes } from "@/components/trades/markdown-notes";
import { RuleChecklist, useRulesValid } from "@/components/trades/rule-checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRADE_MISTAKES } from "@/lib/trade-psychology";
import { ASSET_CLASSES } from "@/lib/trade-emotions";
import { TRADE_STRATEGIES } from "@/lib/trade-strategies";
import {
  calculateRiskReward,
  formatRiskReward,
  formatSignedCurrency,
} from "@/lib/trades";
import { cn } from "@/lib/utils";
import type { EmotionalState, TradingRule } from "@/types/database";

const addTradeFormSchema = z
  .object({
    symbol: z
      .string({ error: "Symbol is required" })
      .min(1, "Symbol is required")
      .max(20, "Symbol must be 20 characters or fewer"),
    direction: z.enum(["long", "short"]),
    asset_class: z.enum(["stocks", "forex", "crypto", "options", "futures"]),
    quantity: z
      .string({ error: "Quantity is required" })
      .min(1, "Quantity is required")
      .refine((v) => Number.isFinite(Number(v)), "Quantity must be a valid number")
      .refine((v) => Number(v) > 0, "Quantity must be positive"),
    entry_price: z
      .string({ error: "Entry price is required" })
      .min(1, "Entry price is required")
      .refine((v) => Number.isFinite(Number(v)), "Entry price must be a valid number")
      .refine((v) => Number(v) > 0, "Entry price must be positive"),
    exit_price: z
      .string()
      .refine(
        (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) > 0),
        "Exit price must be a positive number"
      ),
    exit_at: z.string().optional(),
    status: z.enum(["open", "closed"]),
    fees: z
      .string()
      .refine(
        (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) >= 0),
        "Fees must be zero or positive"
      ),
    stop_loss: z
      .string()
      .refine(
        (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) > 0),
        "Stop loss must be a positive number"
      ),
    take_profit: z
      .string()
      .refine(
        (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) > 0),
        "Take profit must be a positive number"
      ),
    strategy: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "closed") {
      if (!data.exit_price || data.exit_price === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Exit price is required when status is Closed",
          path: ["exit_price"],
        });
      }
      if (!data.exit_at || data.exit_at === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Exit time is required when status is Closed",
          path: ["exit_at"],
        });
      }
    }
  });

type AddTradeFormValues = z.infer<typeof addTradeFormSchema>;

function FormTextInput({
  id,
  type = "text",
  placeholder,
  step,
  min,
  value,
  name,
  onBlur,
  onChange,
  error,
}: {
  id: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  step?: string;
  min?: string;
  value: string;
  name: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  error?: HookFormFieldError;
}) {
  return (
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      step={step}
      min={min}
      name={name}
      value={value}
      onBlur={onBlur}
      onValueChange={onChange}
      aria-invalid={!!error}
      className="border-zinc-700 bg-zinc-950 font-mono"
    />
  );
}

function RiskRewardBadge({
  direction,
  entryPrice,
  stopLoss,
  takeProfit,
  exitPrice,
  quantity,
  fees,
}: {
  direction: "long" | "short";
  entryPrice: string | number | undefined;
  stopLoss: string | number | undefined;
  takeProfit: string | number | undefined;
  exitPrice: string | number | undefined;
  quantity: string | number | undefined;
  fees: string | number | undefined;
}) {
  const riskReward = useMemo(() => {
    const entry = Number(entryPrice);
    const stop = stopLoss === "" ? null : Number(stopLoss);
    const target = takeProfit === "" ? null : Number(takeProfit);
    return calculateRiskReward(direction, entry, stop, target);
  }, [direction, entryPrice, stopLoss, takeProfit]);

  const realizedPnl = useMemo(() => {
    const entry = Number(entryPrice);
    const exit = exitPrice === "" ? null : Number(exitPrice);
    const qty = Number(quantity);
    const fee = Number(fees) || 0;

    if (exit == null || !Number.isFinite(exit) || entry == null || !Number.isFinite(entry) || !Number.isFinite(qty) || qty <= 0) {
      return null;
    }

    const gross =
      direction === "long"
        ? (exit - entry) * qty
        : (entry - exit) * qty;

    return gross - fee;
  }, [direction, entryPrice, exitPrice, quantity, fees]);

  const realizedRR = useMemo(() => {
    const entry = Number(entryPrice);
    const exit = exitPrice === "" ? null : Number(exitPrice);
    const stop = stopLoss === "" ? null : Number(stopLoss);

    if (
      exit == null ||
      stop == null ||
      !Number.isFinite(exit) ||
      !Number.isFinite(entry) ||
      !Number.isFinite(stop)
    ) {
      return null;
    }

    if (direction === "long") {
      const risk = entry - stop;
      const reward = exit - entry;
      if (risk <= 0) return null;
      return reward / risk;
    }

    const risk = stop - entry;
    const reward = entry - exit;
    if (risk <= 0) return null;
    return reward / risk;
  }, [direction, entryPrice, exitPrice, stopLoss]);

  const plannedRR = riskReward;
  const showRealized = realizedPnl != null && realizedRR != null;
  const label = showRealized
    ? `R:R ${formatRiskReward(realizedRR)}`
    : `R:R ${formatRiskReward(plannedRR)}`;

  const displayRR = realizedRR ?? plannedRR;
  const isValid = displayRR != null && displayRR > 0;

  return (
    <div className="flex flex-col items-end gap-1">
      <Badge
        variant={isValid ? "default" : "outline"}
        className={cn(
          "font-mono tabular-nums",
          isValid && displayRR >= 2 && "bg-emerald-600 text-white",
          isValid && displayRR < 1 && "bg-rose-500/20 text-rose-400"
        )}
      >
        {label}
      </Badge>
      {showRealized && (
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            realizedPnl > 0 && "text-emerald-400",
            realizedPnl < 0 && "text-rose-400",
            realizedPnl === 0 && "text-zinc-500"
          )}
        >
          {formatSignedCurrency(realizedPnl)}
        </span>
      )}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full">
      <h3 className="text-sm font-medium text-zinc-400">{children}</h3>
      <div className="mt-1.5 border-t border-zinc-800/60" />
    </div>
  );
}

export function AddTradeForm({ rules }: { rules: TradingRule[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [screenshotBefore, setScreenshotBefore] = useState<File | null>(null);
  const [screenshotAfter, setScreenshotAfter] = useState<File | null>(null);
  const [emotion, setEmotion] = useState<EmotionalState | null>(null);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [rulesAcknowledged, setRulesAcknowledged] = useState<string[]>([]);
  const [preNotes, setPreNotes] = useState("");
  const [postNotes, setPostNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const rulesValid = useRulesValid(rules, rulesAcknowledged);

  const form = useForm<AddTradeFormValues>({
    resolver: standardSchemaResolver(addTradeFormSchema),
    defaultValues: {
      symbol: "",
      direction: "long",
      asset_class: "stocks",
      quantity: "",
      entry_price: "",
      exit_price: "",
      exit_at: "",
      status: "open",
      fees: "0",
      stop_loss: "",
      take_profit: "",
      strategy: "",
    },
  });

  const watchedDirection = useWatch({ control: form.control, name: "direction" });
  const watchedEntry = useWatch({ control: form.control, name: "entry_price" });
  const watchedStop = useWatch({ control: form.control, name: "stop_loss" });
  const watchedTarget = useWatch({ control: form.control, name: "take_profit" });
  const watchedExitPrice = useWatch({ control: form.control, name: "exit_price" });
  const watchedQuantity = useWatch({ control: form.control, name: "quantity" });
  const watchedFees = useWatch({ control: form.control, name: "fees" });
  const watchedStatus = useWatch({ control: form.control, name: "status" });

  const isClosed = watchedStatus === "closed";

  function toggleMistake(value: string) {
    setMistakes((current) =>
      current.includes(value)
        ? current.filter((m) => m !== value)
        : [...current, value]
    );
  }

  function onSubmit(values: AddTradeFormValues) {
    if (!rulesValid) {
      setError("Please acknowledge all trading rules before submitting.");
      return;
    }

    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("symbol", values.symbol);
      formData.append("direction", values.direction);
      formData.append("asset_class", values.asset_class);
      formData.append("quantity", values.quantity);
      formData.append("entry_price", values.entry_price);
      formData.append("exit_price", values.exit_price ?? "");
      formData.append("exit_at", values.exit_at ?? "");
      formData.append("status", values.status);
      formData.append("fees", values.fees || "0");
      formData.append("stop_loss", values.stop_loss ?? "");
      formData.append("take_profit", values.take_profit ?? "");
      formData.append("strategy", values.strategy ?? "");
      formData.append("emotional_state", emotion ?? "");
      formData.append("pre_trade_notes", preNotes);
      formData.append("post_trade_notes", postNotes);
      formData.append("rules_acknowledged", rulesAcknowledged.join(","));
      formData.append("mistakes", mistakes.join(","));

      if (screenshotBefore) formData.append("screenshot_before", screenshotBefore);
      if (screenshotAfter) formData.append("screenshot_after", screenshotAfter);

      const result = await createTrade(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.tradeId) {
        router.push(`/trades?open=${result.tradeId}`);
        router.refresh();
      }
    });
  }

  return (
    <Card
      size="default"
      className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5"
    >
      <CardHeader className="p-6 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-zinc-100">Log trade</CardTitle>
            <CardDescription className="text-zinc-500">
              Multi-asset entry with risk, psychology, and rule checklist.
            </CardDescription>
          </div>
          <RiskRewardBadge
            direction={watchedDirection ?? "long"}
            entryPrice={watchedEntry}
            stopLoss={watchedStop}
            takeProfit={watchedTarget}
            exitPrice={watchedExitPrice}
            quantity={watchedQuantity}
            fees={watchedFees}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Status toggle - full width */}
              <Field className="sm:col-span-2">
                <FieldLabel className="text-zinc-300">Status</FieldLabel>
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex rounded-lg border border-zinc-700 p-1">
                      <Button
                        type="button"
                        variant={field.value === "open" ? "default" : "ghost"}
                        className="flex-1"
                        onClick={() => field.onChange("open")}
                      >
                        Open
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "closed" ? "default" : "ghost"}
                        className="flex-1"
                        onClick={() => field.onChange("closed")}
                      >
                        Closed
                      </Button>
                    </div>
                  )}
                />
              </Field>

              {/* ===== ENTRY DETAILS ===== */}
              <SectionHeading>Entry Details</SectionHeading>

              <Field data-invalid={!!form.formState.errors.symbol}>
                <FieldLabel htmlFor="symbol" className="text-zinc-300">Symbol</FieldLabel>
                <Controller
                  name="symbol"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormTextInput
                      id="symbol"
                      placeholder="AAPL / EURUSD"
                      name={field.name}
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      error={fieldState.error}
                    />
                  )}
                />
                <FieldError errors={[form.formState.errors.symbol]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.asset_class}>
                <FieldLabel className="text-zinc-300">Asset class</FieldLabel>
                <Controller
                  name="asset_class"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v ?? "stocks")}
                    >
                      <SelectTrigger className="border-zinc-700 bg-zinc-950">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSET_CLASSES.map((ac) => (
                          <SelectItem key={ac.value} value={ac.value}>
                            {ac.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field data-invalid={!!form.formState.errors.direction}>
                <FieldLabel className="text-zinc-300">Side</FieldLabel>
                <Controller
                  name="direction"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex rounded-lg border border-zinc-700 p-1">
                      <Button
                        type="button"
                        variant={field.value === "long" ? "default" : "ghost"}
                        className="flex-1"
                        onClick={() => field.onChange("long")}
                      >
                        Long
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "short" ? "default" : "ghost"}
                        className="flex-1"
                        onClick={() => field.onChange("short")}
                      >
                        Short
                      </Button>
                    </div>
                  )}
                />
              </Field>

              <Field data-invalid={!!form.formState.errors.quantity}>
                <FieldLabel htmlFor="quantity" className="text-zinc-300">Quantity</FieldLabel>
                <Controller
                  name="quantity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormTextInput
                      id="quantity"
                      type="number"
                      step="any"
                      placeholder="100"
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      error={fieldState.error}
                    />
                  )}
                />
                <FieldError errors={[form.formState.errors.quantity]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.entry_price}>
                <FieldLabel htmlFor="entry_price" className="text-zinc-300">Entry price</FieldLabel>
                <Controller
                  name="entry_price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormTextInput
                      id="entry_price"
                      type="number"
                      step="any"
                      placeholder="0.00"
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      error={fieldState.error}
                    />
                  )}
                />
                <FieldError errors={[form.formState.errors.entry_price]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="entry_time_input" className="text-zinc-300">Entry time</FieldLabel>
                <Input
                  id="entry_time_input"
                  type="datetime-local"
                  className="border-zinc-700 bg-zinc-950 font-mono"
                />
              </Field>

              {/* ===== EXIT DETAILS ===== */}
              <SectionHeading>Exit Details</SectionHeading>

              {!isClosed && (
                <p className="col-span-full -mt-2 text-xs text-zinc-500">
                  Set status to "Closed" to enter exit details for already closed trades.
                </p>
              )}

              {isClosed && (
                <>
                  <Field data-invalid={!!form.formState.errors.exit_price}>
                    <FieldLabel htmlFor="exit_price" className="text-zinc-300">Exit price</FieldLabel>
                    <Controller
                      name="exit_price"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <FormTextInput
                          id="exit_price"
                          type="number"
                          step="any"
                          placeholder="0.00"
                          name={field.name}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                          error={fieldState.error}
                        />
                      )}
                    />
                    <FieldError errors={[form.formState.errors.exit_price]} />
                  </Field>

                  <Field data-invalid={!!form.formState.errors.exit_at}>
                    <FieldLabel htmlFor="exit_at" className="text-zinc-300">Exit time</FieldLabel>
                    <Controller
                      name="exit_at"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Input
                          id="exit_at"
                          type="datetime-local"
                          name={field.name}
                          value={field.value ?? ""}
                          onBlur={field.onBlur}
                          onChange={(e) => field.onChange(e.target.value)}
                          aria-invalid={!!fieldState.error}
                          className="border-zinc-700 bg-zinc-950 font-mono"
                        />
                      )}
                    />
                    <FieldError errors={[form.formState.errors.exit_at]} />
                  </Field>

                  <Field data-invalid={!!form.formState.errors.fees}>
                    <FieldLabel htmlFor="fees" className="text-zinc-300">Fees / commission</FieldLabel>
                    <Controller
                      name="fees"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <FormTextInput
                          id="fees"
                          type="number"
                          step="any"
                          placeholder="0.00"
                          name={field.name}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                          error={fieldState.error}
                        />
                      )}
                    />
                    <FieldError errors={[form.formState.errors.fees]} />
                  </Field>
                </>
              )}

              {/* Stop loss & Take profit — always visible */}
              <Field data-invalid={!!form.formState.errors.stop_loss}>
                <FieldLabel htmlFor="stop_loss" className="text-zinc-300">Stop loss</FieldLabel>
                <Controller
                  name="stop_loss"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormTextInput
                      id="stop_loss"
                      type="number"
                      step="any"
                      placeholder="0.00"
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      error={fieldState.error}
                    />
                  )}
                />
                <FieldError errors={[form.formState.errors.stop_loss]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.take_profit}>
                <FieldLabel htmlFor="take_profit" className="text-zinc-300">Take profit</FieldLabel>
                <Controller
                  name="take_profit"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormTextInput
                      id="take_profit"
                      type="number"
                      step="any"
                      placeholder="0.00"
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      error={fieldState.error}
                    />
                  )}
                />
                <FieldError errors={[form.formState.errors.take_profit]} />
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="strategy" className="text-zinc-300">Strategy tag</FieldLabel>
                <Controller
                  name="strategy"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? field.value : null}
                      onValueChange={(v) => field.onChange(v ?? "")}
                    >
                      <SelectTrigger id="strategy" className="w-full border-zinc-700 bg-zinc-950">
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRADE_STRATEGIES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            {!isClosed && (
              <div className="mt-4 rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-4">
                <p className="text-sm text-zinc-400">
                  This trade will be saved as <span className="font-semibold text-zinc-200">Open</span>.
                  You can add exit details later from the trade detail page.
                </p>
              </div>
            )}

            <div className="mt-6 space-y-4 rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-6">
              <Field className="space-y-2">
                <FieldLabel className="text-zinc-300">Emotional state</FieldLabel>
                <EmotionPicker value={emotion} onChange={setEmotion} />
              </Field>

              <Field className="space-y-2">
                <FieldLabel className="text-zinc-300">Mistakes (optional)</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {TRADE_MISTAKES.map((m) => (
                    <Badge
                      key={m.value}
                      render={<button type="button" />}
                      variant="outline"
                      className={cn(
                        "cursor-pointer px-3",
                        mistakes.includes(m.value)
                          ? "border-rose-500/50 bg-rose-500/10 text-rose-300"
                          : "border-zinc-700 text-zinc-400"
                      )}
                      onClick={() => toggleMistake(m.value)}
                    >
                      {m.label}
                    </Badge>
                  ))}
                </div>
              </Field>

              <Field className="space-y-2">
                <FieldLabel className="text-zinc-300">Rule checklist</FieldLabel>
                <RuleChecklist
                  rules={rules}
                  value={rulesAcknowledged}
                  onChange={setRulesAcknowledged}
                />
              </Field>
            </div>

            <MarkdownNotes
              label="Pre-trade notes"
              value={preNotes}
              onChange={setPreNotes}
              placeholder="## Setup\n- Key levels\n- **Thesis**"
            />
            <MarkdownNotes
              label="Post-trade notes"
              value={postNotes}
              onChange={setPostNotes}
              placeholder="What went well? What to improve?"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="text-zinc-300">Screenshot (before)</FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshotBefore(e.target.files?.[0] ?? null)}
                  className="border-zinc-700 bg-zinc-950"
                />
              </Field>
              <Field>
                <FieldLabel className="text-zinc-300">Screenshot (after)</FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshotAfter(e.target.files?.[0] ?? null)}
                  className="border-zinc-700 bg-zinc-950"
                />
              </Field>
            </div>

            {error ? (
              <p className="text-sm text-rose-400" role="alert">{error}</p>
            ) : null}

            <Button type="submit" disabled={isPending || !rulesValid} className="w-full sm:w-auto">
              {isPending ? "Saving..." : "Create trade"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}