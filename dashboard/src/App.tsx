import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SMA, EMA, RSI } from 'trading-signals'

type Indicator = 'SMA' | 'EMA' | 'RSI'

type Row = { index: number; close: number; result?: number }

function parseCSV(text: string): number[] {
  // expects header optionally and close column or single column
  const lines = text.trim().split(/\r?\n/)
  if (lines.length === 0) return []
  // detect comma or tab
  const sep = lines[0].includes(',') ? ',' : /\s+/
  const headers = lines[0].split(sep as any).map(h => String(h).toLowerCase())
  let start = 0
  let closeIdx = 0
  if (headers.some(h => ['close','price','adj close'].includes(h))) {
    closeIdx = headers.findIndex(h => ['close','price','adj close'].includes(h))
    start = 1
  }
  const values: number[] = []
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(sep as any)
    const v = Number(parts[closeIdx])
    if (!Number.isNaN(v)) values.push(v)
  }
  return values
}

function computeSeries(indicator: Indicator, period: number, prices: number[]): (number|undefined)[] {
  const out: (number|undefined)[] = []
  if (prices.length === 0) return out
  switch (indicator) {
    case 'SMA': {
      const ind = new SMA(period)
      for (const p of prices) { ind.update(p); out.push(ind.isStable ? ind.getResultOrThrow() : undefined) }
      return out
    }
    case 'EMA': {
      const ind = new EMA(period)
      for (const p of prices) { ind.update(p); out.push(ind.isStable ? ind.getResultOrThrow() : undefined) }
      return out
    }
    case 'RSI': {
      const ind = new RSI(period)
      for (const p of prices) { ind.update(p); out.push(ind.isStable ? ind.getResultOrThrow() : undefined) }
      return out
    }
  }
}

export default function App() {
  const [indicator, setIndicator] = useState<Indicator>('SMA')
  const [period, setPeriod] = useState(14)
  const [priceText, setPriceText] = useState('45,46,47,44,43,42,44,46,49,50,52,51,53,55,54,56,58,57,59,60')
  const [prices, setPrices] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // derive prices from text
  const manualPrices = useMemo(
    () => priceText.split(/[\s,]+/).map(Number).filter(n => !Number.isNaN(n)),
    [priceText]
  )

  useEffect(() => {
    setPrices(manualPrices)
  }, [priceText])

  const series = useMemo(() => computeSeries(indicator, period, prices), [indicator, period, prices])

  const rows: Row[] = useMemo(() => prices.map((p, i) => ({ index: i + 1, close: p, result: series[i] })), [prices, series])

  // simple inline sparkline canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')!
    const w = cvs.width = cvs.clientWidth
    const h = cvs.height = cvs.clientHeight
    ctx.clearRect(0, 0, w, h)
    if (series.length === 0) return
    const vals = series.filter(v => v !== undefined) as number[]
    if (vals.length === 0) return
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const y = (v: number) => max === min ? h/2 : h - ( (v - min) / (max - min) ) * h
    ctx.lineWidth = 2
    ctx.strokeStyle = '#1f7a8c'
    ctx.beginPath()
    let started = false
    for (let i = 0; i < series.length; i++) {
      const v = series[i]
      if (v === undefined) continue
      const x = (i / (series.length - 1)) * (w - 1)
      const yy = y(v)
      if (!started) { ctx.moveTo(x, yy); started = true } else { ctx.lineTo(x, yy) }
    }
    ctx.stroke()
  }, [series])

  function onCSVFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      const vals = parseCSV(text)
      if (vals.length) {
        setPrices(vals)
        setPriceText(vals.join(','))
      }
    }
    reader.readAsText(f)
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial, sans-serif', margin: '1rem auto', maxWidth: 980 }}>
      <h1>Trading Signals Dashboard</h1>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, alignItems: 'end' }}>
        <label>
          <div>Indicator</div>
          <select value={indicator} onChange={e => setIndicator(e.target.value as Indicator)}>
            <option value="SMA">SMA</option>
            <option value="EMA">EMA</option>
            <option value="RSI">RSI</option>
          </select>
        </label>
        <label>
          <div>Period</div>
          <input type="number" min={1} value={period} onChange={e => setPeriod(Math.max(1, parseInt(e.target.value || '1')))} />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          <div>Price data (comma/space separated)</div>
          <textarea rows={6} value={priceText} onChange={e => setPriceText(e.target.value)} />
        </label>
        <div>
          <button type="button" onClick={() => fileInputRef.current?.click()}>Upload CSV</button>
          <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={onCSVFile} style={{ display: 'none' }} />
        </div>
      </section>

      <section style={{ marginTop: 16, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Live Results</h3>
        <div style={{ overflow: 'auto', maxHeight: 320 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 6 }}>#</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #e2e8f0', padding: 6 }}>Close</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #e2e8f0', padding: 6 }}>{indicator}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.index}>
                  <td style={{ padding: 6 }}>{r.index}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.close.toFixed(4)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: r.result === undefined ? '#64748b' : '#0f172a' }}>
                    {r.result === undefined ? '—' : r.result.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3 style={{ margin: '8px 0' }}>{indicator} Visualization</h3>
        <div style={{ height: 180, border: '1px solid #e2e8f0', borderRadius: 8, padding: 4 }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: 172 }} />
        </div>
      </section>

      <p style={{ marginTop: 16, color: '#64748b' }}>
        Powered by trading-signals. This UI runs fully in the browser.
      </p>
    </div>
  )
}
