# Trading Signals Dashboard - Setup Instructions

## ✅ Already Completed

1. ✅ Dashboard structure created with React + TypeScript + Vite
2. ✅ Market data service file created (`src/services/marketDataService.ts`)
3. ✅ Package.json updated with all required dependencies:
   - chart.js & react-chartjs-2 (charting)
   - lightweight-charts (candlestick charts)
   - jspdf & jspdf-autotable (PDF export)
   - papaparse (CSV parsing)
4. ✅ GitHub Pages deployment configured
5. ✅ Interactive indicator demos working

---

## 🔴 REQUIRED: What You Need to Do Manually

### 1. Get Alpha Vantage API Key (5 minutes)

**Free Tier:** 25 API calls/day (sufficient for testing)

**Steps:**
1. Visit: https://www.alphavantage.co/support/#api-key
2. Enter your email
3. Click "GET FREE API KEY"
4. Copy the API key (looks like: `ABC123DEF456GHI789`)

**Then update the file:**
```bash
dashboard/src/services/marketDataService.ts
```

**Line 5 - Replace:**
```typescript
const API_KEY = 'YOUR_API_KEY_HERE'
```

**With your actual key:**
```typescript
const API_KEY = 'ABC123DEF456GHI789'  // <-- your real key
```

---

### 2. Install Dependencies Locally (2 minutes)

```bash
# Clone the repo (if not already)
git clone https://github.com/ssrajesh20-alcemax/trading-signals.git
cd trading-signals/dashboard

# Install all dependencies
npm install

# Start development server
npm run dev
```

This will open the dashboard at `http://localhost:5173`

---

### 3. Build and Deploy (1 minute)

```bash
# Build for production
npm run build

# Commit and push (triggers auto-deploy to GitHub Pages)
git add .
git commit -m "feat: Add API key and build dashboard"
git push origin main
```

Your dashboard will be live at:
```
https://ssrajesh20-alcemax.github.io/trading-signals/
```

---

## 📋 Optional Enhancements (Do Later)

These additional files can be added for more features:

### A. Components to Create

**1. Candlestick Chart Component**
Create: `src/components/CandlestickChart.tsx`
- Use lightweight-charts library
- Display OHLC data visually

**2. Export Buttons Component**
Create: `src/components/ExportButtons.tsx`
- CSV export using papaparse
- PDF export using jspdf

**3. Signal Alert Component**
Create: `src/components/SignalAlerts.tsx`
- Detect buy/sell signals
- Browser notifications

### B. Utility Files

**1. Signal Detector**
Create: `src/utils/signalDetector.ts`
```typescript
export function detectSignals(rsi: number, prices: number[]) {
  const signals = []
  if (rsi < 30) signals.push({ type: 'BUY', reason: 'RSI Oversold' })
  if (rsi > 70) signals.push({ type: 'SELL', reason: 'RSI Overbought' })
  return signals
}
```

**2. Export Functions**
Create: `src/utils/exportUtils.ts`
```typescript
import Papa from 'papaparse'
import { jsPDF } from 'jspdf'

export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

export function exportToPDF(data: any[], filename: string) {
  const doc = new jsPDF()
  doc.text('Trading Signals Report', 10, 10)
  // Add table with data
  doc.save(filename)
}
```

---

## 🎯 Quick Start (For Testing)

If you don't have an API key yet, the dashboard already has **sample data**:

```typescript
import { getSampleData } from './services/marketDataService'

// Use in your component:
const sampleData = getSampleData()
```

---

## 🔗 Useful Links

- **Live Dashboard:** https://ssrajesh20-alcemax.github.io/trading-signals/
- **Alpha Vantage API Docs:** https://www.alphavantage.co/documentation/
- **Chart.js Docs:** https://www.chartjs.org/docs/
- **Lightweight Charts:** https://tradingview.github.io/lightweight-charts/
- **trading-signals NPM:** https://www.npmjs.com/package/trading-signals

---

## 🐛 Troubleshooting

**Problem:** API rate limit exceeded  
**Solution:** Wait 1 minute or use `getSampleData()` for testing

**Problem:** Build fails  
**Solution:** Run `npm install` again and check Node.js version (requires 18+)

**Problem:** GitHub Pages shows 404  
**Solution:** Check Settings → Pages is set to deploy from `main` branch

---

## 📊 Current Features Working

✅ Interactive indicator calculations (SMA, EMA, RSI)  
✅ Manual price input  
✅ Code examples for each indicator  
✅ Sample data generation  
✅ Multiple indicator categories  
✅ Educational content  
✅ Responsive navigation  

---

## 🚀 Next Features to Add

1. Real-time stock symbol input + data fetching
2. Candlestick charts
3. Export to CSV/PDF
4. Signal detection alerts
5. Multi-timeframe analysis
6. Dark/light theme toggle
7. Save favorite indicators

---

**Questions?** Check the GitHub Issues or open a new one!
