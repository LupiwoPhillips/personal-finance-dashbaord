<script>
import { financeStore } from "../context/financeStore";
import StatsCard from "./StatsCard.vue";

export default {
  components: { StatsCard },

  setup() {
    return {
      financeStore,
      category: "",
      amount: 0,
    };
  },

  computed: {
    totalExpenses() {
      return this.financeStore.expenses.reduce(
        (sum, e) => sum + e.amount,
        0
      );
    },
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

  <div class="stats-row">
    <StatsCard
      title="Total Expenses"
      :value="'R ' + totalExpenses"
      variant="red"
    />
    <StatsCard
      title="Entries"
      :value="financeStore.expenses.length"
      variant="blue"
    />
  </div>

  <form @submit.prevent="addExpense" class="expense-form">
    <input v-model="category" placeholder="Category" />
    <input v-model.number="amount" type="number" placeholder="Amount" />
    <button>Add Expense</button>
  </form>

  <div class="insight-box">
    <h3>Insights</h3>
    <p>You spent R {{ totalExpenses }} so far this month.</p>
  </div>

  <div class="expenses-list">
    <div v-for="e in financeStore.expenses" :key="e.id" class="expense-card">
      <div class="expense-header">
        <span>{{ e.category }}</span>
        <span>R {{ e.amount }}</span>
      </div>

      <div class="progress">
        <div class="fill"></div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

.stats-row {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  margin-top: 20px;
  justify-content: center;
}

.insight-box {
  background: #fff7e6;
  padding: 20px;
  border-left: 6px solid orange;
  border-radius: 12px;
  margin-bottom: 20px;
  margin-top: 20px;
}

.expense-card {
  background: white;
  padding: 18px;
  border-radius: 18px;
  margin-bottom: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

.expense-header {
  display: flex;
  justify-content: space-between;
}

.progress {
  height: 8px;
  background: #eee;
  margin-top: 12px;
  border-radius: 999px;
}

.fill {
  height: 100%;
  width: 70%;
  background: linear-gradient(90deg, #ef4444, #f97316);
  border-radius: 999px;
}

.expense-form {
  margin-top: 20px;
  gap: 12px;
  background: #fff;
  padding: 20px;
}

.expense-form input {
  margin-right: 12px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.expense-form button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.expense-form button:hover {
  background-color: #dc2626;
}

</style>
