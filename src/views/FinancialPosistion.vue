<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Financial Position
      </h1>

      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        See what you own, what you owe, and where you stand financially.
      </p>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Net Worth -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Net Worth
        </p>

        <p
          class="mt-2 text-2xl font-bold"
          :class="
            position.netWorth >= 0
              ? 'text-gray-900 dark:text-white'
              : 'text-red-600 dark:text-red-400'
          "
        >
          {{ formatCurrency(position.netWorth) }}
        </p>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          What you own minus what you owe
        </p>
      </div>

      <!-- Assets -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Assets
        </p>

        <p class="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
          {{ formatCurrency(position.totalAssets) }}
        </p>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Accounts, investments and other assets
        </p>
      </div>

      <!-- Liabilities -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Liabilities
        </p>

        <p class="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
          {{ formatCurrency(position.totalLiabilities) }}
        </p>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Debt and outstanding obligations
        </p>
      </div>

      <!-- Liquid Cash -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Liquid Cash
        </p>

        <p class="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
          {{ formatCurrency(position.liquidCash) }}
        </p>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Money currently available
        </p>
      </div>
    </div>

    <!-- Net worth explanation -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Your financial position
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            This is different from your monthly cash flow. Your net worth measures
            your overall financial position.
          </p>
        </div>

        <div class="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-900">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Debt-to-asset ratio
          </p>

          <p class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {{ position.debtToAssetRatio.toFixed(1) }}%
          </p>
        </div>
      </div>
    </div>

    <!-- Accounts -->
    <section class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="flex flex-col gap-3 border-b border-gray-200 p-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Accounts
          </h2>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            Bank accounts, savings, cash and credit cards.
          </p>
        </div>

        <button
          type="button"
          @click="openAccountForm"
          class="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          + Add account
        </button>
      </div>

      <div v-if="finance.accounts.length" class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="account in finance.accounts"
          :key="account.id"
          class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ account.name }}
            </p>

            <p class="mt-1 text-xs capitalize text-gray-500 dark:text-gray-400">
              {{ account.account_type?.replace('_', ' ') }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(account.current_balance) }}
            </p>

            <button
              type="button"
              @click="editAccount(account)"
              class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Edit
            </button>

            <button
              type="button"
              @click="removeAccount(account.id)"
              class="text-sm text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center">
        <p class="font-medium text-gray-900 dark:text-white">
          No accounts added yet
        </p>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add your bank, savings or credit card accounts to build your financial position.
        </p>
      </div>
    </section>

    <!-- Assets -->
    <section class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="flex flex-col gap-3 border-b border-gray-200 p-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Assets
          </h2>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            Things you own that have financial value.
          </p>
        </div>

        <button
          type="button"
          @click="openAssetForm"
          class="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          + Add asset
        </button>
      </div>

      <div v-if="finance.assets.length" class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="asset in finance.assets"
          :key="asset.id"
          class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ asset.name }}
            </p>

            <p class="mt-1 text-xs capitalize text-gray-500 dark:text-gray-400">
              {{ asset.asset_type?.replace('_', ' ') }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <p class="font-semibold text-green-600 dark:text-green-400">
              {{ formatCurrency(asset.current_value) }}
            </p>

            <button
              type="button"
              @click="editAsset(asset)"
              class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Edit
            </button>

            <button
              type="button"
              @click="removeAsset(asset.id)"
              class="text-sm text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center">
        <p class="font-medium text-gray-900 dark:text-white">
          No assets added yet
        </p>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add things such as a vehicle, property or valuable equipment.
        </p>
      </div>
    </section>

    <!-- Investments -->
    <section class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="border-b border-gray-200 p-5 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Investments
        </h2>

        <p class="text-sm text-gray-500 dark:text-gray-400">
          Your existing investment holdings are included automatically.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Investment value
          </p>

          <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
            {{ formatCurrency(position.investmentValue) }}
          </p>
        </div>

        <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Credit card debt
          </p>

          <p class="mt-1 text-xl font-semibold text-red-600 dark:text-red-400">
            {{ formatCurrency(position.creditCardDebt) }}
          </p>
        </div>
      </div>
    </section>

    <!-- Liabilities -->
    <section class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="flex flex-col gap-3 border-b border-gray-200 p-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Liabilities
          </h2>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            Loans and other outstanding debt.
          </p>
        </div>

        <button
          type="button"
          @click="openLiabilityForm"
          class="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          + Add liability
        </button>
      </div>

      <div v-if="finance.liabilities.length" class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="liability in finance.liabilities"
          :key="liability.id"
          class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ liability.name }}
            </p>

            <p class="mt-1 text-xs capitalize text-gray-500 dark:text-gray-400">
              {{ liability.liability_type?.replace('_', ' ') }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <p class="font-semibold text-red-600 dark:text-red-400">
              {{ formatCurrency(liability.current_balance) }}
            </p>

            <button
              type="button"
              @click="editLiability(liability)"
              class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Edit
            </button>

            <button
              type="button"
              @click="removeLiability(liability.id)"
              class="text-sm text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center">
        <p class="font-medium text-gray-900 dark:text-white">
          No liabilities added yet
        </p>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add loans, credit agreements or other outstanding debt.
        </p>
      </div>
    </section>

    <!-- Account Modal -->
    <div
      v-if="showAccountModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingAccount ? 'Edit account' : 'Add account' }}
          </h2>

          <button
            type="button"
            @click="closeAccountModal"
            class="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="saveAccount" class="mt-6 space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Account name
            </label>

            <input
              v-model="accountForm.name"
              required
              placeholder="e.g. Main Bank Account"
              class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Account type
            </label>

            <select
              v-model="accountForm.account_type"
              required
              class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="bank">Bank account</option>
              <option value="savings">Savings</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit card</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current balance
            </label>

            <input
              v-model.number="accountForm.current_balance"
              type="number"
              step="0.01"
              required
              class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeAccountModal"
              class="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
            >
              Save account
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Asset Modal -->
    <div
      v-if="showAssetModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingAsset ? 'Edit asset' : 'Add asset' }}
          </h2>

          <button
            type="button"
            @click="closeAssetModal"
            class="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="saveAsset" class="mt-6 space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Asset name
            </label>

            <input
              v-model="assetForm.name"
              required
              placeholder="e.g. Car"
              class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Asset type
            </label>

            <select
              v-model="assetForm.asset_type"
              required
              class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="property">Property</option>
              <option value="vehicle">Vehicle</option>
              <option value="equipment">Equipment</option>
              <option value="valuable">Valuable</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current value
            </label>

            <input
              v-model.number="assetForm.current_value"
              type="number"
              step="0.01"
              required
              class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeAssetModal"
              class="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
            >
              Save asset
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Liability Modal -->
    <div
      v-if="showLiabilityModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingLiability ? 'Edit liability' : 'Add liability' }}
          </h2>

          <button
            type="button"
            @click="closeLiabilityModal"
            class="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="saveLiability" class="mt-6 space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Liability name
            </label>

            <input
              v-model="liabilityForm.name"
              required
              placeholder="e.g. Personal Loan"
              class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Liability type
            </label>

            <select
              v-model="liabilityForm.liability_type"
              required
              class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="loan">Loan</option>
              <option value="credit">Credit</option>
              <option value="mortgage">Mortgage</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current balance
            </label>

            <input
              v-model.number="liabilityForm.current_balance"
              type="number"
              step="0.01"
              required
              class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeLiabilityModal"
              class="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
            >
              Save liability
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useCurrency } from '../composables/useCurrency'

