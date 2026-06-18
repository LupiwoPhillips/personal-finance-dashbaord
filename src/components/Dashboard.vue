<template>
  <section class="dashboard">
    <h1>Welcome Back 👋</h1>
    <p>Here’s an overview of your finances today:</p>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="card income">
        <h3>💵 Total Income</h3>
        <p>R {{ totalIncome.toLocaleString() }}</p>
      </div>
      <div class="card expenses">
        <h3>💸 Total Expenses</h3>
        <p>R {{ totalExpenses.toLocaleString() }}</p>
      </div>
      <div class="card balance">
        <h3>💎 Net Balance</h3>
        <p>R {{ netBalance.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Doughnut Chart -->
    <div class="chart-container">
      <canvas id="financeChart"></canvas>
    </div>

    <!-- Quick Links -->
    <div class="dashboard-grid">
      <div class="card glass">
        <h3>📊 Budgets</h3>
        <p>Set goals and track your spending.</p>
        <router-link to="/dashboard/budgets" class="btn">View</router-link>
      </div>
      <div class="card glass">
        <h3>💸 Expenses</h3>
        <p>Monitor your daily outflow.</p>
        <router-link to="/dashboard/expenses" class="btn">View</router-link>
      </div>
      <div class="card glass">
        <h3>💵 Income</h3>
        <p>Track earnings and salary sources.</p>
        <router-link to="/dashboard/income" class="btn">View</router-link>
      </div>
      <div class="card glass">
        <h3>📈 Investments</h3>
        <p>Monitor your assets and portfolio growth.</p>
        <router-link to="/dashboard/investments" class="btn">View</router-link>
      </div>
    </div>
  </section>
</template>


<script>
import Chart from "chart.js/auto";

export default {
  name: "Dashboard",
  data() {
    return {
      totalIncome: 25000,
      totalExpenses: 12000,
    };
  },
  computed: {
    netBalance() {
      return this.totalIncome - this.totalExpenses;
    },
  },
  mounted() {
    const ctx = document.getElementById("financeChart").getContext("2d");

    // Gradient arcs
    const gradientIncome = ctx.createLinearGradient(0, 0, 0, 400);
    gradientIncome.addColorStop(0, "#43e97b");
    gradientIncome.addColorStop(1, "#38f9d7");

    const gradientExpenses = ctx.createLinearGradient(0, 0, 0, 400);
    gradientExpenses.addColorStop(0, "#f85032");
    gradientExpenses.addColorStop(1, "#e73827");

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Expenses", "Income"],
        datasets: [
          {
            data: [this.totalExpenses, this.totalIncome],
            backgroundColor: [gradientExpenses, gradientIncome],
            borderWidth: 2,
            borderColor: "#fff",
            hoverOffset: 20,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#fff",
              font: { size: 14, weight: "bold" },
            },
          },
        },
      },
    });
  },
};
</script>


<style scoped>
.dashboard {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(160deg, #141e30, #243b55);
  color: #fff;
  font-family: "Poppins", sans-serif;
}

h1 {
  font-size: 2.5rem;
}
p {
  color: #ccc;
  margin-bottom: 30px;
}

/* Summary cards */
.summary-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.summary-cards .card {
  flex: 1;
  padding: 25px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
  transition: transform 0.3s, box-shadow 0.3s;
}
.summary-cards .card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.6);
}

.summary-cards .income {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}
.summary-cards .expenses {
  background: linear-gradient(135deg, #f85032, #e73827);
}
.summary-cards .balance {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
}

/* Chart container */
.chart-container {
  width: 100%;
  max-width: 400px;   /* controls width */
  height: 250px;      /* controls height */
  margin: 0 auto;
}


/* Quick links grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.dashboard-grid .card.glass {
  padding: 20px;
  border-radius: 20px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  color: #fff;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  transition: transform 0.3s, background 0.3s;
  text-align: center;
}
.dashboard-grid .card.glass:hover {
  transform: translateY(-10px);
  background: rgba(255,255,255,0.15);
}

/* Buttons */
.btn {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 15px;
  border-radius: 12px;
  border: 1px solid #fff;
  color: #fff;
  background: transparent;
  font-weight: bold;
  transition: all 0.3s;
}
.btn:hover {
  background: #fff;
  color: #141e30;
}
</style>
