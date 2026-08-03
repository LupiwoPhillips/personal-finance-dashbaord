<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  type: { type: String, required: true }, // 'doughnut' | 'bar' | 'line' | 'pie'
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) }
})

const canvasRef = ref(null)
let chartInstance = null

function render() {
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(canvasRef.value, {
    type: props.type,
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...props.options
    }
  })
}

onMounted(render)
onBeforeUnmount(() => chartInstance?.destroy())
watch(() => [props.data, props.type], render, { deep: true })
</script>
