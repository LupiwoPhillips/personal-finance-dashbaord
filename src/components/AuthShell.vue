<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900 px-4">
    <div class="w-full max-w-md">
      <router-link to="/" class="flex items-center justify-center gap-2 font-bold text-2xl text-primary-700 dark:text-primary-400 mb-8">
        <span>💰</span> FinTrack
      </router-link>
      <div class="card p-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ title }}</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ subtitle }}</p>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>
