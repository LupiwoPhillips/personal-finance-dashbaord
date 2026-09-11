-- ============================================================
-- PFD FINANCIAL POSITION
-- Migration: 20260911_financial_position.sql
--
-- Adds the core financial-position model:
--   1. financial_accounts
--   2. financial_assets
--   3. financial_liabilities
--
-- These tables complement the existing:
--   transactions
--   investments
--   goals
--   budgets
--   recurring_rules
--
-- They allow PFD to understand the user's broader financial
-- position rather than only their transaction history.
-- ============================================================


-- ============================================================
-- 1. FINANCIAL ACCOUNTS
-- ============================================================

create table if not exists public.financial_accounts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  name text not null,

  account_type text not null
    check (
      account_type in (
        'checking',
        'savings',
        'cash',
        'credit_card',
        'loan',
        'investment',
        'other'
      )
    ),

  balance numeric(14,2) not null default 0,

  currency text not null default 'ZAR',

  institution text,

  is_liability boolean not null default false,

  include_in_net_worth boolean not null default true,

  notes text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 2. FINANCIAL ASSETS
-- ============================================================

create table if not exists public.financial_assets (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  name text not null,

  asset_type text not null
    check (
      asset_type in (
        'property',
        'vehicle',
        'business',
        'valuable',
        'cash',
        'other'
      )
    ),

  current_value numeric(14,2) not null default 0,

  currency text not null default 'ZAR',

  include_in_net_worth boolean not null default true,

  notes text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 3. FINANCIAL LIABILITIES
-- ============================================================

create table if not exists public.financial_liabilities (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  name text not null,

  liability_type text not null
    check (
      liability_type in (
        'credit_card',
        'personal_loan',
        'student_loan',
        'vehicle_loan',
        'mortgage',
        'overdraft',
        'other'
      )
    ),

  current_balance numeric(14,2) not null default 0,

  interest_rate numeric(7,3),

  minimum_payment numeric(14,2),

  currency text not null default 'ZAR',

  due_date date,

  include_in_net_worth boolean not null default true,

  notes text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 4. INDEXES
-- ============================================================

create index if not exists financial_accounts_user_id_idx
  on public.financial_accounts(user_id);

create index if not exists financial_accounts_type_idx
  on public.financial_accounts(user_id, account_type);

create index if not exists financial_assets_user_id_idx
  on public.financial_assets(user_id);

create index if not exists financial_assets_type_idx
  on public.financial_assets(user_id, asset_type);

create index if not exists financial_liabilities_user_id_idx
  on public.financial_liabilities(user_id);

create index if not exists financial_liabilities_type_idx
  on public.financial_liabilities(user_id, liability_type);


-- ============================================================
-- 5. UPDATED_AT TRIGGERS
-- ============================================================

drop trigger if exists financial_accounts_updated_at
on public.financial_accounts;

create trigger financial_accounts_updated_at
before update on public.financial_accounts
for each row
execute function public.set_updated_at();


drop trigger if exists financial_assets_updated_at
on public.financial_assets;

create trigger financial_assets_updated_at
before update on public.financial_assets
for each row
execute function public.set_updated_at();


drop trigger if exists financial_liabilities_updated_at
on public.financial_liabilities;

create trigger financial_liabilities_updated_at
before update on public.financial_liabilities;
for each row
execute function public.set_updated_at();


-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

alter table public.financial_accounts enable row level security;

alter table public.financial_assets enable row level security;

alter table public.financial_liabilities enable row level security;


-- ============================================================
-- 7. ACCOUNT POLICIES
-- ============================================================

drop policy if exists "Users can view their own financial accounts"
on public.financial_accounts;

create policy "Users can view their own financial accounts"
on public.financial_accounts
for select
using (auth.uid() = user_id);


drop policy if exists "Users can create their own financial accounts"
on public.financial_accounts;

create policy "Users can create their own financial accounts"
on public.financial_accounts
for insert
with check (auth.uid() = user_id);


drop policy if exists "Users can update their own financial accounts"
on public.financial_accounts;

create policy "Users can update their own financial accounts"
on public.financial_accounts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


drop policy if exists "Users can delete their own financial accounts"
on public.financial_accounts;

create policy "Users can delete their own financial accounts"
on public.financial_accounts
for delete
using (auth.uid() = user_id);


-- ============================================================
-- 8. ASSET POLICIES
-- ============================================================

drop policy if exists "Users can view their own financial assets"
on public.financial_assets;

create policy "Users can view their own financial assets"
on public.financial_assets
for select
using (auth.uid() = user_id);


drop policy if exists "Users can create their own financial assets"
on public.financial_assets;

create policy "Users can create their own financial assets"
on public.financial_assets
for insert
with check (auth.uid() = user_id);


drop policy if exists "Users can update their own financial assets"
on public.financial_assets;

create policy "Users can update their own financial assets"
on public.financial_assets
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


drop policy if exists "Users can delete their own financial assets"
on public.financial_assets;

create policy "Users can delete their own financial assets"
on public.financial_assets
for delete
using (auth.uid() = user_id);


-- ============================================================
-- 9. LIABILITY POLICIES
-- ============================================================

drop policy if exists "Users can view their own financial liabilities"
on public.financial_liabilities;

create policy "Users can view their own financial liabilities"
on public.financial_liabilities
for select
using (auth.uid() = user_id);


drop policy if exists "Users can create their own financial liabilities"
on public.financial_liabilities;

create policy "Users can create their own financial liabilities"
on public.financial_liabilities
for insert
with check (auth.uid() = user_id);


drop policy if exists "Users can update their own financial liabilities"
on public.financial_liabilities;

create policy "Users can update their own financial liabilities"
on public.financial_liabilities
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


drop policy if exists "Users can delete their own financial liabilities"
on public.financial_liabilities;

create policy "Users can delete their own financial liabilities"
on public.financial_liabilities
for delete
using (auth.uid() = user_id);


-- ============================================================
-- 10. COMMENTS
-- ============================================================

comment on table public.financial_accounts is
'User financial accounts such as bank accounts, savings, cash, credit cards and loans.';

comment on table public.financial_assets is
'User-owned assets outside the existing investments model, such as property and vehicles.';

comment on table public.financial_liabilities is
'User debts and liabilities such as credit cards, loans and mortgages.';