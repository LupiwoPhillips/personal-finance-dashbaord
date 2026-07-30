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
  <div class="page-header">
    <div>
        <h2>Expenses</h2>
        <p>Track every Rand you spend and stay within budget.</p>
    </div>
</div>

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

/* -------------------------
   PAGE
------------------------- */

h2{
    font-size:2rem;
    color:#fff;
    margin-bottom:30px;
}

.stats-row{
    display:flex;
    gap:20px;
    margin-bottom:30px;
    flex-wrap:wrap;
}

/* -------------------------
   FORM
------------------------- */

.expense-form{
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

.expense-form input{
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

.expense-form input::placeholder{
    color:#94a3b8;
}

.expense-form input:focus{
    outline:none;
    border-color:#22c55e;
    box-shadow:0 0 0 3px rgba(34,197,94,.15);
}

.expense-form button{

    background:linear-gradient(135deg,#22c55e,#16a34a);

    color:white;

    border:none;

    border-radius:12px;

    padding:14px 24px;

    cursor:pointer;

    font-weight:600;

    transition:.25s;
}

.expense-form button:hover{

    transform:translateY(-2px);

    box-shadow:0 10px 20px rgba(34,197,94,.35);

}

/* -------------------------
   INSIGHTS
------------------------- */

.insight-box{

    background:linear-gradient(135deg,#1f2937,#273449);

    border-left:5px solid #22c55e;

    padding:24px;

    border-radius:18px;

    margin-bottom:30px;

    color:white;

    box-shadow:0 12px 30px rgba(0,0,0,.25);
}

.insight-box h3{

    margin-bottom:10px;

    color:#22c55e;

    font-size:18px;

}

.insight-box p{

    color:#cbd5e1;

}

/* -------------------------
   LIST
------------------------- */

.expenses-list{

    display:flex;

    flex-direction:column;

    gap:18px;

}

/* -------------------------
   CARD
------------------------- */

.expense-card{

    background:#1e293b;

    border-radius:18px;

    padding:22px;

    border:1px solid rgba(255,255,255,.05);

    transition:.25s;

    box-shadow:0 10px 25px rgba(0,0,0,.2);

}

.expense-card:hover{

    transform:translateY(-4px);

    border-color:#22c55e;

}

.expense-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:18px;

    font-weight:600;

    color:white;

}

.expense-header span:last-child{

    color:#ef4444;

    font-size:18px;

}

/* -------------------------
   PROGRESS BAR
------------------------- */

.progress{

    height:10px;

    background:#0f172a;

    border-radius:999px;

    overflow:hidden;

}

.fill{

    height:100%;

    width:70%;

    border-radius:999px;

    background:linear-gradient(
        90deg,
        #ef4444,
        #f97316
    );

}

/* -------------------------
   RESPONSIVE
------------------------- */

@media(max-width:768px){

.expense-form{

    flex-direction:column;

}

.expense-form button{

    width:100%;

}

.stats-row{

    flex-direction:column;

}

}

.page-header{
    margin-bottom:30px;
}

.page-header p{
    color:#94a3b8;
    margin-top:8px;
}
</style>