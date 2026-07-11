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
} from "@/lib/trades";
import { cn } from "@/lib/utils";
import type { EmotionalState, TradingRule } from "@/types/database";

const addTradeFormSchema = z.object({
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
}: {
  direction: "long" | "short";
  entryPrice: string | number | undefined;
  stopLoss: string | number | undefined;
  takeProfit: string | number | undefined;
}) {
  const riskReward = useMemo(() => {
    const entry = Number(entryPrice);
    const stop = stopLoss === "" ? null : Number(stopLoss);
    const target = takeProfit === "" ? null : Number(takeProfit);
    return calculateRiskReward(direction, entry, stop, target);
  }, [direction, entryPrice, stopLoss, takeProfit]);

  const label = formatRiskReward(riskReward);
  const isValid = riskReward != null && riskReward > 0;

  return (
    <Badge
      variant={isValid ? "default" : "outline"}
      className={cn(
        "font-mono tabular-nums",
        isValid && riskReward >= 2 && "bg-emerald-600 text-white",
        isValid && riskReward < 1 && "bg-rose-500/20 text-rose-400"
      )}
    >
      R:R {label}
    </Badge>
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
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
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

            <div className="space-y-4 rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-6">
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
