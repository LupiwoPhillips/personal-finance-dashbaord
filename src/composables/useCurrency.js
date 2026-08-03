import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

/**
 * Exposes the user's base currency (from their profile, defaulting to ZAR)
 * so components can format amounts consistently without prop drilling.
 */
export function useCurrency() {
  const auth = useAuthStore()
  const baseCurrency = computed(() => auth.profile?.base_currency || 'ZAR')

  async function setBaseCurrency(code) {
    await auth.updateProfile({ base_currency: code })
  }

  return { baseCurrency, setBaseCurrency }
}