const finance = useFinanceStore()
const { formatCurrency } = useCurrency()

const position = computed(() => finance.financialPosition)

// =====================================================
// ACCOUNT FORM
// =====================================================

const showAccountModal = ref(false)
const editingAccount = ref(null)

const accountForm = reactive({
  name: '',
  account_type: 'bank',
  current_balance: 0
})

function resetAccountForm() {
  accountForm.name = ''
  accountForm.account_type = 'bank'
  accountForm.current_balance = 0
}

function openAccountForm() {
  editingAccount.value = null
  resetAccountForm()
  showAccountModal.value = true
}

function editAccount(account) {
  editingAccount.value = account

  accountForm.name = account.name || ''
  accountForm.account_type =
    account.account_type || 'bank'
  accountForm.current_balance =
    Number(account.current_balance || 0)

  showAccountModal.value = true
}

function closeAccountModal() {
  showAccountModal.value = false
  editingAccount.value = null
  resetAccountForm()
}

async function saveAccount() {
  let result

  const payload = {
    name: accountForm.name.trim(),
    account_type: accountForm.account_type,
    current_balance: Number(
      accountForm.current_balance || 0
    )
  }

  if (editingAccount.value) {
    result = await finance.updateAccount(
      editingAccount.value.id,
      payload
    )
  } else {
    result = await finance.addAccount(payload)
  }

  if (result.error) {
    console.error(
      'Failed to save account:',
      result.error
    )

    alert(result.error.message)

    return
  }

  closeAccountModal()
}

