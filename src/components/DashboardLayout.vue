<template>
  <div class="dashboard-layout">
    <!-- Navbar -->
    <nav class="navbar">
      <h2>Personal Finance Dashboard</h2>
      
      <div class="nav-links">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/dashboard/expenses">Expenses</router-link>
        <router-link to="/dashboard/income">Income</router-link>
        <router-link to="/dashboard/budgets">Budgets</router-link>
        <router-link to="/dashboard/investments">Investments</router-link>
        <router-link to="/" @click="logout">Logout</router-link>
      </div>
    </nav>

    <!-- Page content will render here -->
    <main>
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2025 Personal Finance Dashboard · Designed with 💚</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "DashboardLayout",
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #2e7d32;
  color: white;
  flex-wrap: wrap;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.navbar a {
  margin-left: 15px;
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.navbar a.router-link-exact-active {
  border-bottom: 2px solid white;
}

main {
  padding: 20px;
}

.footer {
  margin-top: 30px;
  text-align: center;
  padding: 15px;
  background: #f4f4f4;
  border-top: 1px solid #ddd;
}


</style>


