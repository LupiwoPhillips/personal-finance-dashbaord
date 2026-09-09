/**
 * Core financial calculations.
 *
 * This file deliberately contains no Vue, Pinia or Supabase code.
 * It receives financial data and returns calculations.
 */

export function getIncome(transactions) {
  return transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)
}

export function getExpenses(transactions) {
  return transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)
}

export function getNetCashFlow(transactions) {
  return getIncome(transactions) - getExpenses(transactions)
}

export function getSavingsRate(transactions) {
  const income = getIncome(transactions)
  const expenses = getExpenses(transactions)

  if (income <= 0) return 0

  return ((income - expenses) / income) * 100
}

export function getAverageMonthlyIncome(transactions, months = 3) {
  const monthly = getMonthlyTotals(transactions, months)

  if (!monthly.length) return 0

  return monthly.reduce((sum, month) => sum + month.income, 0) / monthly.length
}

export function getAverageMonthlyExpenses(transactions, months = 3) {
  const monthly = getMonthlyTotals(transactions, months)

  if (!monthly.length) return 0

  return monthly.reduce((sum, month) => sum + month.expenses, 0) / monthly.length
}

export function getMonthlyTotals(transactions, months = 6) {
  const result = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    )

    const year = date.getFullYear()
    const month = date.getMonth()

    const monthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.occurred_on)

      return (
        transactionDate.getFullYear() === year &&
        transactionDate.getMonth() === month
      )
    })

    const income = monthTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)

    const expenses = monthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)

    result.push({
      year,
      month: month + 1,
      label: date.toLocaleDateString('en-US', {
        month: 'short'
      }),
      income,
      expenses,
      net: income - expenses
    })
  }

  return result
}

export function getCurrentMonthTransactions(transactions) {
  const now = new Date()

  return transactions.filter((transaction) => {
    const date = new Date(transaction.occurred_on)

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    )
  })
}

export function getSpendingByCategory(transactions) {
  const result = {}

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      const categoryName =
        transaction.categories?.name || 'Uncategorized'

      if (!result[categoryName]) {
        result[categoryName] = {
          total: 0,
          transactions: 0,
          categoryId: transaction.category_id || null
        }
      }

      result[categoryName].total += Number(transaction.amount || 0)
      result[categoryName].transactions += 1
    })

  return result
}

export function getDiscretionarySpending(transactions) {
  const discretionaryCategories = [
    'Entertainment',
    'Shopping',
    'Food Delivery',
    'Restaurants',
    'Travel'
  ]

  return transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense' &&
        discretionaryCategories.includes(
          transaction.categories?.name
        )
    )
    .reduce(
      (sum, transaction) => sum + Number(transaction.amount || 0),
      0
    )
}

export function getRecurringMonthlyCommitments(recurringRules) {
  return recurringRules
    .filter((rule) => rule.active && rule.type === 'expense')
    .reduce((total, rule) => {
      const amount = Number(rule.amount || 0)

      switch (rule.frequency) {
        case 'daily':
          return total + amount * 30

        case 'weekly':
          return total + amount * 4.33

        case 'monthly':
          return total + amount

        case 'yearly':
          return total + amount / 12

        default:
          return total
      }
    }, 0)
}

export function calculateSafeToSpend({
  currentBalance = 0,
  upcomingCommitments = 0,
  plannedGoalContributions = 0,
  safetyBuffer = 0
}) {
  return Math.max(
    0,
    Number(currentBalance) -
      Number(upcomingCommitments) -
      Number(plannedGoalContributions) -
      Number(safetyBuffer)
  )
}