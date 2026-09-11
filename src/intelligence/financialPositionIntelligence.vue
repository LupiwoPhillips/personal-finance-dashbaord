export function buildFinancialPositionIntelligence({
  position = {},
  transactions = [],
  investments = [],
  goals = [],
  recurringRules = []
}) {
  const totalAssets = Number(position.totalAssets || 0)
  const totalLiabilities = Number(position.totalLiabilities || 0)
  const netWorth = Number(position.netWorth || 0)
  const liquidCash = Number(position.liquidCash || 0)
  const investmentValue = Number(position.investmentValue || 0)

  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === 'income'
  )

  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === 'expense'
  )

  const totalIncome = incomeTransactions.reduce(
    (total, transaction) => total + Number(transaction.amount || 0),
    0
  )

  const totalExpenses = expenseTransactions.reduce(
    (total, transaction) => total + Number(transaction.amount || 0),
    0
  )

  const netCashFlow = totalIncome - totalExpenses

  const savingsRate =
    totalIncome > 0
      ? (netCashFlow / totalIncome) * 100
      : 0

  const debtToAssetRatio =
    totalAssets > 0
      ? (totalLiabilities / totalAssets) * 100
      : 0

  const investmentAllocation =
    totalAssets > 0
      ? (investmentValue / totalAssets) * 100
      : 0

  const liquidAssetRatio =
    totalAssets > 0
      ? (liquidCash / totalAssets) * 100
      : 0

  const activeGoals = goals.filter(
    (goal) => goal.status === 'active'
  )

  const totalGoalTargets = activeGoals.reduce(
    (total, goal) => total + Number(goal.target_amount || 0),
    0
  )

  const totalGoalProgress = activeGoals.reduce(
    (total, goal) => total + Number(goal.current_amount || 0),
    0
  )

  const goalProgressRate =
    totalGoalTargets > 0
      ? (totalGoalProgress / totalGoalTargets) * 100
      : 0

  const activeRecurringRules = recurringRules.filter(
    (rule) => rule.active
  )

  const monthlyRecurringCommitments =
    activeRecurringRules.reduce((total, rule) => {
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

  const estimatedAnnualSurplus = netCashFlow * 12

  const netWorthToIncomeRatio =
    totalIncome > 0
      ? netWorth / totalIncome
      : 0

  const monthlyIncome =
    getCurrentMonthTotal(incomeTransactions)

  const monthlyExpenses =
    getCurrentMonthTotal(expenseTransactions)

  const monthlySurplus =
    monthlyIncome - monthlyExpenses

  const positionSignals = []

  if (netWorth < 0) {
    positionSignals.push({
      code: 'NEGATIVE_NET_WORTH',
      severity: 'high',
      title: 'Net worth is negative',
      description:
        'Recorded liabilities currently exceed recorded assets.'
    })
  } else if (netWorth > 0) {
    positionSignals.push({
      code: 'POSITIVE_NET_WORTH',
      severity: 'positive',
      title: 'Positive net worth',
      description:
        'Recorded assets currently exceed recorded liabilities.'
    })
  }

  if (debtToAssetRatio >= 70) {
    positionSignals.push({
      code: 'HIGH_DEBT_TO_ASSET_RATIO',
      severity: 'high',
      title: 'High debt relative to assets',
      description:
        'Liabilities represent a large share of recorded assets.'
    })
  } else if (debtToAssetRatio >= 40) {
    positionSignals.push({
      code: 'MODERATE_DEBT_TO_ASSET_RATIO',
      severity: 'medium',
      title: 'Meaningful debt exposure',
      description:
        'Liabilities represent a meaningful share of recorded assets.'
    })
  }

  if (savingsRate < 0) {
    positionSignals.push({
      code: 'NEGATIVE_MONTHLY_SURPLUS',
      severity: 'high',
      title: 'Spending exceeds income',
      description:
        'Current recorded spending is higher than recorded income.'
    })
  } else if (savingsRate >= 20) {
    positionSignals.push({
      code: 'STRONG_SAVINGS_CAPACITY',
      severity: 'positive',
      title: 'Strong savings capacity',
      description:
        'The recorded cash flow currently leaves a meaningful surplus.'
    })
  }

  if (liquidCash === 0 && totalAssets > 0) {
    positionSignals.push({
      code: 'LOW_LIQUIDITY_VISIBILITY',
      severity: 'medium',
      title: 'Limited liquid cash visibility',
      description:
        'Assets are recorded, but no liquid cash is currently recorded.'
    })
  }

  if (investmentAllocation >= 50) {
    positionSignals.push({
      code: 'HIGH_INVESTMENT_ALLOCATION',
      severity: 'low',
      title: 'Large investment allocation',
      description:
        'A large share of recorded assets is currently classified as investments.'
    })
  }

  if (monthlyRecurringCommitments > monthlyIncome * 0.5 && monthlyIncome > 0) {
    positionSignals.push({
      code: 'HIGH_RECURRING_COMMITMENTS',
      severity: 'medium',
      title: 'High recurring commitments',
      description:
        'Recurring commitments consume a large share of current monthly income.'
    })
  }

  const positionScore = calculatePositionScore({
    netWorth,
    totalAssets,
    totalLiabilities,
    debtToAssetRatio,
    liquidCash,
    investmentValue,
    savingsRate
  })

  return {
    summary: {
      totalAssets,
      totalLiabilities,
      netWorth,
      liquidCash,
      investmentValue
    },

    cashFlow: {
      totalIncome,
      totalExpenses,
      netCashFlow,
      savingsRate,
      monthlyIncome,
      monthlyExpenses,
      monthlySurplus,
      estimatedAnnualSurplus
    },

    ratios: {
      debtToAssetRatio,
      investmentAllocation,
      liquidAssetRatio,
      netWorthToIncomeRatio
    },

    goals: {
      activeGoals: activeGoals.length,
      totalGoalTargets,
      totalGoalProgress,
      goalProgressRate
    },

    commitments: {
      monthlyRecurringCommitments
    },

    score: positionScore,

    signals: positionSignals,

    interpretation: buildPositionInterpretation({
      netWorth,
      debtToAssetRatio,
      savingsRate,
      monthlySurplus,
      liquidCash,
      investmentAllocation
    })
  }
}

function calculatePositionScore({
  netWorth,
  totalAssets,
  totalLiabilities,
  debtToAssetRatio,
  liquidCash,
  investmentValue,
  savingsRate
}) {
  let score = 50

  if (netWorth > 0) {
    score += 10
  } else if (netWorth < 0) {
    score -= 20
  }

  if (totalAssets > 0) {
    score += 5
  }

  if (totalLiabilities === 0 && totalAssets > 0) {
    score += 10
  } else if (debtToAssetRatio < 30) {
    score += 8
  } else if (debtToAssetRatio < 50) {
    score += 3
  } else if (debtToAssetRatio >= 70) {
    score -= 10
  }

  if (liquidCash > 0) {
    score += 5
  }

  if (investmentValue > 0) {
    score += 5
  }

  if (savingsRate >= 20) {
    score += 10
  } else if (savingsRate >= 10) {
    score += 5
  } else if (savingsRate < 0) {
    score -= 15
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

function buildPositionInterpretation({
  netWorth,
  debtToAssetRatio,
  savingsRate,
  monthlySurplus,
  liquidCash,
  investmentAllocation
}) {
  if (netWorth < 0) {
    return 'Your recorded liabilities currently exceed your recorded assets. The priority is understanding the debt position and improving monthly cash flow.'
  }

  if (monthlySurplus < 0) {
    return 'Your financial position is positive on paper, but current spending is exceeding recorded income. Sustaining that pattern could put pressure on your position.'
  }

  if (debtToAssetRatio >= 70) {
    return 'Your assets currently provide limited coverage relative to your liabilities. Reducing debt pressure should be an important part of strengthening your position.'
  }

  if (savingsRate >= 20 && netWorth > 0) {
    return 'Your current cash flow is producing a meaningful surplus while your recorded assets exceed liabilities. This provides a strong foundation for building financial resilience.'
  }

  if (liquidCash === 0 && netWorth > 0) {
    return 'Your recorded net worth is positive, but there is currently no liquid cash recorded. Your financial position may therefore be less flexible than your net worth suggests.'
  }

  if (investmentAllocation > 50 && savingsRate < 10) {
    return 'A large portion of your recorded assets is invested while your current savings capacity is relatively low. PFD should consider liquidity alongside long-term growth.'
  }

  return 'Your financial position is currently positive. The next step is improving the relationship between cash flow, savings, liabilities and long-term assets.'
}

function getCurrentMonthTotal(transactions) {
  const now = new Date()

  return transactions
    .filter((transaction) => {
      const date = new Date(transaction.occurred_on)

      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      )
    })
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    )
}