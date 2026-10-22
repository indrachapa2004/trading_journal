import { Logo } from "@/components/ui/Logo";

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
    <div className="grid min-h-dvh bg-[#101510] text-zinc-100 lg:grid-cols-2">
      <aside className="relative hidden min-h-dvh overflow-hidden border-r border-white/10 bg-[#121813] lg:flex lg:flex-col">
        <div className="relative z-10 p-10">
          <Logo />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-8 pb-12 xl:px-12">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
            Your process, in focus
          </p>
          <h1 className="mt-5 max-w-lg text-balance text-4xl font-medium leading-tight tracking-[-0.04em] text-zinc-50 xl:text-5xl">
            A clearer read on every trade.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-zinc-300">
            Keep your decisions, risk, and results in one place. Build a
            journal you can learn from.
          </p>

          <div className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-[#171d18] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-200">
                Performance snapshot
              </p>
              <span className="border border-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                Sample data
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {sampleStats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 px-3 py-3 first:pl-0"
                >
                  <p className="truncate font-mono text-lg font-medium tabular-nums text-zinc-100">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-zinc-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-xs">
                <p className="font-medium text-zinc-300">Equity curve</p>
                <p className="text-zinc-400">Illustrative account</p>
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
                    <stop offset="0%" stopColor="#83b995" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#83b995" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 78 C34 74 45 58 78 62 S122 48 150 50 S194 33 224 40 S276 25 302 29 S360 13 420 8 L420 96 L0 96 Z"
                  fill="url(#auth-equity-fill)"
                />
                <path
                  d="M0 78 C34 74 45 58 78 62 S122 48 150 50 S194 33 224 40 S276 25 302 29 S360 13 420 8"
                  fill="none"
                  stroke="#83b995"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <p className="mt-5 text-xs text-zinc-400">
            Illustrative data only — your journal starts with your trades.
          </p>
        </div>

        <p className="relative z-10 p-10 text-xs text-zinc-400">
          A trading journal for a more deliberate process.
        </p>
      </aside>

      <main id="main-content" className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <div className="relative z-10 mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
