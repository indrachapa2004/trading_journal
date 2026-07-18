"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  DollarSign,
  Percent,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { completeOnboarding, skipOnboarding } from "@/app/onboarding/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type Experience = "beginner" | "intermediate" | "pro";
type AssetClass = "Forex" | "Crypto" | "Stocks" | "Futures" | "Options";

interface FormState {
  trading_experience: Experience | "";
  starting_balance: string;
  risk_per_trade_percent: string;
  asset_classes: AssetClass[];
  monthly_profit_goal: string;
}

const EXPERIENCE_OPTIONS: {
  value: Experience;
  label: string;
  description: string;
}[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Less than 1 year of live trading",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "1–3 years, consistently applying a strategy",
  },
  {
    value: "pro",
    label: "Pro",
    description: "3+ years, trading full-time or near full-time",
  },
];

const ASSET_CLASSES: AssetClass[] = [
  "Forex",
  "Crypto",
  "Stocks",
  "Futures",
  "Options",
];

// ─── Step slide variants ───────────────────────────────────────────────────────

const stepVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
  }),
};

const stepTransition = { duration: 0.28, ease: [0.32, 0.72, 0, 1] as const };

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-1">
      {children}
    </p>
  );
}

function StepHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
      {children}
    </h2>
  );
}

function StepSubtext({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 mb-7 text-sm text-zinc-500">{children}</p>;
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (patch: Partial<FormState>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <StepLabel>Step 1 of 3</StepLabel>
        <StepHeading>Tell us about yourself.</StepHeading>
        <StepSubtext>
          Help us tailor analytics and defaults to your level.
        </StepSubtext>
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Trading experience</Label>
        <div className="space-y-2">
          {EXPERIENCE_OPTIONS.map((opt) => {
            const selected = form.trading_experience === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ trading_experience: opt.value })}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left transition-all duration-150",
                  selected
                    ? "border-emerald-500/50 bg-emerald-500/8 ring-1 ring-emerald-500/30"
                    : "border-zinc-700/60 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50"
                )}
              >
                <p
                  className={cn(
                    "text-sm font-medium",
                    selected ? "text-emerald-400" : "text-zinc-200"
                  )}
                >
                  {opt.label}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Step2({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (patch: Partial<FormState>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <StepLabel>Step 2 of 3</StepLabel>
        <StepHeading>Set up your portfolio.</StepHeading>
        <StepSubtext>
          These numbers power the position calculator and P&amp;L math.
        </StepSubtext>
      </div>

      {/* Starting balance */}
      <div className="space-y-1.5">
        <Label htmlFor="starting_balance" className="text-xs text-zinc-400">
          Starting balance
        </Label>
        <div className="relative">
          <DollarSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
          <Input
            id="starting_balance"
            type="number"
            min={0}
            step="100"
            placeholder="10000"
            value={form.starting_balance}
            onChange={(e) => onChange({ starting_balance: e.target.value })}
            className="pl-9 bg-zinc-800/50 border-zinc-700/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Risk per trade */}
      <div className="space-y-1.5">
        <Label htmlFor="risk_pct" className="text-xs text-zinc-400">
          Default risk per trade
        </Label>
        <div className="relative">
          <Percent className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
          <Input
            id="risk_pct"
            type="number"
            min={0.1}
            max={100}
            step={0.1}
            placeholder="1"
            value={form.risk_per_trade_percent}
            onChange={(e) =>
              onChange({ risk_per_trade_percent: e.target.value })
            }
            className="pl-9 bg-zinc-800/50 border-zinc-700/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
          />
        </div>
        <p className="text-[11px] text-zinc-600">
          Recommended: 1–2% to protect capital on losing streaks.
        </p>
      </div>
    </div>
  );
}

function Step3({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (patch: Partial<FormState>) => void;
}) {
  function toggleAsset(asset: AssetClass) {
    const has = form.asset_classes.includes(asset);
    onChange({
      asset_classes: has
        ? form.asset_classes.filter((a) => a !== asset)
        : [...form.asset_classes, asset],
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <StepLabel>Step 3 of 3</StepLabel>
        <StepHeading>What do you trade?</StepHeading>
        <StepSubtext>
          Select all that apply — this sets your journal&apos;s defaults.
        </StepSubtext>
      </div>

      {/* Asset class multi-select */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Markets</Label>
        <div className="flex flex-wrap gap-2">
          {ASSET_CLASSES.map((asset) => {
            const selected = form.asset_classes.includes(asset);
            return (
              <button
                key={asset}
                type="button"
                onClick={() => toggleAsset(asset)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150",
                  selected
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25"
                    : "border-zinc-700/60 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                )}
              >
                {asset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Monthly profit goal */}
      <div className="space-y-1.5">
        <Label htmlFor="monthly_goal" className="text-xs text-zinc-400">
          Monthly profit goal <span className="text-zinc-600">(% of balance)</span>
        </Label>
        <div className="relative">
          <Percent className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
          <Input
            id="monthly_goal"
            type="number"
            min={0}
            max={1000}
            step={0.5}
            placeholder="5"
            value={form.monthly_profit_goal}
            onChange={(e) => onChange({ monthly_profit_goal: e.target.value })}
            className="pl-9 bg-zinc-800/50 border-zinc-700/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
          />
        </div>
        <p className="text-[11px] text-zinc-600">
          Optional. We&apos;ll track your progress on the dashboard.
        </p>
      </div>
    </div>
  );
}

// ─── Main flow ─────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

function canAdvance(step: number, form: FormState): boolean {
  if (step === 1) return form.trading_experience !== "";
  if (step === 2) return Number(form.starting_balance) >= 0 && Number(form.risk_per_trade_percent) > 0;
  if (step === 3) return form.asset_classes.length > 0;
  return true;
}

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    trading_experience: "",
    starting_balance: "",
    risk_per_trade_percent: "1",
    asset_classes: [],
    monthly_profit_goal: "",
  });

  function patch(partial: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function goNext() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleFinish() {
    setSaving(true);
    setError(null);
    const result = await completeOnboarding({
      trading_experience: form.trading_experience as "beginner" | "intermediate" | "pro",
      starting_balance: Number(form.starting_balance) || 0,
      risk_per_trade_percent: Number(form.risk_per_trade_percent) || 1,
      primary_asset_class: form.asset_classes[0]?.toLowerCase() ?? "stocks",
      monthly_profit_goal: form.monthly_profit_goal
        ? Number(form.monthly_profit_goal)
        : undefined,
    });
    // If we reach here, completeOnboarding threw (redirect throws in Next.js)
    if (result?.error) {
      setError(result.error);
      setSaving(false);
    }
  }

  async function handleSkip() {
    await skipOnboarding();
  }

  const ready = canAdvance(step, form);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-12">
      {/* Faint emerald glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 48%, rgba(16,185,129,0.06) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Logo />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl [border-top:1px_solid_rgba(255,255,255,0.08)]">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-zinc-600">
                {step} / {TOTAL_STEPS}
              </span>
              <span className="text-[11px] text-zinc-600">
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              />
            </div>
          </div>

          {/* Step content with slide animation */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
              >
                {step === 1 && <Step1 form={form} onChange={patch} />}
                {step === 2 && <Step2 form={form} onChange={patch} />}
                {step === 3 && <Step3 form={form} onChange={patch} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center gap-3">
            {step > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="gap-1.5 text-zinc-500 hover:text-zinc-200"
                disabled={saving}
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
            )}

            <div className="flex-1" />

            {step < TOTAL_STEPS ? (
              <Button
                onClick={goNext}
                disabled={!ready}
                className="gap-2 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-semibold disabled:opacity-40"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={!ready || saving}
                className="gap-2 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-semibold disabled:opacity-40"
              >
                {saving ? "Saving…" : "Finish setup"}
                {!saving && <ArrowRight className="size-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Skip */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Skip for now — I&apos;ll set this up later
          </button>
        </div>
      </div>
    </div>
  );
}
