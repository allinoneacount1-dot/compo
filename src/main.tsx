import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startMarketRefresh, useMarketStore } from './lib/stores/market-store'

// Initialize market data on startup
if (typeof window !== 'undefined') {
  useMarketStore.getState().refresh()
  startMarketRefresh(30_000)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
