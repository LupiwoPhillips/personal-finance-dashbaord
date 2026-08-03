<template>
  <AuthShell title="Welcome back" subtitle="Log in to your dashboard">
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="label">Email</label>
        <input v-model="email" type="email" class="input" required placeholder="you@example.com" />
      </div>
      <div>
        <label class="label">Password</label>
        <input v-model="password" type="password" class="input" required placeholder="••••••••" />
      </div>
      <p v-if="errorMsg" class="text-sm text-red-600 dark:text-red-400">{{ errorMsg }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Logging in…' : 'Log In' }}
      </button>
      <div class="text-right">
        <router-link to="/reset-password" class="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          Forgot password?
        </router-link>
      </div>
    </form>
    <p class="text-center text-sm mt-6 text-gray-500 dark:text-gray-400">
      Don't have an account?
      <router-link to="/signup" class="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign up</router-link>
    </p>
    <p v-if="!isSupabaseConfigured" class="text-xs text-center mt-4 text-amber-600 dark:text-amber-400">
      Supabase isn't configured yet — copy .env.example to .env and add your project keys.
    </p>
  </AuthShell>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { isSupabaseConfigured } from '../lib/supabase'
import AuthShell from '../components/AuthShell.vue'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  const { error } = await auth.signIn({ email: email.value, password: password.value })
  loading.value = false
  if (error) {
    errorMsg.value = error.message
  } else {
    router.push(route.query.redirect || '/dashboard')
  }
}
</script>
