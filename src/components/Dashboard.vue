<template>
  <section class="dashboard">

    <!-- Header -->
    <div class="header">
      <div>
        <h1>Good Evening 👋</h1>
        <p>Here's your financial overview for today.</p>
      </div>

      <button class="add-btn">
        + Add Transaction
      </button>
    </div>

    <!-- Stats -->

    <div class="stats">

      <div class="stat-card income">
        <span>Monthly Income</span>
        <h2>R {{ totalIncome.toLocaleString() }}</h2>
        <small>+8.5% this month</small>
      </div>

      <div class="stat-card expense">
        <span>Monthly Expenses</span>
        <h2>R {{ totalExpenses.toLocaleString() }}</h2>
        <small>-2.3% this month</small>
      </div>

      <div class="stat-card balance">
        <span>Net Balance</span>
        <h2>R {{ netBalance.toLocaleString() }}</h2>
        <small>Healthy cashflow</small>
      </div>

      <div class="stat-card score">
        <span>Financial Health</span>
        <h2>82%</h2>
        <small>Excellent</small>
      </div>

    </div>

    <!-- Main Grid -->

    <div class="main-grid">

      <!-- Left -->

      <div>

        <div class="card chart-card">
          <h3>Spending Overview</h3>

          <div class="chart-wrapper">
            <canvas id="financeChart"></canvas>
          </div>

        </div>

        <div class="card">

          <h3>Recent Transactions</h3>

          <div class="transaction">

            <div>
              <strong>Spotify</strong>
              <span>Entertainment</span>
            </div>

            <p>- R99</p>

          </div>

          <div class="transaction">

            <div>
              <strong>Salary</strong>
              <span>Income</span>
            </div>

            <p class="green">+ R17 000</p>

          </div>

          <div class="transaction">

            <div>
              <strong>Checkers</strong>
              <span>Groceries</span>
            </div>

            <p>- R635</p>

          </div>

          <div class="transaction">

            <div>
              <strong>Uber</strong>
              <span>Transport</span>
            </div>

            <p>- R110</p>

          </div>

        </div>

      </div>

      <!-- Right -->

      <div>

        <div class="card">

          <h3>Budget Progress</h3>

          <div class="budget">

            <span>Groceries</span>

            <div class="progress">
              <div style="width:72%"></div>
            </div>

          </div>

          <div class="budget">

            <span>Transport</span>

            <div class="progress">
              <div style="width:45%"></div>
            </div>

          </div>

          <div class="budget">

            <span>Entertainment</span>

            <div class="progress">
              <div style="width:20%"></div>
            </div>

          </div>

        </div>

        <div class="card ai">

          <h3>🤖 AI Advisor</h3>

          <div class="tip">

            <p>
              You're on track to save
              <strong>R4,500</strong>
              this month.
            </p>

          </div>

          <div class="tip">

            <p>
              Spending on restaurants increased by
              <strong>18%</strong>.
            </p>

          </div>

          <div class="tip">

            <p>
              Consider investing
              <strong>R500</strong>
              into your ETF portfolio this month.
            </p>

          </div>

        </div>

      </div>

    </div>

  </section>
</template>

<script>
import Chart from "chart.js/auto";

export default {

  data(){

    return{

      totalIncome:25000,

      totalExpenses:12000

    }

  },

  computed:{

    netBalance(){

      return this.totalIncome-this.totalExpenses

    }

  },

  mounted(){

    const ctx=document.getElementById("financeChart").getContext("2d");

    new Chart(ctx,{

      type:"doughnut",

      data:{

        labels:["Expenses","Income"],

        datasets:[{

          data:[this.totalExpenses,this.totalIncome],

          backgroundColor:["#ef4444","#22c55e"]

        }]

      },

      options:{

        plugins:{

          legend:{

            labels:{

              color:"#cbd5e1"

            }

          }

        }

      }

    })

  }

}
</script>

<style scoped>

.dashboard{

padding:40px;

color:white;

}

.header{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:40px;

}

.header h1{

font-size:2.5rem;

margin-bottom:8px;

}

.header p{

color:#94a3b8;

}

.add-btn{

background:#22c55e;

border:none;

padding:14px 22px;

border-radius:14px;

color:white;

cursor:pointer;

font-weight:600;

}

.stats{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(230px,1fr));

gap:20px;

margin-bottom:35px;

}

.stat-card{

padding:25px;

border-radius:20px;

background:#1e293b;

}

.stat-card span{

color:#94a3b8;

}

.stat-card h2{

margin:15px 0;

font-size:2rem;

}

.income{

border-left:5px solid #22c55e;

}

.expense{

border-left:5px solid #ef4444;

}

.balance{

border-left:5px solid #3b82f6;

}

.score{

border-left:5px solid gold;

}

.main-grid{

display:grid;

grid-template-columns:2fr 1fr;

gap:25px;

}

.card{

background:#1e293b;

padding:25px;

border-radius:20px;

margin-bottom:25px;

}

.chart-wrapper{

height:320px;

}

.transaction{

display:flex;

justify-content:space-between;

padding:18px 0;

border-bottom:1px solid rgba(255,255,255,.05);

}

.transaction span{

display:block;

font-size:.9rem;

color:#94a3b8;

}

.green{

color:#22c55e;

}

.budget{

margin:25px 0;

}

.progress{

background:#0f172a;

height:10px;

border-radius:50px;

overflow:hidden;

margin-top:10px;

}

.progress div{

height:100%;

background:#22c55e;

border-radius:50px;

}

.tip{

background:#0f172a;

padding:18px;

border-radius:12px;

margin-top:15px;

line-height:1.6;

}

@media(max-width:1000px){

.main-grid{

grid-template-columns:1fr;

}

.header{

flex-direction:column;

align-items:flex-start;

gap:20px;

}

}
</style>