<template>
  <div class="card p-5">
    <div class="flex items-center gap-2 mb-4">
      <span class="text-xl">🤖</span>
      <h3 class="font-semibold text-gray-800 dark:text-gray-100">Smart Insights</h3>
    </div>
    <div class="space-y-3">
      <div
        v-for="(insight, i) in insights"
        :key="i"
        class="flex gap-3 p-3 rounded-xl"
        :class="bgFor(insight.type)"
      >
        <span class="text-lg shrink-0">{{ insight.icon }}</span>
        <div>
          <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ insight.title }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400">{{ insight.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useCurrency } from '../composables/useCurrency'
import { generateInsights } from '../lib/insights'

const finance = useFinanceStore()
const { baseCurrency } = useCurrency()

const insights = computed(() =>
  generateInsights({
    transactions: finance.transactions,
    budgets: finance.budgets,
    goals: finance.goals,
    currency: baseCurrency.value
  })
)

function bgFor(type) {
  return {
    warning: 'bg-amber-50 dark:bg-amber-950/30',
    positive: 'bg-primary-50 dark:bg-primary-950/30',
    info: 'bg-blue-50 dark:bg-blue-950/30'
  }[type] || 'bg-gray-50 dark:bg-gray-800'
}
</script>
