<script>
import { financeStore } from "../context/financeStore";

export default {
  setup() {
    return { financeStore, source: "", amount: 0 };
  },
  methods: {
    addInvestment() {
      if (this.source && this.amount > 0) {
        this.financeStore.addInvestment(this.source, this.amount);
        this.source = "";
        this.amount = 0;
      }
    },
  },
};
</script>

<template>
  <div>
    <h2>Investments</h2>
    <form @submit.prevent="addInvestment" class="investment-form">
      <input v-model="source" placeholder="Investment Source" />
      <input v-model.number="amount" type="number" placeholder="Amount" />
      <button type="submit">Add Investment</button>
    </form>

    <div class="investment-list">
      <div
        v-for="e in financeStore.investments"
        :key="e.id"
        class="investment-item"
      >
        <span class="investment-source">{{ e.source }}</span>
        <span class="investment-amount">R {{ e.amount }}</span>
      </div>
    </div>
  </div>
</template>



<style scoped>
.investment-form {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(44, 70, 60, 0.1);
  margin-bottom: 20px;
}

.investment-form input {
  margin-right: 12px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.investment-form button {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.investment-form button:hover {
  background-color: #276628;
}

.investment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.investment-item {
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

.investment-item:hover {
  background: #f3f8f4;
  box-shadow: 0 4px 16px rgba(44, 70, 60, 0.08);
}

.investment-source {
  color: #2e7d32;
  font-weight: 600;
}

.investment-amount {
  color: #444;
  font-weight: 500;
}
</style>
