<template>
  <div class="space-y-6">
    <div class="grid sm:grid-cols-3 gap-4">
      <StatsCard title="Total Expenses" :value="formatCurrency(totalExpenses, baseCurrency)" icon="💸" variant="negative" />
      <StatsCard title="This Month" :value="formatCurrency(thisMonthTotal, baseCurrency)" icon="📅" />
      <StatsCard title="Entries" :value="expenseTransactions.length" icon="🧾" />
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <TransactionForm type="expense" :editing-transaction="editingTx" @done="editingTx = null" />
        <TransactionList :transactions="expenseTransactions" type="expense" @edit="editingTx = $event" />
      </div>
      <div>
        <InsightsPanel />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useCurrency } from '../composables/useCurrency'
import { formatCurrency } from '../lib/currency'
import StatsCard from '../components/StatsCard.vue'
import TransactionForm from '../components/TransactionForm.vue'
import TransactionList from '../components/TransactionList.vue'
import InsightsPanel from '../components/InsightsPanel.vue'

const finance = useFinanceStore()
const { baseCurrency } = useCurrency()
const editingTx = ref(null)

const expenseTransactions = computed(() => finance.transactions.filter((t) => t.type === 'expense'))
const totalExpenses = computed(() => finance.totalExpenses)

const thisMonthTotal = computed(() => {
  const now = new Date()
  return expenseTransactions.value
    .filter((t) => {
      const d = new Date(t.occurred_on)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((s, t) => s + Number(t.amount), 0)
})
</script>
