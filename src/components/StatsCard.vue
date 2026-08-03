<template>
  <div class="card p-5" :class="glow && glowClass">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ title }}</span>
      <span class="text-xl">{{ icon }}</span>
    </div>
    <p class="text-2xl font-bold" :class="valueClass">{{ value }}</p>
    <p v-if="subtext" class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ subtext }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: '💰' },
  subtext: { type: String, default: '' },
  variant: { type: String, default: 'default' }, // default | positive | negative
  glow: { type: Boolean, default: false }
})

const valueClass = computed(() => ({
  positive: 'text-primary-600 dark:text-primary-400',
  negative: 'text-red-600 dark:text-red-400',
  default: 'text-gray-900 dark:text-white'
}[props.variant]))

const glowClass = computed(() => ({
  positive: 'ring-1 ring-primary-200 dark:ring-primary-900',
  negative: 'ring-1 ring-red-200 dark:ring-red-900',
  default: ''
}[props.variant]))
</script>
