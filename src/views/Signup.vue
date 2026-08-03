<template>
  <AuthShell title="Create your account" subtitle="Start tracking your finances in minutes">
    <form v-if="!confirmationSent" @submit.prevent="handleSignup" class="space-y-4">
      <div>
        <label class="label">Full name</label>
        <input v-model="fullName" type="text" class="input" required placeholder="Jane Doe" />
      </div>
      <div>
        <label class="label">Email</label>
        <input v-model="email" type="email" class="input" required placeholder="you@example.com" />
      </div>
      <div>
        <label class="label">Password</label>
        <input v-model="password" type="password" class="input" required minlength="6" placeholder="At least 6 characters" />
      </div>
      <p v-if="errorMsg" class="text-sm text-red-600 dark:text-red-400">{{ errorMsg }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Creating account…' : 'Sign Up' }}
      </button>
    </form>
    <div v-else class="text-center py-4">
      <div class="text-4xl mb-3">📧</div>
      <p class="text-gray-700 dark:text-gray-200 font-medium mb-1">Check your inbox</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        We sent a confirmation link to {{ email }}. Confirm your email to finish signing up.
      </p>
    </div>
    <p class="text-center text-sm mt-6 text-gray-500 dark:text-gray-400">
      Already have an account?
      <router-link to="/login" class="text-primary-600 dark:text-primary-400 font-medium hover:underline">Log in</router-link>
    </p>
  </AuthShell>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthShell from '../components/AuthShell.vue'

const fullName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const confirmationSent = ref(false)
const router = useRouter()
const auth = useAuthStore()

async function handleSignup() {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await auth.signUp({ email: email.value, password: password.value, fullName: fullName.value })
  loading.value = false
  if (error) {
    errorMsg.value = error.message
    return
  }
  if (data.session) {
    router.push('/dashboard')
  } else {
    // Email confirmation required before a session is issued
    confirmationSent.value = true
  }
}
</script>
