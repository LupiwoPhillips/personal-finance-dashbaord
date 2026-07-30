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
  <div class="page-header">
  <div>
    <h2>Budgets</h2>
    <p>Create spending limits and stay in control of your money.</p>
  </div>
</div>

  <div class="stats-row">

  <StatsCard
    title="Total Budget"
    :value="'R ' + totalBudget"
    variant="purple"
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

/* =========================
   PAGE
========================= */

.page-header{
    margin-bottom:30px;
}

.page-header h2{
    font-size:2rem;
    color:#fff;
}

.page-header p{
    color:#94a3b8;
    margin-top:8px;
}

.stats-row{
    display:flex;
    gap:20px;
    margin-bottom:30px;
    flex-wrap:wrap;
}

/* =========================
   FORM
========================= */

.income-form{

    display:flex;
    gap:15px;
    flex-wrap:wrap;

    background:#1e293b;

    border:1px solid rgba(255,255,255,.06);

    padding:22px;

    border-radius:18px;

    margin-bottom:30px;

    box-shadow:0 10px 25px rgba(0,0,0,.25);

}

.income-form input{

    flex:1;

    min-width:180px;

    background:#111827;

    color:#fff;

    border:1px solid #374151;

    border-radius:12px;

    padding:14px 16px;

    font-size:15px;

    transition:.3s;

}

.income-form input::placeholder{

    color:#94a3b8;

}

.income-form input:focus{

    outline:none;

    border-color:#8b5cf6;

    box-shadow:0 0 0 3px rgba(139,92,246,.15);

}

.income-form button{

    background:linear-gradient(135deg,#7c3aed,#6366f1);

    color:white;

    border:none;

    border-radius:12px;

    padding:14px 24px;

    font-weight:600;

    cursor:pointer;

    transition:.25s;

}

.income-form button:hover{

    transform:translateY(-2px);

    box-shadow:0 10px 20px rgba(124,58,237,.35);

}

/* =========================
   INSIGHTS
========================= */

.insight-box{

    background:linear-gradient(135deg,#1f2937,#273449);

    border-left:5px solid #8b5cf6;

    padding:24px;

    border-radius:18px;

    margin-bottom:30px;

    color:white;

    box-shadow:0 12px 30px rgba(0,0,0,.25);

}

.insight-box h3{

    color:#8b5cf6;

    margin-bottom:10px;

}

.insight-box p{

    color:#cbd5e1;

}

/* =========================
   BUDGET LIST
========================= */

.income-list{

    display:flex;

    flex-direction:column;

    gap:18px;

}

/* =========================
   BUDGET CARD
========================= */

.income-card{

    background:#1e293b;

    border-radius:18px;

    padding:22px;

    border:1px solid rgba(255,255,255,.05);

    box-shadow:0 10px 25px rgba(0,0,0,.2);

    transition:.25s;

}

.income-card:hover{

    transform:translateY(-4px);

    border-color:#8b5cf6;

}

.income-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    color:white;

    font-weight:600;

    margin-bottom:18px;

}

.income-header span:last-child{

    color:#8b5cf6;

    font-size:18px;

}

/* =========================
   PROGRESS BAR
========================= */

.progress{

    height:10px;

    background:#0f172a;

    border-radius:999px;

    overflow:hidden;

}

.fill{

    width:70%;

    height:100%;

    border-radius:999px;

    background:linear-gradient(
        90deg,
        #7c3aed,
        #6366f1
    );

}

/* =========================
   MOBILE
========================= */

@media(max-width:768px){

.income-form{

    flex-direction:column;

}

.income-form button{

    width:100%;

}

.stats-row{

    flex-direction:column;

}

}

</style>