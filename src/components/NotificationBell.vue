<template>
  <div class="relative">
    <button
      @click="open = !open"
      class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Notifications"
    >
      <span class="text-xl">🔔</span>
      <span
        v-if="finance.unreadNotificationCount > 0"
        class="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
      >
        {{ finance.unreadNotificationCount > 9 ? '9+' : finance.unreadNotificationCount }}
      </span>
    </button>

    <div
      v-if="open"
      v-click-outside="() => (open = false)"
      class="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto card p-2 z-50"
    >
      <div class="flex items-center justify-between px-2 py-1">
        <h4 class="font-semibold text-sm text-gray-700 dark:text-gray-200">Notifications</h4>
        <button
          v-if="finance.unreadNotificationCount > 0"
          @click="finance.markAllNotificationsRead()"
          class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
        >
          Mark all read
        </button>
      </div>
      <div v-if="finance.notifications.length === 0" class="text-sm text-gray-400 text-center py-6">
        No notifications yet
      </div>
      <button
        v-for="n in finance.notifications"
        :key="n.id"
        @click="finance.markNotificationRead(n.id)"
        class="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex gap-2"
        :class="!n.read && 'bg-primary-50 dark:bg-primary-950/30'"
      >
        <span class="text-lg">{{ iconFor(n.type) }}</span>
        <span class="flex-1 min-w-0">
          <span class="block text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{{ n.title }}</span>
          <span class="block text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ n.message }}</span>
        </span>
        <span v-if="!n.read" class="h-2 w-2 rounded-full bg-primary-500 mt-1 shrink-0"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFinanceStore } from '../stores/finance'

const finance = useFinanceStore()
const open = ref(false)

function iconFor(type) {
  return { budget_alert: '🚨', goal_milestone: '🏆', recurring_due: '🔁', system: 'ℹ️' }[type] || '🔔'
}

const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) binding.value(event)
    }
    document.addEventListener('click', el._clickOutside, true)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside, true)
  }
}
</script>
