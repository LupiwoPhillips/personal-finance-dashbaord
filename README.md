# Personal Finance Dashboard

**Personal Finance Dashboard** is a web application designed to help users track, manage, and understand their financial lives in one centralized platform. The application provides users with tools to monitor income, expenses, budgets, and investments while offering visual insights into their overall financial health.

Built with **Vue.js** and **Firebase**, the project aims to simplify personal financial management through an intuitive and responsive user experience.

---

# Features

* User authentication
* Secure account registration and login
* Financial dashboard overview
* Income tracking
* Expense management
* Budget planning
* Investment tracking
* Financial statistics cards
* Centralized financial state management
* Responsive dashboard layout
* Firebase backend integration

---

# Tech Stack

* Vue.js
* Vue Router
* JavaScript (ES6+)
* Firebase
* CSS3
* HTML5

---

# Project Structure

```text
personal-finance-dashboard/
│
├── .vs/
├── .vscode/
│   └── extensions.json
│
├── src/
│   ├── components/
│   │   ├── Budget.vue
│   │   ├── Dashboard.vue
│   │   ├── DashboardLayout.vue
│   │   ├── Expenses.vue
│   │   ├── Income.vue
│   │   ├── Investments.vue
│   │   └── StatsCard.vue
│   │
│   ├── context/
│   │   └── financeStore.js
│   │
│   ├── router/
│   │   └── index.js
│   │
│   ├── services/
│   │   └── firebase.js
│   │
│   ├── views/
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   └── SignUp.vue
│   │
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── .gitattributes
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vue.config.js
└── README.md
```

---

# Application Architecture

The application follows a component-based architecture using Vue.js.

* **Components** handle reusable dashboard functionality.
* **Views** manage page-level interfaces.
* **Router** handles navigation.
* **Context Store** manages financial state.
* **Firebase Service** handles backend services and authentication.

---

# Authentication

Authentication is managed through Firebase.

Current authentication features include:

* User registration
* User login
* Session persistence
* Secure authentication handling

---

# Main Features

## Dashboard

The dashboard provides users with a complete overview of their finances, including:

* Financial summaries
* Key statistics
* Budget information
* Income and expense tracking
* Investment monitoring

---

## Income Tracking

Users can monitor and organize their income sources.

---

## Expense Management

Track spending habits and categorize expenses.

---

## Budget Planning

Set budgets and monitor spending against financial goals.

---

## Investment Tracking

Monitor investment allocations and financial growth.

---

## Statistics Cards

Quick visual summaries of important financial metrics.

---

# State Management

The application uses:

```text
financeStore.js
```

to centralize financial data and maintain consistency throughout the application.

---

# Getting Started

## Prerequisites

* Node.js
* npm

---

## Installation

Clone the repository:

```bash
git clone https://github.com/LupiwoPhillips/personal-finance-dashbaord.git
```

Navigate to the project folder:

```bash
cd personal-finance-dashbaord
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

# Future Improvements

Planned improvements for the project include:

* Expense categories
* Financial goal tracking
* Savings tracker
* Recurring transactions
* Data visualization charts
* Monthly and yearly reports
* Export to PDF or CSV
* Budget alerts and notifications
* Dark mode support
* Mobile responsiveness improvements
* Multi-currency support
* AI-powered financial insights
* Investment analytics
* Financial recommendations

---

# Vision

The vision behind the Personal Finance Dashboard is to provide individuals with a simple yet powerful platform for understanding and improving their financial health.

Many personal finance tools can be overwhelming or overly complex. This project aims to deliver an accessible financial management experience that allows users to:

* Understand spending habits.
* Monitor income and expenses.
* Track investments.
* Create sustainable budgets.
* Make informed financial decisions.

The long-term goal is to evolve the application into a complete personal financial operating system that empowers users to achieve financial stability and long-term growth.

---

# Author

**Lupiwo Phillips**

Junior Software Developer

---
