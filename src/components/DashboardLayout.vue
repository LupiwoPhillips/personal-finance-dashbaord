<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
    <!-- Sidebar (desktop) -->
    <aside class="hidden lg:flex flex-col w-64 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <router-link to="/" class="flex items-center gap-2 font-bold text-xl text-primary-700 dark:text-primary-400 px-2 mb-8">
        <span>💰</span> FinTrack
      </router-link>
      <nav class="flex flex-col gap-1 flex-1">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          active-class="!bg-primary-50 dark:!bg-primary-950/50 !text-primary-700 dark:!text-primary-400"
          exact-active-class="!bg-primary-50 dark:!bg-primary-950/50 !text-primary-700 dark:!text-primary-400"
        >
          <span class="text-lg">{{ link.icon }}</span> {{ link.label }}
        </router-link>
      </nav>
      <button @click="handleLogout" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors">
        <span class="text-lg">🚪</span> Logout
      </button>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <header class="flex items-center justify-between gap-3 px-4 lg:px-8 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <button class="lg:hidden text-2xl" @click="mobileOpen = true" aria-label="Open menu">☰</button>
        <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">{{ pageTitle }}</h1>
        <div class="flex items-center gap-2">
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
            aria-label="Toggle dark mode"
          >
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <NotificationBell />
          <div class="hidden sm:flex items-center gap-2 pl-2 ml-1 border-l border-gray-200 dark:border-gray-700">
            <div class="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-semibold">
              {{ initials }}
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 lg:p-8 overflow-x-hidden">
        <router-view />
      </main>

      <footer class="text-center text-xs text-gray-400 dark:text-gray-600 py-6">
        © {{ new Date().getFullYear() }} FinTrack · Built with Vue &amp; Supabase
      </footer>
    </div>

    <!-- Mobile sidebar -->
    <div v-if="mobileOpen" class="lg:hidden fixed inset-0 z-50 flex">
      <div class="absolute inset-0 bg-black/40" @click="mobileOpen = false"></div>
      <aside class="relative w-64 bg-white dark:bg-gray-900 p-4 flex flex-col h-full">
        <div class="flex items-center justify-between mb-8">
          <span class="flex items-center gap-2 font-bold text-xl text-primary-700 dark:text-primary-400">💰 FinTrack</span>
          <button @click="mobileOpen = false" class="text-2xl" aria-label="Close menu">✕</button>
        </div>
        <nav class="flex flex-col gap-1 flex-1">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            @click="mobileOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            active-class="!bg-primary-50 dark:!bg-primary-950/50 !text-primary-700 dark:!text-primary-400"
          >
            <span class="text-lg">{{ link.icon }}</span> {{ link.label }}
          </router-link>
        </nav>
        <button @click="handleLogout" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400">
          <span class="text-lg">🚪</span> Logout
        </button>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../composables/useTheme'
import NotificationBell from './NotificationBell.vue'

const links = [
  { to: '/dashboard', label: 'Overview', icon: '🏠' },
  { to: '/dashboard/expenses', label: 'Expenses', icon: '💸' },
  { to: '/dashboard/income', label: 'Income', icon: '💵' },
  { to: '/dashboard/budgets', label: 'Budgets', icon: '📊' },
  { to: '/dashboard/goals', label: 'Goals', icon: '🎯' },
  { to: '/dashboard/investments', label: 'Investments', icon: '📈' },
  { to: '/dashboard/recurring', label: 'Recurring', icon: '🔁' },
  { to: '/dashboard/reports', label: 'Reports', icon: '📑' },
  { to: '/dashboard/settings', label: 'Settings', icon: '⚙️' }
]

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { theme, toggleTheme } = useTheme()
const mobileOpen = ref(false)

const isDark = computed(() => {
  if (theme.value === 'dark') return true
  if (theme.value === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
})

const pageTitle = computed(() => {
  const found = links.find((l) => l.to === route.path)
  return found ? found.label : 'Dashboard'
})

const initials = computed(() => {
  const name = auth.profile?.full_name || auth.user?.email || '?'
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

async function handleLogout() {
  await auth.signOut()
  router.push('/login')
}
</script>
