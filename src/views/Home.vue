<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900">
    <nav class="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
      <div class="flex items-center gap-2 font-bold text-xl text-primary-700 dark:text-primary-400">
        <span>💰</span> FinTrack
      </div>
      <div class="flex gap-3">
        <router-link to="/login" class="btn-secondary">Log In</router-link>
        <router-link to="/signup" class="btn-primary">Get Started</router-link>
      </div>
    </nav>

    <section class="text-center px-6 py-20 max-w-3xl mx-auto">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
        Take control of your finances
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Track expenses and income, set budgets and goals, monitor investments, and get clear insights — all in one dashboard.
      </p>
      <div class="flex justify-center gap-4">
        <router-link to="/signup" class="btn-primary text-base px-6 py-3">Create free account</router-link>
        <router-link to="/login" class="btn-secondary text-base px-6 py-3">I have an account</router-link>
      </div>
    </section>

    <section class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-6 pb-24">
      <div v-for="f in features" :key="f.title" class="card p-6">
        <div class="text-3xl mb-3">{{ f.icon }}</div>
        <h3 class="font-semibold text-lg mb-1 text-gray-900 dark:text-white">{{ f.title }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ f.desc }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const features = [
  { icon: '💸', title: 'Expense Categories', desc: 'Organize spending into clear, customizable categories.' },
  { icon: '🎯', title: 'Goal Tracking', desc: 'Set savings goals and watch your progress in real time.' },
  { icon: '🔁', title: 'Recurring Transactions', desc: 'Automate rent, salary, and subscriptions.' },
  { icon: '📊', title: 'Visual Reports', desc: 'Interactive charts for monthly and yearly trends.' },
  { icon: '📤', title: 'PDF & CSV Export', desc: 'Download reports for taxes or record-keeping.' },
  { icon: '🔔', title: 'Budget Alerts', desc: 'Get notified before you overspend.' },
  { icon: '🌍', title: 'Multi-Currency', desc: 'Track finances across currencies with live rates.' },
  { icon: '🤖', title: 'Smart Insights', desc: 'Personalized recommendations based on your habits.' }
]
</script>
