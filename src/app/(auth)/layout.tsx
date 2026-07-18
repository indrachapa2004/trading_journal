import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* ── Visual panel (hidden on mobile) ── */}
      <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col overflow-hidden">
        {/* Technical grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(39 39 42 / 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgb(39 39 42 / 0.45) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.4) 55%, transparent 80%)",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.4) 55%, transparent 80%)",
          }}
          aria-hidden
        />
        {/* Emerald spotlight */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.09) 0%, rgba(16,185,129,0.03) 45%, transparent 72%)",
          }}
          aria-hidden
        />

        {/* Logo top-left */}
        <div className="relative z-10 p-10">
          <Logo />
        </div>

        {/* UI Fragment — Profit card + equity curve */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-12">
          <div className="w-full max-w-sm space-y-3">
            {/* Profit factor card */}
            <div className="rounded-2xl border border-white/8 bg-zinc-900/60 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl ring-1 ring-white/5 border-t border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                    Profit Factor
                  </p>
                  <p className="mt-1 font-mono text-4xl font-bold text-emerald-400">
                    2.41
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    +18% vs last month
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-500/10 p-2.5">
                  <svg
                    className="size-5 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                    />
                  </svg>
                </div>
              </div>
              {/* Mini equity curve */}
              <div className="mt-4">
                <svg
                  viewBox="0 0 280 60"
                  preserveAspectRatio="none"
                  className="h-12 w-full"
                  aria-hidden
                >
                  <defs>
                    <linearGradient
                      id="auth-grad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#10b981"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="#10b981"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 52 C20 50,35 42,55 36 C75 30,90 18,115 14 C140 10,160 22,185 18 C208 14,230 6,280 4 L280 60 L0 60 Z"
                    fill="url(#auth-grad)"
                  />
                  <path
                    d="M0 52 C20 50,35 42,55 36 C75 30,90 18,115 14 C140 10,160 22,185 18 C208 14,230 6,280 4"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Win Rate", value: "63%" },
                { label: "Avg RR", value: "2.1×" },
                { label: "Trades", value: "148" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/6 bg-zinc-900/50 px-3 py-2.5 text-center backdrop-blur-sm"
                >
                  <p className="font-mono text-sm font-semibold text-zinc-100">
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Trade log fragment */}
            <div className="rounded-2xl border border-white/6 bg-zinc-900/40 px-4 py-3 backdrop-blur-sm space-y-2">
              {[
                { sym: "NQ", pnl: "+$420", side: "LONG", win: true },
                { sym: "ES", pnl: "-$115", side: "SHORT", win: false },
                { sym: "CL", pnl: "+$230", side: "LONG", win: true },
              ].map((t) => (
                <div
                  key={t.sym}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className="font-mono font-medium text-zinc-300">
                    {t.sym}
                  </span>
                  <span className="rounded px-1.5 py-0.5 bg-zinc-800/80 text-zinc-500">
                    {t.side}
                  </span>
                  <span
                    className={
                      t.win
                        ? "font-mono font-semibold text-emerald-400"
                        : "font-mono font-semibold text-rose-400"
                    }
                  >
                    {t.pnl}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 p-10 text-xs text-zinc-600">
          Your performance lab.
        </p>
      </div>

      {/* ── Form panel ── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 lg:border-l lg:border-zinc-800/60">
        {/* Faint emerald radial behind the form */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 40% at 50% 50%, rgba(16,185,129,0.05) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        {/* Mobile-only logo */}
        <div className="lg:hidden mb-8">
          <Logo />
        </div>

        <div className="relative z-10 w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
