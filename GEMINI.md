# Tradventure (Trading Journal) — Antigravity Agent Guidelines

## 1. Project Overview
- **Name:** Tradventure (internal repo: `trading_journal`)
- **Type:** Full-stack personal trading journal, risk management, and performance analytics cockpit.
- **Audience:** Active traders across stocks, forex, crypto, options, and futures.
- **Key Capabilities:** Trade logging (open/closed positions), psychology tracking (emotions, mistakes, rule adherence), performance analytics (P&L, win rate, profit factor, max drawdown, expectancy), equity curve visualization, position size calculation, monthly target tracking, and chart screenshot storage.

---

## 2. Tech Stack & Infrastructure
- **Framework:** Next.js 16 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui (`@base-ui/react`), Lucide React icons, Framer Motion
- **Database & Auth:** Supabase (PostgreSQL, Row-Level Security, Supabase Auth via `@supabase/ssr`, Storage bucket `trade-screenshots`)
- **Charts & Visualizations:** Recharts (Responsive containers, custom tooltips)
- **Forms & Validation:** React Hook Form, `@hookform/resolvers`, Zod
- **External APIs:** Resend (in-app bug reporting & feedback at `/api/feedback`)
- **Deployment Target:** Vercel (`vercel.json` configured for region `iad1`)

---

## 3. Directory Layout

```
trading_journal/
├── public/                 # Branding assets (icon.png, icon.svg)
├── scripts/                # Maintenance scripts (clear-trade-screenshots.mjs)
├── supabase/
│   ├── schema.sql          # Primary database schema, triggers, RLS & storage policies
│   └── migrations/         # Incremental SQL migrations
├── src/
│   ├── app/
│   │   ├── (auth)/         # Auth routes: /login, /signup, actions.ts
│   │   ├── (dashboard)/    # Authenticated app shell & views:
│   │   │   ├── dashboard/  # Terminal overview, stats ribbons, equity curve, goals
│   │   │   ├── trades/     # Trade list table, drawer sheet, edit, detail view
│   │   │   ├── add-trade/  # Comprehensive trade entry form
│   │   │   ├── analytics/  # In-depth breakdown charts & distributions
│   │   │   ├── calendar/   # Daily P&L heatmap calendar
│   │   │   ├── reports/    # Monthly retrospective reviews
│   │   │   └── settings/   # Account settings, trading rules, risk limits
│   │   ├── onboarding/     # New user onboarding flow
│   │   ├── api/feedback/   # Resend feedback dispatch API route
│   │   ├── layout.tsx      # Root application layout
│   │   └── page.tsx        # Public landing page
│   ├── components/
│   │   ├── analytics/      # Recharts breakdown charts
│   │   ├── auth/           # Login and signup forms
│   │   ├── calendar/       # Heatmap grid components
│   │   ├── dashboard/      # Equity curve, summary ribbons, monthly goals, calculators
│   │   ├── landing/        # Landing page sections (hero, bento, preview, footer)
│   │   ├── layout/         # App sidebar, account switcher, headers, risk banner
│   │   ├── trades/         # Trade forms, table filters, psychology tracker, CSV import/export
│   │   └── ui/             # shadcn/ui design primitives
│   ├── lib/
│   │   ├── data/           # Database fetchers (getTrades, getActiveAccount, etc.)
│   │   ├── supabase/       # Server/client Supabase instances & middleware session refresh
│   │   ├── analytics.ts    # Advanced math (drawdowns, streaks, session breakdowns)
│   │   ├── trades.ts       # Trade calculations (P&L, risk/reward, equity points)
│   │   ├── risk.ts         # Position sizing and risk limit logic
│   │   ├── ui-classes.ts   # Shared terminal styling tokens (terminalCard, metricLabel)
│   │   └── utils.ts        # cn helper (clsx + tailwind-merge)
│   ├── types/
│   │   └── database.ts     # TypeScript definitions for all DB tables and enums
│   └── middleware.ts       # Next.js middleware for Supabase session refresh
```

---

## 4. Architectural Rules & Coding Standards

### Data Access & Mutations
1. **Server-First Fetching:** Fetch data in React Server Components (`async` pages/components) using the helper functions in `@/lib/data/trades` and `@/lib/data/accounts`.
2. **Server Actions:** Perform mutations via Next.js Server Actions (e.g. in `actions.ts` files). Always call `revalidatePath(...)` after data modifications to ensure fresh client state.
3. **Supabase Client Distinction:**
   - **Server Components & Server Actions:** Always import `createClient` from `@/lib/supabase/server`.
   - **Client Components (`'use client'`):** Always import `createClient` from `@/lib/supabase/client`.
4. **Row-Level Security (RLS):** All database operations must respect Supabase RLS scoped to `auth.uid() = user_id`. Do not attempt to bypass RLS or expose service-role keys to the client.

### Trading Math & Calculations
1. **Centralized Logic:** Never perform P&L, risk-to-reward, or drawdown math inline inside UI components. Always use or extend functions in:
   - `@/lib/trades.ts`: Trade-level P&L (`calculatePnl`), win/loss status, equity points.
   - `@/lib/analytics.ts`: Expectancy, max drawdown, win/loss distributions, session breakdowns.
   - `@/lib/risk.ts`: Position size formula and daily/weekly risk limits.
2. **Handling Open vs. Closed Trades:**
   - Closed trades have `exit_price: number` and `status: "closed"`.
   - Open trades have `exit_price: null` and `status: "open"`.
   - Always guard against `null` or `undefined` exit prices when computing realized metrics.

### UI & Styling Guidelines
1. **Design Theme:** Dark terminal / financial cockpit aesthetic:
   - Base background: `bg-zinc-950` with `text-zinc-100`.
   - Cards & Panels: Use shared tokens from `@/lib/ui-classes.ts`:
     - `terminalCard` = `"border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5"`
     - `metricLabel` = `"text-xs font-medium uppercase tracking-wider text-zinc-500"`
     - `pageMain` = `"min-h-screen space-y-8"`
     - `sectionLabel` = `"mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500"`
2. **P&L Color Conventions:**
   - Profit / Gain: `text-emerald-400`, `bg-emerald-500/10`, `border-emerald-500/20`
   - Loss / Drawdown: `text-rose-400`, `bg-rose-500/10`, `border-rose-500/20`
   - Neutral / Open: `text-zinc-400`, `bg-zinc-800/40`
3. **Components:** Leverage existing primitives in `@/components/ui/` (buttons, dialogs, badges, inputs).

---

## 5. Useful Verification Commands
- **Start Dev Server:** `npm run dev`
- **Typecheck:** `npx tsc --noEmit`
- **Lint:** `npm run lint`
- **Production Build:** `npm run build`
