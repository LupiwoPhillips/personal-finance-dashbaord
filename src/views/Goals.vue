<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Goals & Savings</h2>
        <p class="text-gray-500 dark:text-gray-400">Set targets and track your progress toward them.</p>
      </div>
      <button class="btn-primary" @click="showForm = !showForm">{{ showForm ? 'Close' : '+ New Goal' }}</button>
    </div>

    <form v-if="showForm" @submit.prevent="submit" class="card p-5 grid sm:grid-cols-4 gap-4 items-end">
      <div class="sm:col-span-2">
        <label class="label">Goal name</label>
        <input v-model="form.name" type="text" class="input" required placeholder="e.g. Emergency Fund" />
      </div>
      <div>
        <label class="label">Target amount ({{ baseCurrency }})</label>
        <input v-model.number="form.target_amount" type="number" min="1" step="0.01" class="input" required />
      </div>
      <div>
        <label class="label">Target date (optional)</label>
        <input v-model="form.target_date" type="date" class="input" />
      </div>
      <button type="submit" class="btn-primary sm:col-span-4" :disabled="saving">{{ saving ? 'Saving…' : 'Create Goal' }}</button>
    </form>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="g in finance.goals" :key="g.id" class="card p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-100">
            <span class="text-xl">{{ g.icon }}</span> {{ g.name }}
          </span>
          <button @click="remove(g.id)" class="text-sm p-1 rounded hover:bg-red-100 dark:hover:bg-red-950" aria-label="Delete">🗑️</button>
        </div>
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-500 dark:text-gray-400">{{ formatCurrency(g.current_amount, baseCurrency) }}</span>
          <span class="text-gray-400">of {{ formatCurrency(g.target_amount, baseCurrency) }}</span>
        </div>
        <div class="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            class="h-full rounded-full bg-primary-500 transition-all"
            :style="{ width: Math.min(pctFor(g), 100) + '%' }"
          ></div>
        </div>
        <p class="text-xs mt-2 text-gray-400">
          {{ pctFor(g).toFixed(0) }}% funded
          <span v-if="g.target_date"> · due {{ formatDate(g.target_date) }}</span>
        </p>
        <div class="flex gap-2 mt-4">
          <input v-model.number="contributionAmounts[g.id]" type="number" min="0.01" step="0.01" class="input" placeholder="Add amount" />
          <button class="btn-secondary shrink-0" @click="contribute(g.id)">Add</button>
        </div>
      </div>
      <div v-if="finance.goals.length === 0" class="col-span-full text-center py-16 text-gray-400">
        <p class="text-3xl mb-2">🎯</p>
        <p class="text-sm">No goals yet. Create one to start saving toward something.</p>
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
const contributionAmounts = reactive({})

const form = reactive({ name: '', target_amount: null, target_date: '' })

function pctFor(goal) {
  return (Number(goal.current_amount) / Number(goal.target_amount)) * 100
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function submit() {
  saving.value = true
  await finance.addGoal({
    name: form.name,
    target_amount: form.target_amount,
    target_date: form.target_date || null,
    currency: baseCurrency.value
  })
  saving.value = false
  Object.assign(form, { name: '', target_amount: null, target_date: '' })
  showForm.value = false
}

async function contribute(goalId) {
  const amount = contributionAmounts[goalId]
  if (!amount || amount <= 0) return
  await finance.addGoalContribution(goalId, amount)
  contributionAmounts[goalId] = null
}

async function remove(id) {
  if (confirm('Delete this goal? Contributions will also be removed.')) await finance.deleteGoal(id)
}
</script>
