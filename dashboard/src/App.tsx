import React, { useMemo, useState } from 'react'
import { SMA, EMA, RSI } from 'trading-signals'

type Indicator = 'SMA' | 'EMA' | 'RSI'

function compute(indicator: Indicator, period: number, prices: number[]): number | undefined {
  if (prices.length === 0) return undefined
  switch (indicator) {
    case 'SMA': {
      const ind = new SMA(period)
      ind.updates(prices)
      return ind.isStable ? ind.getResultOrThrow() : undefined
    }
    case 'EMA': {
      const ind = new EMA(period)
      ind.updates(prices)
      return ind.isStable ? ind.getResultOrThrow() : undefined
    }
    case 'RSI': {
      const ind = new RSI(period)
      ind.updates(prices)
      return ind.isStable ? ind.getResultOrThrow() : undefined
    }
  }
}

export default function App() {
  const [indicator, setIndicator] = useState<Indicator>('SMA')
  const [period, setPeriod] = useState(14)
  const [priceText, setPriceText] = useState('45,46,47,44,43,42,44,46,49,50')

  const prices = useMemo(
    () => priceText.split(/[\s,]+/).map(Number).filter(n => !Number.isNaN(n)),
    [priceText]
  )
  const result = useMemo(() => compute(indicator, period, prices), [indicator, period, prices])

  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', maxWidth: 800, margin: '2rem auto' }}>
      <h1>Trading Signals Dashboard</h1>
      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <label>
          Indicator
          <select value={indicator} onChange={e => setIndicator(e.target.value as Indicator)}>
            <option value="SMA">SMA</option>
            <option value="EMA">EMA</option>
            <option value="RSI">RSI</option>
          </select>
        </label>
        <label>
          Period
          <input type="number" min={1} value={period} onChange={e => setPeriod(parseInt(e.target.value || '1'))} />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Price data (comma or space separated)
          <textarea rows={6} value={priceText} onChange={e => setPriceText(e.target.value)} />
        </label>
      </section>
      <section style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2>Result</h2>
        <div>
          {result === undefined ? 'Not enough data for selected period.' : result.toFixed(4)}
        </div>
      </section>
      <p style={{ color: '#666', marginTop: '1rem' }}>
        Powered by trading-signals. This UI runs fully in the browser.
      </p>
    </div>
  )
}
