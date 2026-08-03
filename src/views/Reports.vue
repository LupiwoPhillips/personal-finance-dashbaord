<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Reports</h2>
        <p class="text-gray-500 dark:text-gray-400">Review and export your financial activity.</p>
      </div>
      <div class="flex gap-2">
        <select v-model="period" class="input w-auto">
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
        <button class="btn-secondary" @click="handleExportCSV">⬇ CSV</button>
        <button class="btn-secondary" @click="handleExportPDF">⬇ PDF</button>
      </div>
    </div>

    <div class="grid sm:grid-cols-3 gap-4">
      <StatsCard title="Income" :value="formatCurrency(periodIncome, baseCurrency)" icon="💵" variant="positive" />
      <StatsCard title="Expenses" :value="formatCurrency(periodExpenses, baseCurrency)" icon="💸" variant="negative" />
      <StatsCard title="Net" :value="formatCurrency(periodIncome - periodExpenses, baseCurrency)" icon="💎" :variant="periodIncome - periodExpenses >= 0 ? 'positive' : 'negative'" />
    </div>

    <div class="card p-5">
      <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">Category Breakdown</h3>
      <div v-if="categoryBreakdown.length === 0" class="text-center py-10 text-gray-400 text-sm">
        No transactions in this period.
      </div>
      <div v-else class="space-y-3">
        <div v-for="row in categoryBreakdown" :key="row.name" class="flex items-center gap-3">
          <span class="text-sm w-32 shrink-0 truncate text-gray-600 dark:text-gray-300">{{ row.name }}</span>
          <div class="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div class="h-full rounded-full" :style="{ width: row.pct + '%', backgroundColor: row.color }"></div>
          </div>
          <span class="text-sm w-24 text-right text-gray-500 dark:text-gray-400">{{ formatCurrency(row.total, baseCurrency) }}</span>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">All Transactions ({{ filteredTransactions.length }})</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-400 border-b border-gray-100 dark:border-gray-800">
              <th class="py-2 pr-4">Date</th>
              <th class="py-2 pr-4">Type</th>
              <th class="py-2 pr-4">Category</th>
              <th class="py-2 pr-4">Description</th>
              <th class="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in filteredTransactions" :key="t.id" class="border-b border-gray-50 dark:border-gray-900">
              <td class="py-2 pr-4 text-gray-500 dark:text-gray-400">{{ t.occurred_on }}</td>
              <td class="py-2 pr-4 capitalize">{{ t.type }}</td>
              <td class="py-2 pr-4">{{ t.categories?.name || 'Uncategorized' }}</td>
              <td class="py-2 pr-4 text-gray-500 dark:text-gray-400">{{ t.description || '—' }}</td>
              <td class="py-2 text-right font-medium" :class="t.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'">
                {{ formatCurrency(t.amount, t.currency) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useCurrency } from '../composables/useCurrency'
import { formatCurrency } from '../lib/currency'
import { exportToCSV, exportToPDF, buildTransactionRowsForExport } from '../lib/exporters'
import StatsCard from '../components/StatsCard.vue'

const finance = useFinanceStore()
const { baseCurrency } = useCurrency()
const period = ref('month')

const filteredTransactions = computed(() => {
  const now = new Date()
  return finance.transactions.filter((t) => {
    const d = new Date(t.occurred_on)
    if (period.value === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    if (period.value === 'year') return d.getFullYear() === now.getFullYear()
    return true
  })
})

const periodIncome = computed(() =>
  filteredTransactions.value.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
)
const periodExpenses = computed(() =>
  filteredTransactions.value.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
)

const categoryBreakdown = computed(() => {
  const map = {}
  filteredTransactions.value
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const name = t.categories?.name || 'Uncategorized'
      const color = t.categories?.color || '#6b7280'
      if (!map[name]) map[name] = { total: 0, color }
      map[name].total += Number(t.amount)
    })
  const max = Math.max(...Object.values(map).map((v) => v.total), 1)
  return Object.entries(map)
    .map(([name, v]) => ({ name, total: v.total, color: v.color, pct: (v.total / max) * 100 }))
    .sort((a, b) => b.total - a.total)
})

const periodLabel = computed(() => ({ month: 'This Month', year: 'This Year', all: 'All Time' }[period.value]))

function handleExportCSV() {
  exportToCSV(`finance-report-${period.value}`, buildTransactionRowsForExport(filteredTransactions.value, baseCurrency.value))
}

function handleExportPDF() {
  exportToPDF({
    title: 'Financial Report',
    subtitle: `${periodLabel.value} · Generated ${new Date().toLocaleDateString()}`,
    summary: [
      `Income: ${formatCurrency(periodIncome.value, baseCurrency.value)}`,
      `Expenses: ${formatCurrency(periodExpenses.value, baseCurrency.value)}`,
      `Net: ${formatCurrency(periodIncome.value - periodExpenses.value, baseCurrency.value)}`
    ],
    columns: [
      { header: 'Date', key: 'Date' },
      { header: 'Type', key: 'Type' },
      { header: 'Category', key: 'Category' },
      { header: 'Description', key: 'Description' },
      { header: 'Amount', key: 'Amount' }
    ],
    rows: buildTransactionRowsForExport(filteredTransactions.value, baseCurrency.value)
  })
}
</script>
