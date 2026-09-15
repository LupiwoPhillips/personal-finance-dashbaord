# Personal Finance Dashboard

A full-stack personal finance application built with **Vue 3, Pinia, Tailwind CSS, and Supabase**.

The application allows users to manage income and expenses, create budgets and financial goals, track investments, monitor recurring transactions, and analyse their financial activity through reports and interactive charts.

## Features

* 🔐 Email/password authentication with Supabase Auth
* 💸 Income and expense tracking
* 🏷️ Custom transaction categories
* 📊 Budget tracking with configurable alerts
* 🎯 Financial goals and contribution tracking
* 🔁 Recurring transactions
* 📈 Investment and portfolio tracking
* 📊 Interactive financial charts with Chart.js
* 📑 Monthly, yearly, and all-time reports
* 📤 CSV and PDF exports
* 🔔 Budget and goal notifications
* 🌗 Dark, light, and system themes
* 🌍 Multi-currency support with exchange-rate integration
* 🤖 Client-side financial insights based on spending and savings data
* 📱 Responsive mobile-first interface

## Tech Stack

**Frontend**

* Vue 3
* JavaScript (ES6+)
* Pinia
* Vue Router
* Tailwind CSS
* Chart.js

**Backend & Data**

* Supabase
* PostgreSQL
* Supabase Auth
* Row Level Security (RLS)
* Database triggers

**Development**

* Vite
* npm
* Git & GitHub

## Architecture

```text
src/
├── components/     Reusable UI components
├── composables/    Shared application logic
├── lib/            Supabase client, exports, currency and insights logic
├── router/         Routes and authentication guards
├── stores/         Pinia state management and database operations
├── views/          Application pages
└── main.js

supabase/
└── schema.sql      Database schema, RLS policies and triggers
```

The application separates UI components, views, state management, shared logic, and database operations to keep the codebase maintainable as functionality grows.

## Data & Security

User data is protected using **Supabase Auth and PostgreSQL Row Level Security**.

RLS policies restrict database access using the authenticated user's ID, ensuring users can only access records belonging to their account.

Database triggers are also used for tasks such as:

* Creating user profiles
* Seeding default categories
* Maintaining goal contribution totals

No private credentials or secrets should be committed to the repository.

## Getting Started

### 1. Configure environment variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Add your local configuration:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_EXCHANGE_RATE_API_KEY=your-api-key
```

The `.env` file is intentionally excluded from version control.

### 2. Configure Supabase

Run:

```text
supabase/schema.sql
```

in the Supabase SQL Editor to create the required database tables, policies, indexes, and triggers.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## What I Built

This project was built to strengthen my understanding of:

* Building structured Vue applications
* State management with Pinia
* Authentication and protected routes
* Supabase and PostgreSQL
* Row Level Security
* Database relationships and triggers
* CRUD operations
* Data visualisation
* API integration
* Responsive UI development
* Separating application logic into maintainable modules

## Author

**Lupiwo Phillips**
Junior Software Developer
