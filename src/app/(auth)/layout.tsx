import { Inter } from "next/font/google";

import { Logo } from "@/components/ui/Logo";

const inter = Inter({ subsets: ["latin"] });

const sampleStats = [
  { label: "Profit factor", value: "2.41" },
  { label: "Win rate", value: "63%" },
  { label: "Trades logged", value: "148" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className} grid min-h-dvh bg-[#020617] text-slate-50 lg:grid-cols-2`}
    >
      <aside className="relative hidden min-h-dvh overflow-hidden border-r border-slate-800/80 bg-[#050a16] lg:flex lg:flex-col">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="hero-grid absolute inset-0 opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_54%_48%,rgba(34,197,94,0.08),transparent_58%)]" />
        </div>

        <div className="relative z-10 p-10">
          <Logo />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-8 pb-12 xl:px-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-400">
            Your process, in focus
          </p>
          <h1 className="mt-5 max-w-lg text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-50 xl:text-5xl">
            A clearer read on every trade.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Keep your decisions, risk, and results in one place. Build a
            journal you can learn from.
          </p>

          <div className="mt-10 overflow-hidden rounded-xl border border-slate-700/60 bg-[#0e1223]/90 p-5 ring-1 ring-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-200">
                Performance snapshot
              </p>
              <span className="rounded-full border border-green-500/25 bg-green-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-green-300">
                Sample data
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {sampleStats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 rounded-lg border border-slate-700/50 bg-slate-950/70 px-3 py-3"
                >
                  <p className="truncate font-mono text-lg font-semibold tabular-nums text-slate-100">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between text-xs">
                <p className="font-medium text-slate-300">Equity curve</p>
                <p className="text-slate-400">Illustrative account</p>
              </div>
              <svg
                viewBox="0 0 420 96"
                preserveAspectRatio="none"
                className="mt-3 h-24 w-full"
                role="img"
                aria-label="Illustrative upward-trending equity curve"
              >
                <defs>
                  <linearGradient
                    id="auth-equity-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 78 C34 74 45 58 78 62 S122 48 150 50 S194 33 224 40 S276 25 302 29 S360 13 420 8 L420 96 L0 96 Z"
                  fill="url(#auth-equity-fill)"
                />
                <path
                  d="M0 78 C34 74 45 58 78 62 S122 48 150 50 S194 33 224 40 S276 25 302 29 S360 13 420 8"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <p className="mt-5 text-xs text-slate-400">
            Illustrative data only — your journal starts with your trades.
          </p>
        </div>

        <p className="relative z-10 p-10 text-xs text-slate-400">
          A trading journal for a more deliberate process.
        </p>
      </aside>

      <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(34,197,94,0.055),transparent_58%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
