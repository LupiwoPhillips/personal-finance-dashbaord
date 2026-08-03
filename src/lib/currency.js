// Lightweight currency helpers. Falls back to static rates if no API key is set,
// so the app works fully offline / without extra configuration.

export const SUPPORTED_CURRENCIES = [
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
]

// Static fallback rates, expressed as "1 unit of ZAR is worth X of target".
// These are approximate and only used when no live API key is configured.
const FALLBACK_RATES_FROM_ZAR = {
  ZAR: 1,
  USD: 0.055,
  EUR: 0.051,
  GBP: 0.043,
  JPY: 8.4,
  AUD: 0.084,
  CAD: 0.075,
  INR: 4.6
}

let liveRatesCache = null
let liveRatesFetchedAt = 0
const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour

export function getCurrencyMeta(code) {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0]
}

export function formatCurrency(amount, currencyCode = 'ZAR') {
  const meta = getCurrencyMeta(currencyCode)
  const value = Number(amount) || 0
  try {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  } catch {
    // Unsupported currency code in Intl — fall back to manual formatting
    return `${meta.symbol} ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
}

async function fetchLiveRates(baseCurrency) {
  const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY
  if (!apiKey) return null

  const now = Date.now()
  if (liveRatesCache && liveRatesCache.base === baseCurrency && now - liveRatesFetchedAt < CACHE_TTL_MS) {
    return liveRatesCache.rates
  }

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.result !== 'success') return null
    liveRatesCache = { base: baseCurrency, rates: data.conversion_rates }
    liveRatesFetchedAt = now
    return data.conversion_rates
  } catch {
    return null
  }
}

/**
 * Convert an amount between currencies. Tries live rates (if an API key is
 * configured), otherwise uses static fallback rates relative to ZAR.
 */
export async function convertCurrency(amount, fromCurrency, toCurrency) {
  const value = Number(amount) || 0
  if (fromCurrency === toCurrency) return value

  const liveRates = await fetchLiveRates(fromCurrency)
  if (liveRates && liveRates[toCurrency]) {
    return value * liveRates[toCurrency]
  }

  // Static fallback: convert via ZAR as the pivot currency
  const fromRate = FALLBACK_RATES_FROM_ZAR[fromCurrency] ?? 1
  const toRate = FALLBACK_RATES_FROM_ZAR[toCurrency] ?? 1
  const amountInZar = value / fromRate
  return amountInZar * toRate
}

// Synchronous fallback-only conversion, useful for computed properties that
// can't await. Good enough for display purposes when no live key is set.
export function convertCurrencySync(amount, fromCurrency, toCurrency) {
  const value = Number(amount) || 0
  if (fromCurrency === toCurrency) return value
  const fromRate = FALLBACK_RATES_FROM_ZAR[fromCurrency] ?? 1
  const toRate = FALLBACK_RATES_FROM_ZAR[toCurrency] ?? 1
  return (value / fromRate) * toRate
}
