<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back{{ firstName ? `, ${firstName}` : '' }} 👋</h2>
      <p class="text-gray-500 dark:text-gray-400">Here's an overview of your finances.</p>
    </div>

    <div class="grid sm:grid-cols-3 gap-4">
      <StatsCard title="Total Income" :value="formatCurrency(finance.totalIncome, baseCurrency)" icon="💵" variant="positive" />
      <StatsCard title="Total Expenses" :value="formatCurrency(finance.totalExpenses, baseCurrency)" icon="💸" variant="negative" />
      <StatsCard
        title="Net Balance"
        :value="formatCurrency(finance.netBalance, baseCurrency)"
        icon="💎"
        :variant="finance.netBalance >= 0 ? 'positive' : 'negative'"
      />
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 card p-5">
        <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">Income vs Expenses (last 6 months)</h3>
        <div class="h-72">
          <ChartWidget type="bar" :data="monthlyChartData" :options="monthlyChartOptions" />
        </div>
      </div>
      <div class="card p-5">
        <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">Spending by Category</h3>
        <div class="h-72" v-if="hasSpendingData">
          <ChartWidget type="doughnut" :data="categoryChartData" :options="{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }" />
        </div>
        <div v-else class="h-72 flex items-center justify-center text-gray-400 text-sm text-center px-6">
          Add some expenses to see your spending breakdown.
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <router-link v-for="q in quickLinks" :key="q.to" :to="q.to" class="card p-5 hover:-translate-y-0.5 transition-transform">
        <div class="text-2xl mb-2">{{ q.icon }}</div>
        <h4 class="font-semibold text-gray-800 dark:text-gray-100">{{ q.title }}</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ q.desc }}</p>
      </router-link>
    </div>

    <InsightsPanel />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useAuthStore } from '../stores/auth'
import { useCurrency } from '../composables/useCurrency'
import { formatCurrency } from '../lib/currency'
import StatsCard from '../components/StatsCard.vue'
import ChartWidget from '../components/ChartWidget.vue'
import InsightsPanel from '../components/InsightsPanel.vue'

const finance = useFinanceStore()
const auth = useAuthStore()
const { baseCurrency } = useCurrency()

const firstName = computed(() => (auth.profile?.full_name || '').split(' ')[0])

const quickLinks = [
  { to: '/dashboard/budgets', icon: '📊', title: 'Budgets', desc: 'Set limits and track spending.' },
  { to: '/dashboard/goals', icon: '🎯', title: 'Goals', desc: 'Save toward what matters.' },
  { to: '/dashboard/reports', icon: '📑', title: 'Reports', desc: 'Export monthly & yearly summaries.' }
]

const monthlyChartData = computed(() => ({
  labels: finance.monthlySeries.map((m) => m.label),
  datasets: [
    { label: 'Income', data: finance.monthlySeries.map((m) => m.income), backgroundColor: '#22c55e', borderRadius: 6 },
    { label: 'Expenses', data: finance.monthlySeries.map((m) => m.expense), backgroundColor: '#ef4444', borderRadius: 6 }
  ]
}))

const monthlyChartOptions = {
  plugins: { legend: { position: 'bottom' } },
  scales: { y: { beginAtZero: true } }
}

const hasSpendingData = computed(() => Object.keys(finance.spendingByCategory).length > 0)

const categoryChartData = computed(() => {
  const entries = Object.entries(finance.spendingByCategory)
  return {
    labels: entries.map(([name]) => name),
    datasets: [
      {
        data: entries.map(([, v]) => v.total),
        backgroundColor: entries.map(([, v]) => v.color),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }
})
</script>
