<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Investments</h2>
        <p class="text-gray-500 dark:text-gray-400">Track your portfolio value and performance.</p>
      </div>
      <button class="btn-primary" @click="showForm = !showForm">{{ showForm ? 'Close' : '+ New Investment' }}</button>
    </div>

    <div class="grid sm:grid-cols-3 gap-4">
      <StatsCard title="Portfolio Value" :value="formatCurrency(totalValue, baseCurrency)" icon="💼" />
      <StatsCard title="Total Invested" :value="formatCurrency(totalCost, baseCurrency)" icon="💰" />
      <StatsCard
        title="Gain / Loss"
        :value="`${formatCurrency(totalGain, baseCurrency)} (${gainPct.toFixed(1)}%)`"
        icon="📈"
        :variant="totalGain >= 0 ? 'positive' : 'negative'"
      />
    </div>

    <form v-if="showForm" @submit.prevent="submit" class="card p-5 grid sm:grid-cols-3 gap-4 items-end">
      <div>
        <label class="label">Name</label>
        <input v-model="form.name" type="text" class="input" required placeholder="e.g. S&P 500 ETF" />
      </div>
      <div>
        <label class="label">Type</label>
        <select v-model="form.asset_type" class="input">
          <option value="stock">Stock</option>
          <option value="etf">ETF</option>
          <option value="bond">Bond</option>
          <option value="crypto">Crypto</option>
          <option value="property">Property</option>
          <option value="cash">Cash</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label class="label">Units</label>
        <input v-model.number="form.units" type="number" min="0" step="0.000001" class="input" />
      </div>
      <div>
        <label class="label">Cost basis ({{ baseCurrency }})</label>
        <input v-model.number="form.cost_basis" type="number" min="0" step="0.01" class="input" required />
      </div>
      <div>
        <label class="label">Current value ({{ baseCurrency }})</label>
        <input v-model.number="form.current_value" type="number" min="0" step="0.01" class="input" required />
      </div>
      <button type="submit" class="btn-primary sm:col-span-3" :disabled="saving">{{ saving ? 'Saving…' : 'Save Investment' }}</button>
    </form>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 card p-5">
        <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">Holdings</h3>
        <div v-if="finance.investments.length === 0" class="text-center py-10 text-gray-400">
          <p class="text-3xl mb-2">📈</p>
          <p class="text-sm">No investments logged yet.</p>
        </div>
        <div v-else class="space-y-2">
          <div v-for="inv in finance.investments" :key="inv.id" class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
            <div>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ inv.name }}</p>
              <p class="text-xs text-gray-400 capitalize">{{ inv.asset_type }} · {{ inv.units }} units</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-800 dark:text-gray-100">{{ formatCurrency(inv.current_value, baseCurrency) }}</p>
              <p class="text-xs" :class="gainFor(inv) >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-red-500'">
                {{ gainFor(inv) >= 0 ? '+' : '' }}{{ formatCurrency(gainFor(inv), baseCurrency) }}
              </p>
            </div>
            <button @click="remove(inv.id)" class="ml-3 p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950 text-sm" aria-label="Delete">🗑️</button>
          </div>
        </div>
      </div>
      <div class="card p-5">
        <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">Allocation</h3>
        <div class="h-64" v-if="finance.investments.length > 0">
          <ChartWidget type="doughnut" :data="allocationData" :options="{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }" />
        </div>
        <div v-else class="h-64 flex items-center justify-center text-gray-400 text-sm text-center px-4">
          Add investments to see allocation.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useCurrency } from '../composables/useCurrency'
import { formatCurrency } from '../lib/currency'
import StatsCard from '../components/StatsCard.vue'
import ChartWidget from '../components/ChartWidget.vue'

const finance = useFinanceStore()
const { baseCurrency } = useCurrency()
const showForm = ref(false)
const saving = ref(false)

const form = reactive({ name: '', asset_type: 'stock', units: 1, cost_basis: null, current_value: null })

const totalValue = computed(() => finance.investments.reduce((s, i) => s + Number(i.current_value), 0))
const totalCost = computed(() => finance.investments.reduce((s, i) => s + Number(i.cost_basis), 0))
const totalGain = computed(() => totalValue.value - totalCost.value)
const gainPct = computed(() => (totalCost.value > 0 ? (totalGain.value / totalCost.value) * 100 : 0))

function gainFor(inv) {
  return Number(inv.current_value) - Number(inv.cost_basis)
}

const palette = ['#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#eab308', '#06b6d4', '#ef4444']
const allocationData = computed(() => ({
  labels: finance.investments.map((i) => i.name),
  datasets: [
    {
      data: finance.investments.map((i) => i.current_value),
      backgroundColor: finance.investments.map((_, idx) => palette[idx % palette.length]),
      borderWidth: 2,
      borderColor: '#fff'
    }
  ]
}))

async function submit() {
  saving.value = true
  await finance.addInvestment({ ...form, currency: baseCurrency.value })
  saving.value = false
  Object.assign(form, { name: '', asset_type: 'stock', units: 1, cost_basis: null, current_value: null })
  showForm.value = false
}

async function remove(id) {
  if (confirm('Delete this investment?')) await finance.deleteInvestment(id)
}
</script>
