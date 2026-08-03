<template>
  <router-view v-if="ready" />
  <div v-else class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div class="flex flex-col items-center gap-3">
      <div class="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-500 dark:text-gray-400 text-sm">Loading your dashboard…</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { useFinanceStore } from './stores/finance'

const auth = useAuthStore()
const finance = useFinanceStore()
const ready = ref(false)

onMounted(async () => {
  await auth.init()
  if (auth.isAuthenticated) {
    await finance.fetchAll()
    await finance.processDueRecurringRules()
  }
  ready.value = true
})

watch(
  () => auth.isAuthenticated,
  async (isAuthed, wasAuthed) => {
    if (isAuthed && !wasAuthed) {
      await finance.fetchAll()
      await finance.processDueRecurringRules()
    } else if (!isAuthed && wasAuthed) {
      finance.reset()
    }
  }
)
</script>
