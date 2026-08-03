# Personal Finance Dashboard

A full-featured personal finance tracker built with **Vue 3**, **Pinia**, **Tailwind CSS**, and **Supabase** (Postgres + Auth).

## Features

- 🔐 Real authentication (email/password, email confirmation, password reset) via Supabase Auth
- 💸 Expense & income tracking with custom categories
- 📊 Budgets with configurable alert thresholds
- 🎯 Financial goals with a savings/contribution tracker
- 🔁 Recurring transactions (daily/weekly/monthly/yearly), auto-applied on login
- 📈 Investment tracking with portfolio allocation and gain/loss
- 📉 Interactive charts (Chart.js): income vs. expenses, category breakdown, allocation
- 📑 Monthly / yearly / all-time reports
- 📤 Export to CSV and PDF
- 🔔 In-app budget & goal notifications
- 🌗 Dark mode (light / dark / system)
- 🌍 Multi-currency support with live exchange rates (optional API key) or static fallback rates
- 🤖 Rule-based "smart insights" and recommendations (spending trends, savings rate, budget/goal alerts) — runs entirely client-side against your own data, no external AI call required
- 📱 Responsive layout with a mobile nav drawer

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → **New query**, paste the contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it.
   This creates all tables, indexes, row-level security policies, and triggers (including auto-seeding default categories and a profile row for every new user).
3. Go to **Authentication → Providers** and confirm **Email** is enabled. (Optionally disable "Confirm email" while developing locally to skip the confirmation step.)
4. Go to **Settings → API** and copy your **Project URL** and **anon public key**.

## 2. Configure the app

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

The optional `VITE_EXCHANGE_RATE_API_KEY` enables live currency conversion rates (via exchangerate-api.com's free tier). Without it, the app uses reasonable static fallback rates so multi-currency still works out of the box.

## 3. Install & run

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`, sign up, and (if email confirmation is on) confirm via the email Supabase sends.

## 4. Build for production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.). Set the same `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` environment variables in your host's dashboard.

## Project structure

```
src/
  components/     Reusable UI (layout, charts, forms, lists, insights panel)
  composables/     useTheme (dark mode), useCurrency
  lib/            supabase client, currency helpers, CSV/PDF export, insights engine
  router/         Vue Router with auth guards
  stores/         Pinia stores: auth, finance (all Supabase CRUD lives here)
  views/          One view per route (Dashboard, Expenses, Income, Budgets, Goals,
                  Investments, Recurring, Reports, Settings, auth pages)
supabase/
  schema.sql      Full DB schema, RLS policies, and triggers — run this first
```

## Data model notes

- Every table has row-level security enabled and scoped to `auth.uid()` — users can only ever see their own data.
- `transactions` is a single unified ledger for both income and expense rows (`type` column), which keeps reporting and recurring-rule logic simple.
- New users get a `profiles` row and a set of default categories automatically via database triggers — no client-side seeding required.
- `goals.current_amount` is maintained automatically from `goal_contributions` via a trigger, so it can never drift out of sync.

## Extending further

- Swap the rule-based insights engine (`src/lib/insights.js`) for a real LLM call if you want generative recommendations — the function signature already takes the same summarized stats you'd pass as context to a model.
- Add bank-feed integrations (Plaid, Stitch, etc.) by writing into the same `transactions` table from a serverless function/webhook.
