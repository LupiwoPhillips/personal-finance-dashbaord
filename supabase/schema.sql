-- ============================================================================
-- Personal Finance Dashboard — Supabase schema
-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (one row per auth.users row)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  base_currency text not null default 'ZAR',
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Categories (expense categories, per user, with sensible defaults)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text not null default '💰',
  color text not null default '#22c55e',
  kind text not null default 'expense' check (kind in ('expense', 'income')),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, name, kind)
);

alter table public.categories enable row level security;

drop policy if exists "categories_all_own" on public.categories;
create policy "categories_all_own" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Seed default categories for a new user
create or replace function public.seed_default_categories()
returns trigger as $$
begin
  insert into public.categories (user_id, name, icon, color, kind, is_default) values
    (new.id, 'Food & Groceries', '🛒', '#f97316', 'expense', true),
    (new.id, 'Rent & Housing', '🏠', '#8b5cf6', 'expense', true),
    (new.id, 'Transport', '🚗', '#3b82f6', 'expense', true),
    (new.id, 'Utilities', '💡', '#eab308', 'expense', true),
    (new.id, 'Entertainment', '🎬', '#ec4899', 'expense', true),
    (new.id, 'Health', '🏥', '#ef4444', 'expense', true),
    (new.id, 'Shopping', '🛍️', '#06b6d4', 'expense', true),
    (new.id, 'Other', '📦', '#6b7280', 'expense', true),
    (new.id, 'Salary', '💵', '#22c55e', 'income', true),
    (new.id, 'Freelance', '💻', '#14b8a6', 'income', true),
    (new.id, 'Investments', '📈', '#6366f1', 'income', true),
    (new.id, 'Other Income', '➕', '#84cc16', 'income', true)
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created_seed_categories on auth.users;
create trigger on_auth_user_created_seed_categories
  after insert on auth.users
  for each row execute procedure public.seed_default_categories();

-- ---------------------------------------------------------------------------
-- Transactions (unified income + expense ledger)
-- ---------------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  description text,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'ZAR',
  occurred_on date not null default current_date,
  is_recurring boolean not null default false,
  recurring_rule_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx on public.transactions (user_id, occurred_on desc);
create index if not exists transactions_user_type_idx on public.transactions (user_id, type);

alter table public.transactions enable row level security;

drop policy if exists "transactions_all_own" on public.transactions;
create policy "transactions_all_own" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Recurring transaction rules
-- ---------------------------------------------------------------------------
create table if not exists public.recurring_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  description text,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'ZAR',
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly', 'yearly')),
  start_date date not null default current_date,
  next_run_date date not null default current_date,
  end_date date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.recurring_rules enable row level security;

drop policy if exists "recurring_rules_all_own" on public.recurring_rules;
create policy "recurring_rules_all_own" on public.recurring_rules
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.transactions
  drop constraint if exists transactions_recurring_rule_id_fkey;
alter table public.transactions
  add constraint transactions_recurring_rule_id_fkey
  foreign key (recurring_rule_id) references public.recurring_rules(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Budgets (per category, per period)
-- ---------------------------------------------------------------------------
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'ZAR',
  period text not null default 'monthly' check (period in ('monthly', 'yearly')),
  alert_threshold_pct int not null default 80 check (alert_threshold_pct between 1 and 100),
  created_at timestamptz not null default now(),
  unique (user_id, category_id, period)
);

alter table public.budgets enable row level security;

drop policy if exists "budgets_all_own" on public.budgets;
create policy "budgets_all_own" on public.budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Financial goals & savings tracker
-- ---------------------------------------------------------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text not null default '🎯',
  target_amount numeric(14, 2) not null check (target_amount > 0),
  current_amount numeric(14, 2) not null default 0 check (current_amount >= 0),
  currency text not null default 'ZAR',
  target_date date,
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

drop policy if exists "goals_all_own" on public.goals;
create policy "goals_all_own" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.goal_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(14, 2) not null,
  note text,
  contributed_on date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.goal_contributions enable row level security;

drop policy if exists "goal_contributions_all_own" on public.goal_contributions;
create policy "goal_contributions_all_own" on public.goal_contributions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Keep goals.current_amount in sync with contributions
create or replace function public.recalc_goal_amount()
returns trigger as $$
begin
  update public.goals
  set current_amount = coalesce((
    select sum(amount) from public.goal_contributions
    where goal_id = coalesce(new.goal_id, old.goal_id)
  ), 0)
  where id = coalesce(new.goal_id, old.goal_id);
  return null;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_goal_contribution_change on public.goal_contributions;
create trigger on_goal_contribution_change
  after insert or update or delete on public.goal_contributions
  for each row execute procedure public.recalc_goal_amount();

-- ---------------------------------------------------------------------------
-- Investments
-- ---------------------------------------------------------------------------
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  asset_type text not null default 'stock' check (asset_type in ('stock', 'etf', 'bond', 'crypto', 'property', 'cash', 'other')),
  units numeric(18, 6) not null default 1,
  cost_basis numeric(14, 2) not null default 0,
  current_value numeric(14, 2) not null default 0,
  currency text not null default 'ZAR',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.investments enable row level security;

drop policy if exists "investments_all_own" on public.investments;
create policy "investments_all_own" on public.investments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Notifications (budget alerts, goal milestones, etc.)
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('budget_alert', 'goal_milestone', 'recurring_due', 'system')),
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

drop policy if exists "notifications_all_own" on public.notifications;
create policy "notifications_all_own" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- updated_at maintenance trigger (generic, reused across tables)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_transactions on public.transactions;
create trigger set_updated_at_transactions before update on public.transactions
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_investments on public.investments;
create trigger set_updated_at_investments before update on public.investments
  for each row execute procedure public.set_updated_at();

-- ============================================================================
-- Done. Next steps:
-- 1. In Supabase Dashboard -> Authentication -> Providers, ensure Email is on.
-- 2. Copy your Project URL + anon key into .env (see .env.example).
-- 3. (Optional) Authentication -> Email Templates: customize confirmation email.
-- ============================================================================
