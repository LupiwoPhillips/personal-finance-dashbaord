import {
  getExpenses,
  getIncome,
  getSavingsRate,
  getSpendingByCategory,
  getAverageMonthlyExpenses
} from './financialMetrics'

export function generateFinancialSignals({
  transactions,
  budgets = [],
  goals = [],
  recurringRules = []
}) {
  const signals = []

  const income = getIncome(transactions)
  const expenses = getExpenses(transactions)
  const savingsRate = getSavingsRate(transactions)

  // ------------------------------------------------------------
  // CASH FLOW
  // ------------------------------------------------------------

  if (income > 0 && expenses > income) {
    signals.push({
      code: 'NEGATIVE_CASH_FLOW',
      severity: 'high',
      category: 'cash_flow',
      title: 'Spending exceeds income',
      description:
        'Your expenses are currently higher than your recorded income.'
    })
  }

  // ------------------------------------------------------------
  // SAVINGS
  // ------------------------------------------------------------

  if (income > 0 && savingsRate < 10) {
    signals.push({
      code: 'LOW_SAVINGS_RATE',
      severity: 'medium',
      category: 'savings',
      title: 'Low savings rate',
      description:
        `Your current savings rate is approximately ${savingsRate.toFixed(0)}%.`
    })
  }

  if (income > 0 && savingsRate >= 20) {
    signals.push({
      code: 'HEALTHY_SAVINGS_RATE',
      severity: 'positive',
      category: 'savings',
      title: 'Healthy savings behaviour',
      description:
        `You're currently retaining approximately ${savingsRate.toFixed(0)}% of recorded income.`
    })
  }

  // ------------------------------------------------------------
  // SPENDING TREND
  // ------------------------------------------------------------

  const monthlyExpenses = getAverageMonthlyExpenses(
    transactions,
    3
  )

  const currentMonthExpenses = getExpenses(
    transactions.filter((transaction) => {
      const date = new Date(transaction.occurred_on)
      const now = new Date()

      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      )
    })
  )

  if (
    monthlyExpenses > 0 &&
    currentMonthExpenses > monthlyExpenses * 1.2
  ) {
    signals.push({
      code: 'SPENDING_ACCELERATION',
      severity: 'medium',
      category: 'spending',
      title: 'Spending is accelerating',
      description:
        'Your current-month spending is significantly above your recent monthly average.'
    })
  }

  // ------------------------------------------------------------
  // CATEGORY CONCENTRATION
  // ------------------------------------------------------------

  const categorySpending = getSpendingByCategory(transactions)

  const topCategory = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b.total - a.total)[0]

  if (topCategory && expenses > 0) {
    const [name, data] = topCategory
    const share = (data.total / expenses) * 100

    if (share >= 40) {
      signals.push({
        code: 'CATEGORY_CONCENTRATION',
        severity: 'medium',
        category: 'spending',
        title: `${name} dominates spending`,
        description:
          `${name} represents approximately ${share.toFixed(0)}% of recorded expenses.`
      })
    }
  }

  // ------------------------------------------------------------
  // BUDGET PRESSURE
  // ------------------------------------------------------------

  budgets.forEach((budget) => {
    const categoryName = budget.categories?.name

    if (!categoryName) return

    const category = categorySpending[categoryName]

    if (!category) return

    const spent = category.total
    const limit = Number(budget.amount || 0)

    if (limit <= 0) return

    const percentage = (spent / limit) * 100

    if (percentage >= 100) {
      signals.push({
        code: 'BUDGET_EXCEEDED',
        severity: 'high',
        category: 'budget',
        title: `${categoryName} budget exceeded`,
        description:
          `You've used approximately ${percentage.toFixed(0)}% of this budget.`
      })
    } else if (percentage >= 80) {
      signals.push({
        code: 'BUDGET_PRESSURE',
        severity: 'medium',
        category: 'budget',
        title: `${categoryName} budget under pressure`,
        description:
          `You've used approximately ${percentage.toFixed(0)}% of this budget.`
      })
    }
  })

  // ------------------------------------------------------------
  // GOALS
  // ------------------------------------------------------------

  goals.forEach((goal) => {
    const target = Number(goal.target_amount || 0)
    const current = Number(goal.current_amount || 0)

    if (target <= 0) return

    const progress = (current / target) * 100

    if (
      goal.status === 'active' &&
      progress < 50 &&
      goal.target_date
    ) {
      const targetDate = new Date(goal.target_date)
      const today = new Date()

      const daysRemaining =
        Math.ceil(
          (targetDate - today) /
            (1000 * 60 * 60 * 24)
        )

      if (daysRemaining > 0 && daysRemaining < 90) {
        signals.push({
          code: 'GOAL_RISK',
          severity: 'medium',
          category: 'goals',
          title: `${goal.name} may be at risk`,
          description:
            `The goal is ${progress.toFixed(0)}% complete with less than 90 days remaining.`
        })
      }
    }
  })

  // ------------------------------------------------------------
  // RECURRING COMMITMENTS
  // ------------------------------------------------------------

  const recurringMonthly = recurringRules
    .filter(
      (rule) =>
        rule.active &&
        rule.type === 'expense'
    )
    .reduce(
      (sum, rule) =>
        sum + Number(rule.amount || 0),
      0
    )

  if (
    income > 0 &&
    recurringMonthly / income > 0.5
  ) {
    signals.push({
      code: 'HIGH_RECURRING_COMMITMENTS',
      severity: 'medium',
      category: 'commitments',
      title: 'High recurring commitments',
      description:
        'A significant portion of your recorded income is committed to recurring expenses.'
    })
  }

  return signals
}