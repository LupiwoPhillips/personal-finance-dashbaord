<script>
import { financeStore } from "../context/financeStore";
import StatsCard from "./StatsCard.vue";

export default {
  components: { StatsCard },

  setup() {
    return {
      financeStore,
      source: "",
      amount: 0,
    };
  },

  computed: {
    totalBudget() {
      return this.financeStore.budgets.reduce(
        (sum, e) => sum + e.amount,
        0
      );
    },
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

  <div class="stats-row">
    <StatsCard
      title="Total Budget"
      :value="'R ' + totalBudget"
      variant="red"
    />
    <StatsCard
      title="Entries"
      :value="financeStore.budgets.length"
      variant="blue"
    />
  </div>

  <form @submit.prevent="addBudget" class="income-form">
    <input v-model="source" placeholder="Source" />
    <input v-model.number="amount" type="number" placeholder="Amount" />
    <button>Add Budget</button>
  </form>

  <div class="insight-box">
    <h3>Insights</h3>
    <p>You have allocated R {{ totalBudget }} towards your budgets so far this month.</p>
  </div>

  <div class="income-list">
    <div v-for="e in financeStore.budgets" :key="e.id" class="income-card">
      <div class="income-header">
        <span>{{ e.source }}</span>
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

.income-card {
  background: white;
  padding: 18px;
  border-radius: 18px;
  margin-bottom: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

.income-header {
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

.income-form {
  margin-top: 20px;
  gap: 12px;
  background: #fff;
  padding: 20px;
}

.income-form input {
  margin-right: 12px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.income-form button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.income-form button:hover {
  background-color: #dc2626;
}

</style>
