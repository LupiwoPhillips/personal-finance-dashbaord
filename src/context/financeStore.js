// src/context/financeStore.js
import { reactive } from "vue";

export const financeStore = reactive({
  incomes: [
    { id: 1, source: "Salary", amount: 20000 },
    { id: 2, source: "Freelance", amount: 5000 },
  ],
  expenses: [
    { id: 1, category: "Food", amount: 3000 },
    { id: 2, category: "Transport", amount: 2000 },
    { id: 3, category: "Rent", amount: 7000 },
  ],

  // Add income
  addIncome(source, amount) {
    this.incomes.push({
      id: Date.now(),
      source,
      amount: Number(amount),
    });
  },

  // Add expense
  addExpense(category, amount) {
    this.expenses.push({
      id: Date.now(),
      category,
      amount: Number(amount),
    });
  },

  // Totals
  get totalIncome() {
    return this.incomes.reduce((sum, i) => sum + i.amount, 0);
  },
  get totalExpenses() {
    return this.expenses.reduce((sum, e) => sum + e.amount, 0);
  },
  get netBalance() {
    return this.totalIncome - this.totalExpenses;
  },
});
