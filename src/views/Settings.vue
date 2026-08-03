<template>
  <div class="space-y-6 max-w-2xl">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>

    <div class="card p-5 space-y-4">
      <h3 class="font-semibold text-gray-800 dark:text-gray-100">Profile</h3>
      <div>
        <label class="label">Full name</label>
        <input v-model="fullName" type="text" class="input" />
      </div>
      <div>
        <label class="label">Email</label>
        <input :value="auth.user?.email" type="email" class="input" disabled />
      </div>
      <button class="btn-primary" @click="saveProfile" :disabled="savingProfile">
        {{ savingProfile ? 'Saving…' : 'Save Profile' }}
      </button>
      <p v-if="profileSaved" class="text-sm text-primary-600 dark:text-primary-400">Saved.</p>
    </div>

    <div class="card p-5 space-y-4">
      <h3 class="font-semibold text-gray-800 dark:text-gray-100">Preferences</h3>
      <div>
        <label class="label">Base currency</label>
        <select v-model="currencyCode" @change="handleCurrencyChange" class="input">
          <option v-for="c in SUPPORTED_CURRENCIES" :key="c.code" :value="c.code">{{ c.symbol }} {{ c.name }} ({{ c.code }})</option>
        </select>
        <p class="text-xs text-gray-400 mt-1">New transactions will be recorded in this currency.</p>
      </div>
      <div>
        <label class="label">Theme</label>
        <div class="flex gap-2">
          <button
            v-for="opt in themeOptions"
            :key="opt.value"
            @click="setTheme(opt.value)"
            class="flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
            :class="theme === opt.value
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >
            {{ opt.icon }} {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="card p-5 space-y-4">
      <h3 class="font-semibold text-gray-800 dark:text-gray-100">Categories</h3>
      <div class="flex gap-2">
        <input v-model="newCategoryName" type="text" class="input" placeholder="New category name" />
        <select v-model="newCategoryKind" class="input w-32">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button class="btn-secondary shrink-0" @click="addCategory">Add</button>
      </div>
      <div class="grid sm:grid-cols-2 gap-2">
        <div v-for="c in finance.categories" :key="c.id" class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          <span class="text-sm">{{ c.icon }} {{ c.name }} <span class="text-xs text-gray-400 capitalize">({{ c.kind }})</span></span>
          <button v-if="!c.is_default" @click="removeCategory(c.id)" class="text-xs text-red-500 hover:underline">Remove</button>
        </div>
      </div>
    </div>

    <div class="card p-5 space-y-3">
      <h3 class="font-semibold text-gray-800 dark:text-gray-100">Account</h3>
      <button class="btn-danger" @click="handleLogout">Log out</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useFinanceStore } from '../stores/finance'
import { useTheme } from '../composables/useTheme'
import { SUPPORTED_CURRENCIES } from '../lib/currency'

const auth = useAuthStore()
const finance = useFinanceStore()
const router = useRouter()
const { theme, setTheme } = useTheme()

const fullName = ref(auth.profile?.full_name || '')
const savingProfile = ref(false)
const profileSaved = ref(false)
const currencyCode = ref(auth.profile?.base_currency || 'ZAR')
const newCategoryName = ref('')
const newCategoryKind = ref('expense')

const themeOptions = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '🖥️' }
]

watch(
  () => auth.profile,
  (p) => {
    if (p) {
      fullName.value = p.full_name || ''
      currencyCode.value = p.base_currency || 'ZAR'
    }
  }
)

async function saveProfile() {
  savingProfile.value = true
  await auth.updateProfile({ full_name: fullName.value })
  savingProfile.value = false
  profileSaved.value = true
  setTimeout(() => (profileSaved.value = false), 2000)
}

async function handleCurrencyChange() {
  await auth.updateProfile({ base_currency: currencyCode.value })
}

async function addCategory() {
  if (!newCategoryName.value.trim()) return
  const icon = newCategoryKind.value === 'income' ? '💵' : '📦'
  await finance.addCategory({ name: newCategoryName.value.trim(), kind: newCategoryKind.value, icon, color: '#6b7280' })
  newCategoryName.value = ''
}

async function removeCategory(id) {
  if (confirm('Remove this category? Existing transactions will keep their history but show as uncategorized.')) {
    await finance.deleteCategory(id)
  }
}

async function handleLogout() {
  await auth.signOut()
  router.push('/login')
}
</script>
