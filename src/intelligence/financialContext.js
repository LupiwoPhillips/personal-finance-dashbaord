import {
  getIncome,
  getExpenses,
  getNetCashFlow,
  getSavingsRate,
  getSpendingByCategory,
  getAverageMonthlyIncome,
  getAverageMonthlyExpenses,
  getRecurringMonthlyCommitments
} from './financialMetrics'

import { generateFinancialSignals } from './financialSignals'

import { calculateFinancialHealth } from './financialHealth'

import { generateCashFlowForecast } from './forecasting'

export function buildFinancialContext({
  transactions = [],
  budgets = [],
  goals = [],
  investments = [],
  recurringRules = [],
  profile = null
}) {
  const income = getIncome(transactions)
  const expenses = getExpenses(transactions)

  const health = calculateFinancialHealth({
    transactions,
    goals,
    investments,
    recurringRules
  })

  const signals = generateFinancialSignals({
    transactions,
    budgets,
    goals,
    recurringRules
  })

  const forecast = generateCashFlowForecast({
    transactions,
    recurringRules
  })

  const categories =
    getSpendingByCategory(
      transactions
    )

  return {
    user: {
      currency:
        profile?.base_currency || 'ZAR'
    },

    financialSummary: {
      totalIncome: income,
      totalExpenses: expenses,
      netCashFlow:
        getNetCashFlow(transactions),

      savingsRate:
        getSavingsRate(transactions),

      averageMonthlyIncome:
        getAverageMonthlyIncome(
          transactions,
          3
        ),

      averageMonthlyExpenses:
        getAverageMonthlyExpenses(
          transactions,
          3
        ),

      recurringMonthlyCommitments:
        getRecurringMonthlyCommitments(
          recurringRules
        )
    },

    spending: {
      byCategory: categories
    },

    budgets: budgets.map((budget) => ({
      category:
        budget.categories?.name || 'Unknown',

      amount:
        Number(budget.amount || 0),

      period:
        budget.period
    })),

    goals: goals.map((goal) => ({
      name: goal.name,

      target:
        Number(goal.target_amount || 0),

      current:
        Number(goal.current_amount || 0),

      targetDate:
        goal.target_date,

      status:
        goal.status
    })),

    investments: investments.map(
      (investment) => ({
        name: investment.name,

        type:
          investment.asset_type,

        value:
          Number(
            investment.current_value || 0
          ),

        costBasis:
          Number(
            investment.cost_basis || 0
          )
      })
    ),

    health,

    signals,

    forecast
  }
}