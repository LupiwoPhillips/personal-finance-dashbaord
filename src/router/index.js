import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue'), meta: { guestOnly: true } },
  { path: '/signup', name: 'Signup', component: () => import('../views/Signup.vue'), meta: { guestOnly: true } },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue')
  },
  {
    path: '/dashboard',
    component: () => import('../components/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'expenses', name: 'Expenses', component: () => import('../views/Expenses.vue') },
      { path: 'income', name: 'Income', component: () => import('../views/Income.vue') },
      { path: 'budgets', name: 'Budgets', component: () => import('../views/Budgets.vue') },
      { path: 'goals', name: 'Goals', component: () => import('../views/Goals.vue') },
      { path: 'investments', name: 'Investments', component: () => import('../views/Investments.vue') },
      { path: 'recurring', name: 'Recurring', component: () => import('../views/Recurring.vue') },
      { path: 'reports', name: 'Reports', component: () => import('../views/Reports.vue') },
      { path: 'settings', name: 'Settings', component: () => import('../views/Settings.vue') }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) await auth.init()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'Dashboard' }
  }
  return true
})

export default router
