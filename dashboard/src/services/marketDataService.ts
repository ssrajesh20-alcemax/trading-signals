// Market Data Service - Integrates with Alpha Vantage API
// Get your free API key from: https://www.alphavantage.co/support/#api-key

// IMPORTANT: Replace 'YOUR_API_KEY_HERE' with your actual API key
const API_KEY = 'SBTDPWICYQ0VVHDM'const BASE_URL = 'https://www.alphavantage.co/query'

export interface PriceData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type TimeInterval = '1min' | '5min' | '15min' | '60min' | 'daily' | 'weekly' | 'monthly'

/**
 * Fetch stock/crypto price data from Alpha Vantage
 * @param symbol - Stock symbol (e.g., 'AAPL', 'MSFT') or crypto (e.g., 'BTC')
 * @param interval - Time interval for data
 * @param outputSize - 'compact' (100 data points) or 'full' (full history)
 * @returns Array of price data
 */
export async function fetchStockData(
  symbol: string,
  interval: TimeInterval = 'daily',
  outputSize: 'compact' | 'full' = 'compact'
): Promise<PriceData[]> {
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('Please set your Alpha Vantage API key in marketDataService.ts')
  }

  const functionMap: Record<TimeInterval, string> = {
    '1min': 'TIME_SERIES_INTRADAY',
    '5min': 'TIME_SERIES_INTRADAY',
    '15min': 'TIME_SERIES_INTRADAY',
    '60min': 'TIME_SERIES_INTRADAY',
    'daily': 'TIME_SERIES_DAILY',
    'weekly': 'TIME_SERIES_WEEKLY',
    'monthly': 'TIME_SERIES_MONTHLY'
  }

  const params = new URLSearchParams({
    function: functionMap[interval],
    symbol: symbol.toUpperCase(),
    apikey: API_KEY,
    outputsize: outputSize
  })

  if (['1min', '5min', '15min', '60min'].includes(interval)) {
    params.append('interval', interval)
  }

  try {
    const response = await fetch(`${BASE_URL}?${params}`)
    const data = await response.json()

    // Check for API errors
    if (data['Error Message']) {
      throw new Error(`API Error: ${data['Error Message']}`)
    }
    if (data['Note']) {
      throw new Error('API rate limit exceeded. Please wait a minute or upgrade your plan.')
    }

    // Find the time series key
    const timeSeriesKey = Object.keys(data).find(k => k.includes('Time Series'))
    if (!timeSeriesKey) {
      throw new Error('Invalid API response - no time series data found')
    }

    const timeSeries = data[timeSeriesKey]

    // Parse and return data
    return Object.entries(timeSeries)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'] || values['6. volume'] || '0')
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error('Failed to fetch market data:', error)
    throw error
  }
}

/**
 * Fetch cryptocurrency data
 * @param symbol - Crypto symbol (e.g., 'BTC', 'ETH')
 * @param market - Market currency (default: 'USD')
 */
export async function fetchCryptoData(
  symbol: string,
  market: string = 'USD'
): Promise<PriceData[]> {
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('Please set your Alpha Vantage API key in marketDataService.ts')
  }

  const params = new URLSearchParams({
    function: 'DIGITAL_CURRENCY_DAILY',
    symbol: symbol.toUpperCase(),
    market: market.toUpperCase(),
    apikey: API_KEY
  })

  try {
    const response = await fetch(`${BASE_URL}?${params}`)
    const data = await response.json()

    if (data['Error Message']) {
      throw new Error(`API Error: ${data['Error Message']}`)
    }

    const timeSeries = data['Time Series (Digital Currency Daily)']
    if (!timeSeries) {
      throw new Error('Invalid crypto data response')
    }

    return Object.entries(timeSeries)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values[`1a. open (${market})`]),
        high: parseFloat(values[`2a. high (${market})`]),
        low: parseFloat(values[`3a. low (${market})`]),
        close: parseFloat(values[`4a. close (${market})`]),
        volume: parseFloat(values['5. volume'])
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error('Failed to fetch crypto data:', error)
    throw error
  }
}

/**
 * Get sample/demo data for testing without API key
 */
export function getSampleData(): PriceData[] {
  const basePrice = 2500
  const data: PriceData[] = []
  const today = new Date()

  for (let i = 100; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const volatility = Math.random() * 50
    const trend = (100 - i) * 0.5
    const close = basePrice + trend + (Math.random() - 0.5) * volatility
    const open = close + (Math.random() - 0.5) * 20
    const high = Math.max(open, close) + Math.random() * 15
    const low = Math.min(open, close) - Math.random() * 15

    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000)
    })
  }

  return data
}
