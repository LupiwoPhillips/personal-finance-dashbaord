// Rule-based financial insight & recommendation engine.
// No external AI API is called here — everything runs client-side against
// the user's own transaction data, so it works with zero extra setup.
// If you want to swap in a real LLM later, replace generateInsights() with
// a call to your model of choice, passing the same summary stats as context.

import { formatCurrency } from './currency'

export function generateInsights({ transactions, budgets, goals, currency }) {
  const insights = []
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const thisMonthTx = transactions.filter((t) => {
    const d = new Date(t.occurred_on)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  })
  const lastMonthDate = new Date(thisYear, thisMonth - 1, 1)
  const lastMonthTx = transactions.filter((t) => {
    const d = new Date(t.occurred_on)
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear()
  })

  const sum = (list, type) => list.filter((t) => t.type === type).reduce((s, t) => s + Number(t.amount), 0)

  const thisMonthExpenses = sum(thisMonthTx, 'expense')
  const lastMonthExpenses = sum(lastMonthTx, 'expense')
  const thisMonthIncome = sum(thisMonthTx, 'income')

  // 1. Spending trend vs last month
  if (lastMonthExpenses > 0) {
    const pctChange = ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
    if (pctChange > 15) {
      insights.push({
        type: 'warning',
        icon: '📈',
        title: 'Spending is up this month',
        message: `Your spending is ${pctChange.toFixed(0)}% higher than last month (${formatCurrency(thisMonthExpenses, currency)} vs ${formatCurrency(lastMonthExpenses, currency)}).`
      })
    } else if (pctChange < -10) {
      insights.push({
        type: 'positive',
        icon: '📉',
        title: 'Nice — spending is down',
        message: `You've spent ${Math.abs(pctChange).toFixed(0)}% less than last month. Keep it up.`
      })
    }
  }

  // 2. Savings rate
  if (thisMonthIncome > 0) {
    const savingsRate = ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100
    if (savingsRate < 0) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Spending more than you earn',
        message: `This month's expenses exceed income by ${formatCurrency(Math.abs(thisMonthIncome - thisMonthExpenses), currency)}. Consider reviewing discretionary categories.`
      })
    } else if (savingsRate < 10) {
      insights.push({
        type: 'info',
        icon: '💡',
        title: 'Low savings rate',
        message: `You're saving about ${savingsRate.toFixed(0)}% of income this month. Financial guidelines often suggest aiming for 20%.`
      })
    } else if (savingsRate >= 20) {
      insights.push({
        type: 'positive',
        icon: '🎉',
        title: 'Healthy savings rate',
        message: `You're saving roughly ${savingsRate.toFixed(0)}% of your income this month — well done.`
      })
    }
  }

  // 3. Category concentration
  const byCategory = {}
  thisMonthTx.filter((t) => t.type === 'expense').forEach((t) => {
    const name = t.categories?.name || 'Uncategorized'
    byCategory[name] = (byCategory[name] || 0) + Number(t.amount)
  })
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]
  if (topCategory && thisMonthExpenses > 0) {
    const share = (topCategory[1] / thisMonthExpenses) * 100
    if (share > 40) {
      insights.push({
        type: 'info',
        icon: '🔍',
        title: `${topCategory[0]} dominates your spending`,
        message: `${share.toFixed(0)}% of this month's expenses are in "${topCategory[0]}" (${formatCurrency(topCategory[1], currency)}).`
      })
    }
  }

  // 4. Budget alerts
  budgets.forEach((b) => {
    const catName = b.categories?.name || 'this category'
    const spent = byCategory[catName] || 0
    const pct = (spent / Number(b.amount)) * 100
    if (pct >= 100) {
      insights.push({
        type: 'warning',
        icon: '🚨',
        title: `Over budget: ${catName}`,
        message: `You've spent ${formatCurrency(spent, currency)} of a ${formatCurrency(b.amount, currency)} budget (${pct.toFixed(0)}%).`
      })
    } else if (pct >= (b.alert_threshold_pct || 80)) {
      insights.push({
        type: 'warning',
        icon: '⏳',
        title: `Approaching budget limit: ${catName}`,
        message: `You've used ${pct.toFixed(0)}% of your ${formatCurrency(b.amount, currency)} budget.`
      })
    }
  })

  // 5. Goal progress
  goals.forEach((g) => {
    const pct = (Number(g.current_amount) / Number(g.target_amount)) * 100
    if (pct >= 100 && g.status === 'active') {
      insights.push({
        type: 'positive',
        icon: '🏆',
        title: `Goal reached: ${g.name}`,
        message: `You've hit your target of ${formatCurrency(g.target_amount, currency)}. Consider setting a new goal.`
      })
    } else if (g.target_date) {
      const daysLeft = Math.ceil((new Date(g.target_date) - now) / (1000 * 60 * 60 * 24))
      if (daysLeft > 0 && daysLeft < 30 && pct < 90) {
        insights.push({
          type: 'info',
          icon: '⏰',
          title: `${g.name} deadline approaching`,
          message: `${daysLeft} days left and you're at ${pct.toFixed(0)}% of your goal. You may need to contribute ${formatCurrency((Number(g.target_amount) - Number(g.current_amount)), currency)} more.`
        })
      }
    }
  })

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      icon: '👋',
      title: 'Add more data for insights',
      message: 'Log a few transactions, budgets, or goals and this panel will surface personalized patterns and recommendations.'
    })
  }

  return insights
}

export function generateRecommendations({ transactions, budgets, currency }) {
  const recs = []
  const expenseTotal = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const incomeTotal = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)

  if (incomeTotal > 0 && expenseTotal / incomeTotal > 0.9) {
    recs.push('Your expenses are over 90% of your income. Building a small emergency fund (even 1 month of expenses) can help absorb surprise costs.')
  }
  if (budgets.length === 0) {
    recs.push('You haven\'t set any budgets yet. Setting a monthly limit per category is one of the most effective ways to control spending.')
  }
  const categorySpend = {}
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    const name = t.categories?.name || 'Uncategorized'
    categorySpend[name] = (categorySpend[name] || 0) + Number(t.amount)
  })
  const uncategorized = categorySpend['Uncategorized']
  if (uncategorized && uncategorized > 0) {
    recs.push(`You have ${formatCurrency(uncategorized, currency)} in uncategorized transactions. Categorizing them will make insights more accurate.`)
  }
  if (recs.length === 0) {
    recs.push('Your finances look well organized. Keep logging transactions regularly to get sharper insights over time.')
  }
  return recs
}
