<script>
import { financeStore } from "../context/financeStore";

export default {
  setup() {
    return { financeStore, category: "", amount: 0 };
  },
  methods: {
    addExpense() {
      if (this.category && this.amount > 0) {
        this.financeStore.addExpense(this.category, this.amount);
        this.category = "";
        this.amount = 0;
      }
    },
  },
};
</script>

<template>
  <div>
    <h2>Expenses</h2>
    <form @submit.prevent="addExpense" class="expense-form">
      <input v-model="category" placeholder="Category" />
      <input v-model.number="amount" type="number" placeholder="Amount" />
      <button type="submit">Add Expense</button>
    </form>

    <div class="expenses-list">
      <div
        v-for="e in financeStore.expenses"
        :key="e.id"
        class="expense-item"
      >
        <span class="expense-category">{{ e.category }}</span>
        <span class="expense-amount">R {{ e.amount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expense-form {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(44, 70, 60, 0.1);
  margin-bottom: 20px;
}

.expense-form input {
  margin-right: 12px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.expense-form button {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.expense-form button:hover {
  background-color: #276628;
}

.expenses-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.expense-item {
  background: #fff;
  border-left: 7px solid #2e7d32;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(44, 70, 60, 0.05);
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
}

.expense-item:hover {
  background: #f3f8f4;
  box-shadow: 0 4px 16px rgba(44, 70, 60, 0.08);
}

.expense-category {
  color: #2e7d32;
  font-weight: 600;
}

.expense-amount {
  color: #444;
  font-weight: 500;
}
</style>
