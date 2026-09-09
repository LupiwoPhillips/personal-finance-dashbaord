import {
  getIncome,
  getExpenses,
  getSavingsRate,
  getAverageMonthlyExpenses
} from './financialMetrics'

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

export function calculateFinancialHealth({
  transactions,
  goals = [],
  investments = [],
  recurringRules = []
}) {
  const income = getIncome(transactions)
  const expenses = getExpenses(transactions)

  // ------------------------------------------------------------
  // CASH FLOW SCORE
  // ------------------------------------------------------------

  let cashFlowScore = 50

  if (income > 0) {
    const ratio = expenses / income

    if (ratio <= 0.6) cashFlowScore = 95
    else if (ratio <= 0.75) cashFlowScore = 85
    else if (ratio <= 0.85) cashFlowScore = 75
    else if (ratio <= 1) cashFlowScore = 55
    else cashFlowScore = 20
  }

  // ------------------------------------------------------------
  // SAVINGS SCORE
  // ------------------------------------------------------------

  const savingsRate = getSavingsRate(transactions)

  let savingsScore = 20

  if (savingsRate >= 30) savingsScore = 100
  else if (savingsRate >= 20) savingsScore = 90
  else if (savingsRate >= 15) savingsScore = 80
  else if (savingsRate >= 10) savingsScore = 65
  else if (savingsRate >= 5) savingsScore = 45

  // ------------------------------------------------------------
  // GOALS SCORE
  // ------------------------------------------------------------

  let goalsScore = 50

  if (goals.length > 0) {
    const activeGoals = goals.filter(
      (goal) => goal.status === 'active'
    )

    if (activeGoals.length > 0) {
      const progress = activeGoals.reduce(
        (sum, goal) => {
          const target = Number(goal.target_amount || 0)
          const current = Number(goal.current_amount || 0)

          if (!target) return sum

          return sum + clamp((current / target) * 100)
        },
        0
      ) / activeGoals.length

      goalsScore = clamp(progress)
    } else {
      goalsScore = 70
    }
  }

  // ------------------------------------------------------------
  // INVESTMENT SCORE
  // ------------------------------------------------------------

  let investmentScore = investments.length > 0 ? 75 : 40

  // ------------------------------------------------------------
  // COMMITMENT SCORE
  // ------------------------------------------------------------

  const monthlyExpenses =
    getAverageMonthlyExpenses(
      transactions,
      3
    )

  const recurring = recurringRules
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

  let commitmentScore = 80

  if (monthlyExpenses > 0) {
    const commitmentRatio =
      recurring / monthlyExpenses

    if (commitmentRatio > 0.8) {
      commitmentScore = 40
    } else if (commitmentRatio > 0.6) {
      commitmentScore = 60
    } else if (commitmentRatio > 0.4) {
      commitmentScore = 75
    }
  }

  // ------------------------------------------------------------
  // FINAL SCORE
  // ------------------------------------------------------------

  const score = Math.round(
    cashFlowScore * 0.30 +
    savingsScore * 0.25 +
    goalsScore * 0.15 +
    investmentScore * 0.10 +
    commitmentScore * 0.20
  )

  return {
    score: clamp(score),

    dimensions: {
      cashFlow: Math.round(cashFlowScore),
      savings: Math.round(savingsScore),
      goals: Math.round(goalsScore),
      investments: Math.round(investmentScore),
      commitments: Math.round(commitmentScore)
    },

    metrics: {
      income,
      expenses,
      netCashFlow: income - expenses,
      savingsRate
    }
  }
}