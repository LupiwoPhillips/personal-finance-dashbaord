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

.dashboard-layout{

    min-height:100vh;

    background:#0f172a;

}


/* NAVBAR */

.navbar{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:20px 40px;

    background:#111827;

    border-bottom:1px solid rgba(255,255,255,.06);

}


.navbar h2{

    color:white;

}


.nav-links{

    display:flex;

    gap:20px;

    align-items:center;

}


.navbar a{

    color:#94a3b8;

    text-decoration:none;

    font-weight:500;

    transition:.2s;

}


.navbar a:hover{

    color:#22c55e;

}


.navbar a.router-link-exact-active{

    color:#22c55e;

}



/* FOOTER */

.footer{

    text-align:center;

    padding:20px;

    color:#64748b;

    border-top:1px solid rgba(255,255,255,.06);

}



/* TABLET */

@media(max-width:900px){

.navbar{

    padding:20px;

    flex-direction:column;

    gap:20px;

}


.nav-links{

    width:100%;

    justify-content:center;

    flex-wrap:wrap;

}


}



/* MOBILE */

@media(max-width:600px){


.navbar h2{

    font-size:1.2rem;

}


.nav-links{

    flex-direction:column;

    gap:15px;

}


}

</style>