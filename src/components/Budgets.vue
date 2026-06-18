<script>
import { financeStore } from "../context/financeStore";

export default {
  setup() {
    return { financeStore, source: "", amount: 0 };
  },
  methods: {
    addBudget() {
      if (this.source && this.amount > 0) {
        this.financeStore.addBudget(this.source, this.amount);
        this.source = "";
        this.amount = 0;
      }
    },
  },
};
</script>

<template>
  <div>
    <h2>Budgets</h2>
    <form @submit.prevent="addBudget" class="budget-form">
      <input v-model="source" placeholder="Budget Source" />
      <input v-model.number="amount" type="number" placeholder="Amount" />
      <button type="submit">Add Budget</button>
    </form>

    <div class="budget-list">
      <div
        v-for="e in financeStore.budgets"
        :key="e.id"
        class="budget-item"
      >
        <span class="budget-source">{{ e.source }}</span>
        <span class="budget-amount">R {{ e.amount }}</span>
      </div>
    </div>
  </div>
</template>


<style scoped>
.budget-form {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(44, 70, 60, 0.1);
  margin-bottom: 20px;
}

.budget-form input {
  margin-right: 12px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.budget-form button {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.budget-form button:hover {
  background-color: #276628;
}

.budget-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.budget-item {
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

.budget-item:hover {
  background: #f3f8f4;
  box-shadow: 0 4px 16px rgba(44, 70, 60, 0.08);
}

.budget-source {
  color: #2e7d32;
  font-weight: 600;
}

.budget-amount {
  color: #444;
  font-weight: 500;
}
</style>
