<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Recurring Transactions</h2>
        <p class="text-gray-500 dark:text-gray-400">Automate rent, salary, subscriptions, and other repeating items.</p>
      </div>
      <button class="btn-primary" @click="showForm = !showForm">{{ showForm ? 'Close' : '+ New Rule' }}</button>
    </div>

    <form v-if="showForm" @submit.prevent="submit" class="card p-5 grid sm:grid-cols-3 gap-4 items-end">
      <div>
        <label class="label">Type</label>
        <select v-model="form.type" class="input">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div>
        <label class="label">Category</label>
        <select v-model="form.category_id" class="input" required>
          <option value="" disabled>Select</option>
          <option v-for="c in categoryOptions" :key="c.id" :value="c.id">{{ c.icon }} {{ c.name }}</option>
        </select>
      </div>
      <div>
        <label class="label">Amount ({{ baseCurrency }})</label>
        <input v-model.number="form.amount" type="number" min="0.01" step="0.01" class="input" required />
      </div>
      <div>
        <label class="label">Frequency</label>
        <select v-model="form.frequency" class="input">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div>
        <label class="label">Start date</label>
        <input v-model="form.start_date" type="date" class="input" required />
      </div>
      <div>
        <label class="label">Description (optional)</label>
        <input v-model="form.description" type="text" class="input" placeholder="e.g. Netflix subscription" />
      </div>
      <button type="submit" class="btn-primary sm:col-span-3" :disabled="saving">{{ saving ? 'Saving…' : 'Save Rule' }}</button>
    </form>

    <div class="card p-5">
      <div v-if="finance.recurringRules.length === 0" class="text-center py-10 text-gray-400">
        <p class="text-3xl mb-2">🔁</p>
        <p class="text-sm">No recurring rules yet. Add rent, salary, or subscriptions to automate entries.</p>
      </div>
      <div v-else class="space-y-2">
        <div v-for="r in finance.recurringRules" :key="r.id" class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ r.categories?.icon || '📦' }}</span>
            <div>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
                {{ r.description || r.categories?.name }}
                <span class="text-xs capitalize text-gray-400">· {{ r.frequency }}</span>
              </p>
              <p class="text-xs text-gray-400">Next: {{ formatDate(r.next_run_date) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-semibold" :class="r.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'">
              {{ r.type === 'expense' ? '-' : '+' }}{{ formatCurrency(r.amount, r.currency) }}
            </span>
            <button @click="remove(r.id)" class="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950 text-sm" aria-label="Delete">🗑️</button>
          </div>
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

const finance = useFinanceStore()
const { baseCurrency } = useCurrency()
const showForm = ref(false)
const saving = ref(false)

const form = reactive({
  type: 'expense',
  category_id: '',
  amount: null,
  frequency: 'monthly',
  start_date: new Date().toISOString().slice(0, 10),
  description: ''
})

const categoryOptions = computed(() => finance.categories.filter((c) => c.kind === form.type))

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function submit() {
  saving.value = true
  await finance.addRecurringRule({
    ...form,
    next_run_date: form.start_date,
    currency: baseCurrency.value
  })
  saving.value = false
  Object.assign(form, {
    type: 'expense',
    category_id: '',
    amount: null,
    frequency: 'monthly',
    start_date: new Date().toISOString().slice(0, 10),
    description: ''
  })
  showForm.value = false
}

async function remove(id) {
  if (confirm('Delete this recurring rule? Past transactions it created will remain.')) {
    await finance.deleteRecurringRule(id)
  }
}
</script>