async function removeAccount(id) {
  const confirmed = window.confirm(
    'Delete this account?'
  )

  if (!confirmed) return

  const result =
    await finance.deleteAccount(id)

  if (result.error) {
    alert(result.error.message)
  }
}

// =====================================================
// ASSET FORM
// =====================================================

const showAssetModal = ref(false)
const editingAsset = ref(null)

const assetForm = reactive({
  name: '',
  asset_type: 'other',
  current_value: 0
})

function resetAssetForm() {
  assetForm.name = ''
  assetForm.asset_type = 'other'
  assetForm.current_value = 0
}

function openAssetForm() {
  editingAsset.value = null
  resetAssetForm()
  showAssetModal.value = true
}

function editAsset(asset) {
  editingAsset.value = asset

  assetForm.name = asset.name || ''
  assetForm.asset_type =
    asset.asset_type || 'other'
  assetForm.current_value =
    Number(asset.current_value || 0)

  showAssetModal.value = true
}

function closeAssetModal() {
  showAssetModal.value = false
  editingAsset.value = null
  resetAssetForm()
}

async function saveAsset() {
  let result

  const payload = {
    name: assetForm.name.trim(),
    asset_type: assetForm.asset_type,
    current_value: Number(
      assetForm.current_value || 0
    )
  }

  if (editingAsset.value) {
    result = await finance.updateAsset(
      editingAsset.value.id,
      payload
    )
  } else {
    result = await finance.addAsset(payload)
  }

  if (result.error) {
    console.error(
      'Failed to save asset:',
      result.error
    )

    alert(result.error.message)

    return
  }

  closeAssetModal()
}

async function removeAsset(id) {
  const confirmed = window.confirm(
    'Delete this asset?'
  )

  if (!confirmed) return

  const result =
    await finance.deleteAsset(id)

  if (result.error) {
    alert(result.error.message)
  }
}

// =====================================================
// LIABILITY FORM
// =====================================================

const showLiabilityModal = ref(false)
const editingLiability = ref(null)

const liabilityForm = reactive({
  name: '',
  liability_type: 'loan',
  current_balance: 0
})

function resetLiabilityForm() {
  liabilityForm.name = ''
  liabilityForm.liability_type = 'loan'
  liabilityForm.current_balance = 0
}

function openLiabilityForm() {
  editingLiability.value = null
  resetLiabilityForm()
  showLiabilityModal.value = true
}

function editLiability(liability) {
  editingLiability.value = liability

  liabilityForm.name =
    liability.name || ''

  liabilityForm.liability_type =
    liability.liability_type || 'loan'

  liabilityForm.current_balance =
    Number(
      liability.current_balance || 0
    )

  showLiabilityModal.value = true
}

function closeLiabilityModal() {
  showLiabilityModal.value = false
  editingLiability.value = null
  resetLiabilityForm()
}

async function saveLiability() {
  let result

  const payload = {
    name: liabilityForm.name.trim(),
    liability_type:
      liabilityForm.liability_type,
    current_balance: Number(
      liabilityForm.current_balance || 0
    )
  }

  if (editingLiability.value) {
    result =
      await finance.updateLiability(
        editingLiability.value.id,
        payload
      )
  } else {
    result =
      await finance.addLiability(
        payload
      )
  }

  if (result.error) {
    console.error(
      'Failed to save liability:',
      result.error
    )

    alert(result.error.message)

    return
  }

  closeLiabilityModal()
}

async function removeLiability(id) {
  const confirmed = window.confirm(
    'Delete this liability?'
  )

  if (!confirmed) return

  const result =
    await finance.deleteLiability(id)

  if (result.error) {
    alert(result.error.message)
  }
}
</script>