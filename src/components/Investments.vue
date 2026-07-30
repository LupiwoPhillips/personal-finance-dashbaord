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
    totalInvestment() {
      return this.financeStore.investments.reduce(
        (sum, e) => sum + e.amount,
        0
      );
    },
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
  <div class="page-header">
  <div>
    <h2>Investments</h2>
    <p>Grow your wealth by tracking every investment you make.</p>
  </div>
</div>

  <div class="stats-row">

  <StatsCard
    title="Total Investments"
    :value="'R ' + totalInvestment"
    variant="gold"
  />

  <StatsCard
    title="Entries"
    :value="financeStore.investments.length"
    variant="blue"
  />

</div>

  <form @submit.prevent="addInvestment" class="income-form">
    <input v-model="source" placeholder="Source" />
    <input v-model.number="amount" type="number" placeholder="Amount" />
    <button>Add Investment</button>
  </form>

  <div class="insight-box">
    <h3>Insights</h3>
    <p>You have allocated R {{ totalInvestment }} towards your investments so far this month.</p>
  </div>

  <div class="income-list">
    <div v-for="e in financeStore.investments" :key="e.id" class="income-card">
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

/* ==========================
   PAGE HEADER
========================== */

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

/* ==========================
   STATS
========================== */

.stats-row{
    display:flex;
    gap:20px;
    margin-bottom:30px;
    flex-wrap:wrap;
}

/* ==========================
   FORM
========================== */

.income-form{

    display:flex;

    flex-wrap:wrap;

    gap:15px;

    background:#1e293b;

    border:1px solid rgba(255,255,255,.06);

    border-radius:18px;

    padding:22px;

    margin-bottom:30px;

    box-shadow:0 10px 25px rgba(0,0,0,.25);

}

.income-form input{

    flex:1;

    min-width:180px;

    background:#111827;

    color:white;

    border:1px solid #374151;

    border-radius:12px;

    padding:14px 16px;

    transition:.3s;

    font-size:15px;

}

.income-form input::placeholder{

    color:#94a3b8;

}

.income-form input:focus{

    outline:none;

    border-color:#fbbf24;

    box-shadow:0 0 0 3px rgba(251,191,36,.18);

}

.income-form button{

    background:linear-gradient(
        135deg,
        #f59e0b,
        #fbbf24
    );

    color:#111827;

    border:none;

    border-radius:12px;

    padding:14px 24px;

    font-weight:700;

    cursor:pointer;

    transition:.25s;

}

.income-form button:hover{

    transform:translateY(-2px);

    box-shadow:0 10px 20px rgba(251,191,36,.35);

}

/* ==========================
   INSIGHT
========================== */

.insight-box{

    background:linear-gradient(
        135deg,
        #1f2937,
        #273449
    );

    border-left:5px solid #fbbf24;

    padding:24px;

    border-radius:18px;

    margin-bottom:30px;

    color:white;

    box-shadow:0 12px 30px rgba(0,0,0,.25);

}

.insight-box h3{

    color:#fbbf24;

    margin-bottom:10px;

}

.insight-box p{

    color:#cbd5e1;

}

/* ==========================
   INVESTMENT LIST
========================== */

.income-list{

    display:flex;

    flex-direction:column;

    gap:18px;

}

/* ==========================
   CARD
========================== */

.income-card{

    background:#1e293b;

    border-radius:18px;

    padding:22px;

    border:1px solid rgba(255,255,255,.05);

    box-shadow:0 10px 25px rgba(0,0,0,.20);

    transition:.25s;

}

.income-card:hover{

    transform:translateY(-4px);

    border-color:#fbbf24;

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

    color:#fbbf24;

    font-size:18px;

}

/* ==========================
   PROGRESS BAR
========================== */

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
        #f59e0b,
        #fbbf24
    );

}

/* ==========================
   RESPONSIVE
========================== */

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