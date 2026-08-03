import { ref, watch } from 'vue'

const THEME_KEY = 'pfd-theme' // 'light' | 'dark' | 'system'
const theme = ref(localStorage.getItem(THEME_KEY) || 'system')

function applyTheme(value) {
  const isDark =
    value === 'dark' || (value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

watch(theme, (value) => {
  localStorage.setItem(THEME_KEY, value)
  applyTheme(value)
}, { immediate: true })

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (theme.value === 'system') applyTheme('system')
})

export function useTheme() {
  function setTheme(value) {
    theme.value = value
  }
  function toggleTheme() {
    theme.value = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
  }
  return { theme, setTheme, toggleTheme }
}
