# Trading Journal

A personal trading journal built with **Next.js 14**, **Supabase**, **shadcn/ui**, and **Recharts**.

## Features

- Email/password authentication (Supabase Auth)
- Trade logging (symbol, direction, prices, fees, tags, notes)
- Trade list and detail views with edit/delete
- Dashboard with P&L, win rate, profit factor, and equity curve
- Screenshot uploads per trade (Supabase Storage)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Open **Project Settings → API** and copy your project URL and anon key.

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

(`NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported if your dashboard shows the legacy name.)

### 4. Run the database schema

In the Supabase dashboard, open **SQL Editor** and run the contents of:

```
supabase/schema.sql
```

This creates tables, row-level security policies, a default account on signup, and the screenshots storage bucket.

### 5. Configure auth URLs

In **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/**`

For development, you can disable email confirmation under **Authentication → Providers → Email**.

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and start logging trades.

## Project structure

```
src/
  app/
    (auth)/login, signup
    (dashboard)/dashboard, trades
    auth/callback
  components/
    auth/, dashboard/, layout/, trades/, ui/
  lib/
    supabase/, trades.ts
  types/
    database.ts
supabase/
  schema.sql
```

## Deploy

Deploy the Next.js app to [Vercel](https://vercel.com) and add the same Supabase environment variables. Update Supabase auth URLs to your production domain.
