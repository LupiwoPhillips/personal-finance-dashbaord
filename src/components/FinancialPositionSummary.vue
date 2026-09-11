<template>
  <section
    class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
  >
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Financial Position
        </h2>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          A snapshot of what you own and what you owe.
        </p>
      </div>

      <router-link
        to="/financial-position"
        class="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        View details →
      </router-link>
    </div>

    <!-- Net Worth -->
    <div class="mt-5 rounded-2xl bg-gray-50 p-5 dark:bg-gray-900">
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
        Net Worth
      </p>

      <p
        class="mt-1 text-3xl font-bold"
        :class="
          position.netWorth >= 0
            ? 'text-gray-900 dark:text-white'
            : 'text-red-600 dark:text-red-400'
        "
      >
        {{ formatCurrency(position.netWorth, baseCurrency) }}
      </p>

      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ netWorthMessage }}
      </p>
    </div>

    <!-- Position breakdown -->
    <div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <!-- Assets -->
      <div
        class="rounded-xl border border-gray-100 p-4 dark:border-gray-700"
      >
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
          Assets
        </p>

        <p class="mt-1 text-base font-semibold text-gray-900 dark:text-white">
          {{ formatCurrency(position.totalAssets, baseCurrency) }}
        </p>
      </div>

      <!-- Liabilities -->
      <div
        class="rounded-xl border border-gray-100 p-4 dark:border-gray-700"
      >
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
          Liabilities
        </p>

        <p class="mt-1 text-base font-semibold text-gray-900 dark:text-white">
          {{ formatCurrency(position.totalLiabilities, baseCurrency) }}
        </p>
      </div>

      <!-- Liquid Cash -->
      <div
        class="rounded-xl border border-gray-100 p-4 dark:border-gray-700"
      >
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
          Liquid Cash
        </p>

        <p class="mt-1 text-base font-semibold text-gray-900 dark:text-white">
          {{ formatCurrency(position.liquidCash, baseCurrency) }}
        </p>
      </div>

      <!-- Investments -->
      <div
        class="rounded-xl border border-gray-100 p-4 dark:border-gray-700"
      >
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
          Investments
        </p>

        <p class="mt-1 text-base font-semibold text-gray-900 dark:text-white">
          {{ formatCurrency(position.investmentValue, baseCurrency) }}
        </p>
      </div>
    </div>

    <!-- Debt information -->
    <div
      v-if="position.totalLiabilities > 0"
      class="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900"
    >
      <div class="flex items-start gap-3">
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm dark:bg-gray-700"
        >
          ℹ️
        </div>

        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            Debt represents
            {{ position.debtToAssetRatio.toFixed(1) }}%
            of your assets
          </p>

          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            PFD uses this alongside your cash flow, savings and goals to
            understand your broader financial position.
          </p>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="isEmpty"
      class="mt-4 rounded-xl border border-dashed border-gray-300 p-5 text-center dark:border-gray-600"
    >
      <p class="font-medium text-gray-900 dark:text-white">
        Build your financial picture
      </p>

      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add your accounts, assets and liabilities so PFD can understand your
        overall financial position.
      </p>

      <router-link
        to="/financial-position"
        class="mt-3 inline-flex rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        Add financial information
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

import { useFinanceStore } from '../stores/finance'
import { useCurrency } from '../composables/useCurrency'
import { formatCurrency } from '../lib/currency'

const finance = useFinanceStore()

const { baseCurrency } = useCurrency()

const position = computed(() => finance.financialPosition)

const isEmpty = computed(() => {
  return (
    Number(position.value.totalAssets || 0) === 0 &&
    Number(position.value.totalLiabilities || 0) === 0
  )
})

const netWorthMessage = computed(() => {
  const netWorth = Number(position.value.netWorth || 0)
  const assets = Number(position.value.totalAssets || 0)
  const liabilities = Number(position.value.totalLiabilities || 0)

  if (assets === 0 && liabilities === 0) {
    return 'Add your financial information to calculate your net worth.'
  }

  if (netWorth < 0) {
    return 'Your liabilities currently exceed your recorded assets.'
  }

  if (liabilities === 0) {
    return 'You currently have no recorded liabilities.'
  }

  if (assets > 0 && liabilities / assets <= 0.3) {
    return 'Your recorded liabilities are relatively small compared with your assets.'
  }

  if (assets > 0 && liabilities / assets <= 0.6) {
    return 'Your liabilities are a meaningful part of your current financial position.'
  }

  return 'Your liabilities are a significant part of your current financial position.'
})
</script>