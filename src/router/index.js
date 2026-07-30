import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";

import DashboardLayout from "../components/DashboardLayout.vue";
import Dashboard from "../components/Dashboard.vue";
import Expenses from "../components/Expenses.vue";
import Income from "../components/Income.vue";
import Budgets from "../components/Budgets.vue";
import Investments from "../components/Investments.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "expenses",
        name: "Expenses",
        component: Expenses,
      },
      {
        path: "income",
        name: "Income",
        component: Income,
      },
      {
        path: "budgets",
        name: "Budgets",
        component: Budgets,
      },
      {
        path: "investments",
        name: "Investments",
        component: Investments,
      },
      {
        path: "/profile-setup",
        name: "ProfileSetup",
        component: () => import("../views/ProfileSetup.vue"),
        meta: {
        requiresAuth: true,
  },
},
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next();
  }

  const user = await getCurrentUser();

  if (user) {
    next();
  } else {
    next("/login");
  }
});

export default router;