import {
  Brain,
  Calculator,
  Camera,
  LineChart,
  Lock,
  ShieldAlert,
  Shield,
  Tag,
  Upload,
} from "lucide-react";

import { cn } from "@/lib/utils";

const features = [
  {
    id: "analytics",
    icon: LineChart,
    title: "Numbers don't lie.",
    description:
      "Equity curves, win/loss distributions, and breakdowns by symbol, tag, and time of day.",
  },
  {
    id: "tilt",
    icon: Brain,
    title: "Find your tilt.",
    description:
      "Log FOMO, revenge trades, and discipline. Spot emotional patterns hurting your edge.",
  },
  {
    id: "vault",
    icon: Camera,
    title: "Screenshot vault",
    description:
      "Before/after chart setups stored securely — tied to every trade.",
  },
  {
    id: "risk",
    icon: Calculator,
    title: "Risk management",
    description:
      "Position size calculator, daily loss limits, and pre-trade rule checklists.",
  },
  {
    id: "import",
    icon: Upload,
    title: "Bulk CSV import",
    description:
      "Map broker exports to your journal schema in seconds.",
  },
  {
    id: "security",
    icon: Shield,
    title: "Bank-grade security",
    description:
      "Row-level security on every table. Your trades are encrypted and isolated per account.",
  },
];

function BentoArt({ id }: { id: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        WebkitMaskImage:
          "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.95) 75%)",
        maskImage:
          "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.95) 75%)",
      }}
      aria-hidden
    >
      {id === "analytics" && (
        <>
          {/* Deep emerald bloom behind the chart */}
          <div className="absolute -bottom-16 left-0 right-0 h-56 rounded-[3rem] bg-green-500/10 blur-3xl" />
          <div className="absolute -bottom-8 left-1/4 right-1/4 h-32 bg-green-400/10 blur-2xl" />

          {/* Mini stat pills — upper-right */}
          <div className="absolute right-5 top-14 flex flex-col gap-1.5 opacity-30">
            {[
              { label: "Win rate", val: "62%" },
              { label: "Avg RR", val: "2.1" },
              { label: "P-factor", val: "1.94" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between gap-4 rounded-lg border border-white/8 bg-zinc-800/60 px-2.5 py-1 text-[9px] backdrop-blur-sm"
              >
                <span className="text-zinc-500">{s.label}</span>
                <span className="font-mono font-semibold text-green-400">{s.val}</span>
              </div>
            ))}
          </div>

          {/* Large equity-curve SVG filling the lower ¾ */}
          <svg
            viewBox="0 0 320 160"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 right-0 h-[62%] w-full opacity-30"
            aria-hidden
          >
            <defs>
              <linearGradient id="art-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d="M0 130 C30 125, 50 90, 80 80 C110 70, 130 40, 160 30 C195 20, 220 50, 260 35 C290 24, 310 18, 320 12 L320 160 L0 160 Z"
              fill="url(#art-grad)"
            />
            {/* Stroke line */}
            <path
              d="M0 130 C30 125, 50 90, 80 80 C110 70, 130 40, 160 30 C195 20, 220 50, 260 35 C290 24, 310 18, 320 12"
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
            />
            {/* Subtle bar shadows at the bottom */}
            {[20, 58, 96, 134, 172, 210, 250, 288].map((x, i) => (
              <rect
                key={x}
                x={x}
                y={100 + (i % 3) * 12}
                width="14"
                height={60 - (i % 3) * 12}
                rx="2"
                fill="#22c55e"
                opacity="0.12"
              />
            ))}
            {/* X-axis tick labels */}
            {["Jan", "Mar", "May", "Jul", "Sep"].map((m, i) => (
              <text
                key={m}
                x={10 + i * 74}
                y="158"
                fontSize="9"
                fill="#52525b"
                fontFamily="monospace"
              >
                {m}
              </text>
            ))}
          </svg>

          {/* border-t glow line above the chart area */}
          <div className="absolute bottom-[62%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        </>
      )}

      {id === "tilt" && (
        <>
          <div className="absolute right-6 top-8 rounded-full border-t border-white/10 bg-zinc-200/15 px-3 py-1 text-[10px] text-zinc-300/80 blur-[1px] [transform:rotate(-12deg)]">
            <Tag className="mr-1 inline size-2.5" />
            FOMO
          </div>
          <div className="absolute right-16 top-20 rounded-full border-t border-white/10 bg-zinc-200/10 px-3 py-1 text-[10px] text-zinc-300/70 [transform:rotate(8deg)] blur-[1px]">
            <Tag className="mr-1 inline size-2.5" />
            Greed
          </div>
          <div className="absolute right-8 top-32 rounded-full border-t border-white/10 bg-zinc-200/15 px-3 py-1 text-[10px] text-zinc-300/80 [transform:rotate(-4deg)] blur-[1px]">
            <Tag className="mr-1 inline size-2.5" />
            Discipline
          </div>
          <div className="absolute inset-x-8 bottom-4 h-20 rounded-full bg-zinc-100/10 blur-3xl" />
        </>
      )}

      {id === "vault" && (
        <>
          <div className="absolute right-10 top-10 h-24 w-36 rounded-xl border border-zinc-600/30 border-t border-white/10 bg-zinc-200/10 blur-[1px] [transform:rotate(-8deg)]" />
          <div className="absolute right-16 top-16 h-24 w-36 rounded-xl border border-zinc-600/30 border-t border-white/10 bg-zinc-200/10 blur-[1px] [transform:rotate(2deg)]" />
          <div className="absolute right-6 top-[5.5rem] h-24 w-36 rounded-xl border border-zinc-600/30 border-t border-white/10 bg-zinc-200/15 blur-[1px] [transform:rotate(9deg)]" />
          <div className="absolute -bottom-8 right-0 h-28 w-40 rounded-full bg-zinc-100/10 blur-3xl" />
        </>
      )}

      {id === "risk" && (
        <>
          <div className="absolute inset-x-5 top-9 h-24 rounded-xl border border-zinc-700/25 border-t border-white/10 bg-zinc-200/10 blur-[0.5px]" />
          <div className="absolute inset-x-6 top-12 grid grid-cols-6 gap-1.5 opacity-20">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-2 rounded-sm bg-zinc-200/60" />
            ))}
          </div>
          <div className="absolute left-8 top-24 h-2 w-32 rounded-full border-t border-white/10 bg-zinc-100/20 blur-[0.5px]" />
          <div className="absolute left-[8.5rem] top-[5.5rem] size-5 rounded-full border border-zinc-400/30 border-t border-white/10 bg-zinc-200/20 blur-[0.5px]" />
          <div className="absolute -bottom-10 left-2 h-24 w-40 rounded-full bg-zinc-100/10 blur-3xl" />
        </>
      )}

      {id === "import" && (
        <>
          <div className="absolute left-3 top-10 space-y-1.5 opacity-25">
            {["01| pnl,+420", "02| tag,FOMO", "03| risk,1.5R", "04| win,yes"].map(
              (line) => (
                <div
                  key={line}
                  className="rounded-md border-t border-white/10 bg-zinc-100/10 px-2 py-0.5 font-mono text-[9px] text-zinc-300/70 blur-[0.5px]"
                >
                  {line}
                </div>
              )
            )}
          </div>
          <Upload className="absolute right-8 top-14 size-14 text-zinc-300/20 blur-[1px]" />
          <div className="absolute left-24 top-20 h-px w-20 border-t border-dashed border-white/20 opacity-40" />
          <div className="absolute left-24 top-24 h-px w-16 border-t border-dashed border-white/15 opacity-35" />
          <div className="absolute -bottom-8 right-2 h-24 w-32 rounded-full bg-zinc-100/10 blur-3xl" />
        </>
      )}

      {id === "security" && (
        <>
          <ShieldAlert className="absolute -right-8 top-2 size-44 text-zinc-200/15 blur-[2px]" />
          <Lock className="absolute right-20 top-14 size-20 text-zinc-100/15 blur-[1.5px]" />
          <div className="absolute -right-8 bottom-0 h-28 w-56 rounded-full border-t border-white/10 bg-zinc-100/10 blur-3xl" />
        </>
      )}
    </div>
  );
}

