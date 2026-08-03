import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    transactions: [],
    categories: [],
    budgets: [],
    goals: [],
    investments: [],
    recurringRules: [],
    notifications: [],
    loading: false,
    loaded: false,
    error: null
  }),

  getters: {
    expenseCategories: (state) => state.categories.filter((c) => c.kind === 'expense'),
    incomeCategories: (state) => state.categories.filter((c) => c.kind === 'income'),

    totalIncome: (state) =>
      state.transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),

    totalExpenses: (state) =>
      state.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),

    netBalance() {
      return this.totalIncome - this.totalExpenses
    },

    unreadNotificationCount: (state) => state.notifications.filter((n) => !n.read).length,

    spendingByCategory: (state) => {
      const map = {}
      state.transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
          const name = t.categories?.name || 'Uncategorized'
          const color = t.categories?.color || '#6b7280'
          if (!map[name]) map[name] = { total: 0, color }
          map[name].total += Number(t.amount)
        })
      return map
    },

    monthlySeries: (state) => {
      // Last 6 months of income vs expense totals, keyed by "YYYY-MM"
      const buckets = {}
      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        buckets[key] = { income: 0, expense: 0, label: d.toLocaleDateString('en-US', { month: 'short' }) }
      }
      state.transactions.forEach((t) => {
        const d = new Date(t.occurred_on)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (buckets[key]) buckets[key][t.type] += Number(t.amount)
      })
      return Object.values(buckets)
    }
  },

  actions: {
    _userId() {
      const auth = useAuthStore()
      return auth.user?.id
    },

    async fetchAll() {
      const userId = this._userId()
      if (!userId) return
      this.loading = true
      this.error = null
      try {
        await Promise.all([
          this.fetchCategories(),
          this.fetchTransactions(),
          this.fetchBudgets(),
          this.fetchGoals(),
          this.fetchInvestments(),
          this.fetchRecurringRules(),
          this.fetchNotifications()
        ])
        this.loaded = true
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // ---------------- Categories ----------------
    async fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name')
      if (error) throw error
      this.categories = data || []
    },

    async addCategory(payload) {
      const userId = this._userId()
      const { data, error } = await supabase
        .from('categories')
        .insert({ ...payload, user_id: userId })
        .select()
        .single()
      if (!error) this.categories.push(data)
      return { data, error }
    },

    async deleteCategory(id) {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (!error) this.categories = this.categories.filter((c) => c.id !== id)
      return { error }
    },

    // ---------------- Transactions ----------------
    async fetchTransactions() {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, categories(id, name, icon, color)')
        .order('occurred_on', { ascending: false })
      if (error) throw error
      this.transactions = data || []
    },

    async addTransaction(payload) {
      const userId = this._userId()
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...payload, user_id: userId })
        .select('*, categories(id, name, icon, color)')
        .single()
      if (!error) {
        this.transactions.unshift(data)
        await this.checkBudgetAlerts(data)
      }
      return { data, error }
    },

    async updateTransaction(id, payload) {
      const { data, error } = await supabase
        .from('transactions')
        .update(payload)
        .eq('id', id)
        .select('*, categories(id, name, icon, color)')
        .single()
      if (!error) {
        const idx = this.transactions.findIndex((t) => t.id === id)
        if (idx !== -1) this.transactions[idx] = data
      }
      return { data, error }
    },

    async deleteTransaction(id) {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (!error) this.transactions = this.transactions.filter((t) => t.id !== id)
      return { error }
    },

    // ---------------- Budgets ----------------
    async fetchBudgets() {
      const { data, error } = await supabase
        .from('budgets')
        .select('*, categories(id, name, icon, color)')
      if (error) throw error
      this.budgets = data || []
    },

    async addBudget(payload) {
      const userId = this._userId()
      const { data, error } = await supabase
        .from('budgets')
        .insert({ ...payload, user_id: userId })
        .select('*, categories(id, name, icon, color)')
        .single()
      if (!error) this.budgets.push(data)
      return { data, error }
    },

    async updateBudget(id, payload) {
      const { data, error } = await supabase
        .from('budgets')
        .update(payload)
        .eq('id', id)
        .select('*, categories(id, name, icon, color)')
        .single()
      if (!error) {
        const idx = this.budgets.findIndex((b) => b.id === id)
        if (idx !== -1) this.budgets[idx] = data
      }
      return { data, error }
    },

    async deleteBudget(id) {
      const { error } = await supabase.from('budgets').delete().eq('id', id)
      if (!error) this.budgets = this.budgets.filter((b) => b.id !== id)
      return { error }
    },

    async checkBudgetAlerts(transaction) {
      if (transaction.type !== 'expense') return
      const budget = this.budgets.find((b) => b.category_id === transaction.category_id)
      if (!budget) return
      const spent = this.transactions
        .filter((t) => t.type === 'expense' && t.category_id === transaction.category_id)
        .reduce((s, t) => s + Number(t.amount), 0)
      const pct = (spent / Number(budget.amount)) * 100
      if (pct >= (budget.alert_threshold_pct || 80)) {
        await this.addNotification({
          type: 'budget_alert',
          title: pct >= 100 ? 'Budget exceeded' : 'Budget alert',
          message: `${transaction.categories?.name || 'This category'} is at ${pct.toFixed(0)}% of its budget.`
        })
      }
    },

    // ---------------- Goals ----------------
    async fetchGoals() {
      const { data, error } = await supabase
        .from('goals')
        .select('*, goal_contributions(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      this.goals = data || []
    },

    async addGoal(payload) {
      const userId = this._userId()
      const { data, error } = await supabase
        .from('goals')
        .insert({ ...payload, user_id: userId })
        .select()
        .single()
      if (!error) this.goals.unshift({ ...data, goal_contributions: [] })
      return { data, error }
    },

    async updateGoal(id, payload) {
      const { data, error } = await supabase.from('goals').update(payload).eq('id', id).select().single()
      if (!error) {
        const idx = this.goals.findIndex((g) => g.id === id)
        if (idx !== -1) this.goals[idx] = { ...this.goals[idx], ...data }
      }
      return { data, error }
    },

    async deleteGoal(id) {
      const { error } = await supabase.from('goals').delete().eq('id', id)
      if (!error) this.goals = this.goals.filter((g) => g.id !== id)
      return { error }
    },

    async addGoalContribution(goalId, amount, note = '') {
      const userId = this._userId()
      const { data, error } = await supabase
        .from('goal_contributions')
        .insert({ goal_id: goalId, user_id: userId, amount, note })
        .select()
        .single()
      if (!error) {
        await this.fetchGoals()
        const goal = this.goals.find((g) => g.id === goalId)
        if (goal && Number(goal.current_amount) >= Number(goal.target_amount)) {
          await this.addNotification({
            type: 'goal_milestone',
            title: 'Goal reached! 🎉',
            message: `You've hit your target for "${goal.name}".`
          })
        }
      }
      return { data, error }
    },

    // ---------------- Investments ----------------
    async fetchInvestments() {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      this.investments = data || []
    },

    async addInvestment(payload) {
      const userId = this._userId()
      const { data, error } = await supabase
        .from('investments')
        .insert({ ...payload, user_id: userId })
        .select()
        .single()
      if (!error) this.investments.unshift(data)
      return { data, error }
    },

    async updateInvestment(id, payload) {
      const { data, error } = await supabase.from('investments').update(payload).eq('id', id).select().single()
      if (!error) {
        const idx = this.investments.findIndex((i) => i.id === id)
        if (idx !== -1) this.investments[idx] = data
      }
      return { data, error }
    },

    async deleteInvestment(id) {
      const { error } = await supabase.from('investments').delete().eq('id', id)
      if (!error) this.investments = this.investments.filter((i) => i.id !== id)
      return { error }
    },

    // ---------------- Recurring rules ----------------
    async fetchRecurringRules() {
      const { data, error } = await supabase
        .from('recurring_rules')
        .select('*, categories(id, name, icon, color)')
        .order('next_run_date')
      if (error) throw error
      this.recurringRules = data || []
    },

    async addRecurringRule(payload) {
      const userId = this._userId()
      const { data, error } = await supabase
        .from('recurring_rules')
        .insert({ ...payload, user_id: userId })
        .select('*, categories(id, name, icon, color)')
        .single()
      if (!error) this.recurringRules.push(data)
      return { data, error }
    },

    async deleteRecurringRule(id) {
      const { error } = await supabase.from('recurring_rules').delete().eq('id', id)
      if (!error) this.recurringRules = this.recurringRules.filter((r) => r.id !== id)
      return { error }
    },

    /**
     * Applies any recurring rules that are due (next_run_date <= today),
     * creating transactions and advancing next_run_date. Call this once on
     * app load (see App.vue). Idempotent-ish: only runs rules that are due.
     */
    async processDueRecurringRules() {
      const today = new Date().toISOString().slice(0, 10)
      const due = this.recurringRules.filter((r) => r.active && r.next_run_date <= today)
      for (const rule of due) {
        await this.addTransaction({
          category_id: rule.category_id,
          type: rule.type,
          description: rule.description,
          amount: rule.amount,
          currency: rule.currency,
          occurred_on: rule.next_run_date,
          is_recurring: true,
          recurring_rule_id: rule.id
        })
        const nextDate = advanceDate(rule.next_run_date, rule.frequency)
        const stillActive = !rule.end_date || nextDate <= rule.end_date
        await supabase
          .from('recurring_rules')
          .update({ next_run_date: nextDate, active: stillActive })
          .eq('id', rule.id)
      }
      if (due.length > 0) await this.fetchRecurringRules()
    },

    // ---------------- Notifications ----------------
    async fetchNotifications() {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      this.notifications = data || []
    },

    async addNotification(payload) {
      const userId = this._userId()
      // Avoid spamming duplicate alerts: skip if an identical unread one exists
      const dup = this.notifications.find(
        (n) => !n.read && n.title === payload.title && n.message === payload.message
      )
      if (dup) return { data: dup, error: null }
      const { data, error } = await supabase
        .from('notifications')
        .insert({ ...payload, user_id: userId })
        .select()
        .single()
      if (!error) this.notifications.unshift(data)
      return { data, error }
    },

    async markNotificationRead(id) {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id)
      if (!error) {
        const n = this.notifications.find((n) => n.id === id)
        if (n) n.read = true
      }
      return { error }
    },

    async markAllNotificationsRead() {
      const userId = this._userId()
      const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false)
      if (!error) this.notifications.forEach((n) => (n.read = true))
      return { error }
    },

    reset() {
      this.transactions = []
      this.categories = []
      this.budgets = []
      this.goals = []
      this.investments = []
      this.recurringRules = []
      this.notifications = []
      this.loaded = false
    }
  }
})

function advanceDate(dateStr, frequency) {
  const d = new Date(dateStr)
  switch (frequency) {
    case 'daily':
      d.setDate(d.getDate() + 1)
      break
    case 'weekly':
      d.setDate(d.getDate() + 7)
      break
    case 'monthly':
      d.setMonth(d.getMonth() + 1)
      break
    case 'yearly':
      d.setFullYear(d.getFullYear() + 1)
      break
  }
  return d.toISOString().slice(0, 10)
}
