<template>
  <AuthShell title="Reset your password" subtitle="We'll email you a secure reset link">
    <form v-if="!sent && !hasRecoverySession" @submit.prevent="handleRequestReset" class="space-y-4">
      <div>
        <label class="label">Email</label>
        <input v-model="email" type="email" class="input" required placeholder="you@example.com" />
      </div>
      <p v-if="errorMsg" class="text-sm text-red-600 dark:text-red-400">{{ errorMsg }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Sending…' : 'Send reset link' }}
      </button>
    </form>

    <form v-else-if="hasRecoverySession" @submit.prevent="handleSetNewPassword" class="space-y-4">
      <div>
        <label class="label">New password</label>
        <input v-model="newPassword" type="password" class="input" required minlength="6" />
      </div>
      <p v-if="errorMsg" class="text-sm text-red-600 dark:text-red-400">{{ errorMsg }}</p>
      <p v-if="successMsg" class="text-sm text-primary-600 dark:text-primary-400">{{ successMsg }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Updating…' : 'Update password' }}
      </button>
    </form>

    <div v-else class="text-center py-4">
      <div class="text-4xl mb-3">📧</div>
      <p class="text-gray-700 dark:text-gray-200 font-medium">Check your email for a reset link.</p>
    </div>

    <p class="text-center text-sm mt-6 text-gray-500 dark:text-gray-400">
      <router-link to="/login" class="text-primary-600 dark:text-primary-400 font-medium hover:underline">Back to login</router-link>
    </p>
  </AuthShell>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'
import AuthShell from '../components/AuthShell.vue'

const email = ref('')
const newPassword = ref('')
const loading = ref(false)
const sent = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const hasRecoverySession = ref(false)
const auth = useAuthStore()

onMounted(() => {
  // Supabase redirects back with a recovery session already active
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') hasRecoverySession.value = true
  })
})

async function handleRequestReset() {
  loading.value = true
  errorMsg.value = ''
  const { error } = await auth.resetPasswordForEmail(email.value)
  loading.value = false
  if (error) errorMsg.value = error.message
  else sent.value = true
}

async function handleSetNewPassword() {
  loading.value = true
  errorMsg.value = ''
  const { error } = await auth.updatePassword(newPassword.value)
  loading.value = false
  if (error) errorMsg.value = error.message
  else successMsg.value = 'Password updated. You can now log in with your new password.'
}
</script>
