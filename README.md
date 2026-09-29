# Personal Finance Dashboard

**Full-stack personal finance application built with Vue 3, Pinia, Tailwind CSS, and Supabase.**

Personal Finance Dashboard is a responsive web application that allows users to manage their income and expenses, create budgets and financial goals, track investments and recurring transactions, and analyse their financial activity through reports and interactive data visualisations.

The project was built to develop practical experience with **full-stack application development, authentication, database design, state management, API integration, data visualisation, and secure user-specific data access**.

---

## Features

### Financial Management

* Track income and expenses
* Create custom transaction categories
* Manage budgets
* Monitor spending against budgets
* Create financial goals
* Track goal contributions
* Manage recurring transactions

### Investments

* Track investments
* Monitor portfolio activity
* Record investment information
* View investment-related financial data

### Reports & Insights

* Monthly reports
* Yearly reports
* All-time financial reports
* Interactive charts and visualisations
* Spending and savings insights
* Financial activity analysis

### Data & Export

* CSV exports
* PDF exports
* Multi-currency support
* Exchange-rate integration

### User Experience

* Email/password authentication
* Protected application routes
* Budget and goal notifications
* Dark theme
* Light theme
* System theme
* Responsive mobile-first interface

---

## Technology

### Frontend

* Vue 3
* JavaScript (ES6+)
* Pinia
* Vue Router
* Tailwind CSS
* Chart.js

### Backend & Data

* Supabase
* PostgreSQL
* Supabase Auth
* Row Level Security (RLS)
* Database triggers

### Development

* Vite
* npm
* Git
* GitHub
* Vercel

---

## Application

The application separates different areas of responsibility across the frontend and backend.

The frontend handles:

* User interfaces
* Application views
* Client-side state
* Navigation
* Reusable components
* Shared application logic
* Data visualisation

Supabase and PostgreSQL handle:

* User authentication
* Persistent financial data
* Database relationships
* Access control
* Row Level Security
* Database triggers

This separation allows the application to support multiple financial workflows while keeping the codebase maintainable as functionality grows.

---

## Data & Security

Personal Finance Dashboard uses **Supabase Auth and PostgreSQL Row Level Security** to protect user data.

RLS policies restrict database access based on the authenticated user's ID, ensuring that users can only access financial records belonging to their account.

Database triggers are also used for application-level operations such as:

* Creating user profiles
* Seeding default categories
* Maintaining goal contribution totals

Sensitive credentials and private configuration are kept outside the repository through environment variables.

---

## Deployment

Personal Finance Dashboard is deployed using **Vercel** and is available as a live web application.

---

## What I Built

This project was built as a practical full-stack application to strengthen my understanding of how a frontend application connects to authentication, databases, APIs, and application logic.

Through the project, I worked with:

* Vue application architecture
* Pinia state management
* Authentication and protected routes
* Supabase and PostgreSQL
* Row Level Security
* Database relationships
* Database triggers
* CRUD operations
* REST/API integration
* Exchange-rate integration
* Data visualisation with Chart.js
* CSV and PDF generation
* Financial data analysis
* Responsive interface development
* Theme management
* Modular application architecture

---

## Why I Built This

Personal Finance Dashboard was built to move beyond simple frontend applications and work with **real persistent data and backend functionality**.

The project gave me practical experience designing an application where users can create, modify, analyse, and securely manage their own data.

It also introduced me to backend concepts such as **authentication, PostgreSQL, database relationships, Row Level Security, and database triggers**, while continuing to develop my frontend skills with Vue and Pinia.

The project forms part of my broader development journey toward building full-featured applications **layer by layer, from the interface to the underlying functionality**.

---

## Author

**Lupiwo Phillips**
Junior Software Developer

> Building applications layer by layer, from the interface to the underlying functionality.
