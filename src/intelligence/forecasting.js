import {
  getAverageMonthlyIncome,
  getAverageMonthlyExpenses
} from './financialMetrics'

export function generateCashFlowForecast({
  transactions,
  recurringRules = [],
  months = 3
}) {
  const averageIncome =
    getAverageMonthlyIncome(
      transactions,
      3
    )

  const averageExpenses =
    getAverageMonthlyExpenses(
      transactions,
      3
    )

  const recurringExpenses =
    recurringRules
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

  const monthlyNet =
    averageIncome - averageExpenses

  const forecast = []

  for (let i = 1; i <= months; i++) {
    const date = new Date()

    date.setMonth(
      date.getMonth() + i
    )

    forecast.push({
      month: date.toLocaleDateString(
        'en-US',
        {
          month: 'short',
          year: 'numeric'
        }
      ),

      expectedIncome:
        averageIncome,

      expectedExpenses:
        averageExpenses,

      recurringCommitments:
        recurringExpenses,

      projectedNet:
        monthlyNet
    })
  }

  return {
    averageIncome,
    averageExpenses,
    recurringExpenses,
    monthlyNet,
    forecast
  }
}