function BentoCard({
  id,
  icon: Icon,
  title,
  description,
  index,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <article
      className={cn(
        "group relative rounded-xl border border-slate-700/50 bg-[#0e1223]/75 backdrop-blur-sm transition-colors duration-200",
        "hover:border-slate-600/70 hover:bg-[#11182b]/90",
        "flex min-h-52 flex-col justify-between p-6 sm:p-7",
        "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700",
        index === 0 && "delay-75",
        index === 1 && "delay-100",
        index === 2 && "delay-150",
        index === 3 && "delay-200",
        index === 4 && "delay-250",
        index === 5 && "delay-300"
      )}
    >
      <BentoArt id={id} />
      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <h3 className="flex items-center gap-2 text-[15px] font-medium tracking-tight text-slate-200">
          <Icon className="size-3.5 shrink-0 text-slate-500 transition-colors group-hover:text-slate-400" />
          {title}
        </h3>
        <p className="mt-5 max-w-md text-sm leading-[1.75] text-slate-400">
          {description}
        </p>
      </div>
    </article>
  );
}

export function FeatureBento() {
  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4">
        <header className="mb-16 text-center sm:mb-20">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-400">
            Features
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Everything pro traders need
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
            From first fill to monthly review — one workspace for data,
            psychology, and risk.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {features.map((feature, index) => (
            <BentoCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
