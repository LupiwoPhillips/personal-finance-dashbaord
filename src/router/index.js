import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import DashboardLayout from '../components/DashboardLayout.vue'
import Dashboard from '../components/Dashboard.vue'
import Expenses from '../components/Expenses.vue'
import Income from '../components/Income.vue'
import Budgets from '../components/Budgets.vue'
import Investments from '../components/Investments.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'expenses', name: 'Expenses', component: Expenses },
      { path: 'income', name: 'Income', component: Income },
      { path: 'budgets', name: 'Budgets', component: Budgets },
      { path: 'investments', name: 'Investments', component: Investments }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("user")
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
