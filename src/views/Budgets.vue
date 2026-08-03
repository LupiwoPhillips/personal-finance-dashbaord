<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h2>
        <p class="text-gray-500 dark:text-gray-400">Set spending limits per category and get alerted before you go over.</p>
      </div>
      <button class="btn-primary" @click="showForm = !showForm">{{ showForm ? 'Close' : '+ New Budget' }}</button>
    </div>

    <form v-if="showForm" @submit.prevent="submit" class="card p-5 grid sm:grid-cols-4 gap-4 items-end">
      <div>
        <label class="label">Category</label>
        <select v-model="form.category_id" class="input" required>
          <option value="" disabled>Select</option>
          <option v-for="c in availableCategories" :key="c.id" :value="c.id">{{ c.icon }} {{ c.name }}</option>
        </select>
      </div>
      <div>
        <label class="label">Amount ({{ baseCurrency }})</label>
        <input v-model.number="form.amount" type="number" min="1" step="0.01" class="input" required />
      </div>
      <div>
        <label class="label">Period</label>
        <select v-model="form.period" class="input">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div>
        <label class="label">Alert at (%)</label>
        <input v-model.number="form.alert_threshold_pct" type="number" min="1" max="100" class="input" />
      </div>
      <button type="submit" class="btn-primary sm:col-span-4" :disabled="saving">{{ saving ? 'Saving…' : 'Save Budget' }}</button>
    </form>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="b in finance.budgets" :key="b.id" class="card p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-100">
            <span class="text-xl">{{ b.categories?.icon || '📦' }}</span> {{ b.categories?.name || 'Category' }}
          </span>
          <button @click="remove(b.id)" class="text-sm p-1 rounded hover:bg-red-100 dark:hover:bg-red-950" aria-label="Delete">🗑️</button>
        </div>
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-500 dark:text-gray-400">{{ formatCurrency(spentFor(b), baseCurrency) }} spent</span>
          <span class="text-gray-400">of {{ formatCurrency(b.amount, baseCurrency) }}</span>
        </div>
        <div class="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="pctFor(b) >= 100 ? 'bg-red-500' : pctFor(b) >= (b.alert_threshold_pct || 80) ? 'bg-amber-500' : 'bg-primary-500'"
            :style="{ width: Math.min(pctFor(b), 100) + '%' }"
          ></div>
        </div>
        <p class="text-xs mt-2" :class="pctFor(b) >= 100 ? 'text-red-500' : 'text-gray-400'">
          {{ pctFor(b) >= 100 ? 'Over budget' : `${pctFor(b).toFixed(0)}% used` }} · {{ b.period }}
        </p>
      </div>
      <div v-if="finance.budgets.length === 0" class="col-span-full text-center py-16 text-gray-400">
        <p class="text-3xl mb-2">📊</p>
        <p class="text-sm">No budgets yet. Create one to start tracking limits.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useCurrency } from '../composables/useCurrency'
import { formatCurrency } from '../lib/currency'

const finance = useFinanceStore()
const { baseCurrency } = useCurrency()
const showForm = ref(false)
const saving = ref(false)

const form = reactive({ category_id: '', amount: null, period: 'monthly', alert_threshold_pct: 80 })

const availableCategories = computed(() =>
  finance.expenseCategories.filter((c) => !finance.budgets.some((b) => b.category_id === c.id))
)

function spentFor(budget) {
  return finance.transactions
    .filter((t) => t.type === 'expense' && t.category_id === budget.category_id)
    .reduce((s, t) => s + Number(t.amount), 0)
}

function pctFor(budget) {
  const spent = spentFor(budget)
  return (spent / Number(budget.amount)) * 100
}

async function submit() {
  saving.value = true
  await finance.addBudget({ ...form, currency: baseCurrency.value })
  saving.value = false
  Object.assign(form, { category_id: '', amount: null, period: 'monthly', alert_threshold_pct: 80 })
  showForm.value = false
}

async function remove(id) {
  if (confirm('Delete this budget?')) await finance.deleteBudget(id)
}
</script>
