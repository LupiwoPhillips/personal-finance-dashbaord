<template>
  <div class="card p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-800 dark:text-gray-100">History</h3>
      <span class="text-sm text-gray-400">{{ transactions.length }} entries</span>
    </div>
    <div v-if="transactions.length === 0" class="text-center py-10 text-gray-400">
      <p class="text-3xl mb-2">📭</p>
      <p class="text-sm">No {{ type }} transactions yet</p>
    </div>
    <div v-else class="space-y-2">
      <div
        v-for="t in transactions"
        :key="t.id"
        class="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-xl shrink-0">{{ t.categories?.icon || '📦' }}</span>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
              {{ t.categories?.name || 'Uncategorized' }}
              <span v-if="t.is_recurring" class="ml-1 text-xs text-primary-600 dark:text-primary-400">🔁</span>
            </p>
            <p class="text-xs text-gray-400 truncate">{{ t.description || '—' }} · {{ formatDate(t.occurred_on) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="font-semibold" :class="type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'">
            {{ type === 'expense' ? '-' : '+' }}{{ formatCurrency(t.amount, t.currency) }}
          </span>
          <button @click="$emit('edit', t)" class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm" aria-label="Edit">✏️</button>
          <button @click="confirmDelete(t.id)" class="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 text-sm" aria-label="Delete">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '../lib/currency'
import { useFinanceStore } from '../stores/finance'

const props = defineProps({
  transactions: { type: Array, required: true },
  type: { type: String, required: true }
})
defineEmits(['edit'])
const finance = useFinanceStore()

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function confirmDelete(id) {
  if (confirm('Delete this transaction? This cannot be undone.')) {
    await finance.deleteTransaction(id)
  }
}
</script>
