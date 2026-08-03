import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.session)
  },

  actions: {
    async init() {
      if (this.initialized) return
      this.loading = true
      const { data } = await supabase.auth.getSession()
      this.session = data.session
      this.user = data.session?.user ?? null
      if (this.user) await this.fetchProfile()

      supabase.auth.onAuthStateChange(async (_event, session) => {
        this.session = session
        this.user = session?.user ?? null
        if (this.user) {
          await this.fetchProfile()
        } else {
          this.profile = null
        }
      })

      this.initialized = true
      this.loading = false
    },

    async fetchProfile() {
      if (!this.user) return
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .maybeSingle()
      if (!error && data) this.profile = data
    },

    async updateProfile(updates) {
      if (!this.user) return { error: new Error('Not authenticated') }
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', this.user.id)
        .select()
        .single()
      if (!error) this.profile = data
      return { data, error }
    },

    async signUp({ email, password, fullName }) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })
      if (!error && data.session) {
        this.session = data.session
        this.user = data.user
        await this.fetchProfile()
      }
      return { data, error }
    },

    async signIn({ email, password }) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error) {
        this.session = data.session
        this.user = data.user
        await this.fetchProfile()
      }
      return { data, error }
    },

    async signInWithMagicLink(email) {
      return supabase.auth.signInWithOtp({ email })
    },

    async resetPasswordForEmail(email) {
      return supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
    },

    async updatePassword(newPassword) {
      return supabase.auth.updateUser({ password: newPassword })
    },

    async signOut() {
      await supabase.auth.signOut()
      this.user = null
      this.session = null
      this.profile = null
    }
  }
})
