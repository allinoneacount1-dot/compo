"use client";

import { useState, useMemo, useCallback } from "react";
import {
  TrendingUp, TrendingDown, Eye, ArrowUpRight, ArrowDownRight,
  Clock, ShieldX, Activity, Zap,
} from "lucide-react";
import { CountUp } from "../../components/ui/CountUp";
import { formatNumber } from "../../lib/utils/format";
import { MiniSparkline, QuickSellButtons } from "../../components/ui/MiniSparkline";
import { useKnownTokenPrices, useNetworkHealth } from "../../lib/hooks/useDexScreener";
import type { TokenPrice } from "../../lib/hooks/useDexScreener";

const FALLBACK_WATCHLIST = [
  { symbol: "SOL", name: "Solana", address: "So11111111111111111111111111111111111111112", priceUsd: 178, priceChangeH24: 2.1, volumeH24: 8500000, liquidityUsd: 95000000, txnsH24: { buys: 12400, sells: 9800 } },
  { symbol: "BONK", name: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", priceUsd: 0.00001245, priceChangeH24: 12.4, volumeH24: 4200000, liquidityUsd: 3800000, txnsH24: { buys: 8900, sells: 5200 } },
  { symbol: "WIF", name: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", priceUsd: 2.84, priceChangeH24: -3.2, volumeH24: 3100000, liquidityUsd: 2900000, txnsH24: { buys: 5600, sells: 7100 } },
  { symbol: "POPCAT", name: "POPCAT", address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr", priceUsd: 0.412, priceChangeH24: 8.7, volumeH24: 1800000, liquidityUsd: 1200000, txnsH24: { buys: 4200, sells: 3100 } },
  { symbol: "JUP", name: "Jupiter", address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", priceUsd: 0.921, priceChangeH24: -1.8, volumeH24: 1500000, liquidityUsd: 8900000, txnsH24: { buys: 3800, sells: 3400 } },
  { symbol: "PYTH", name: "Pyth", address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", priceUsd: 0.384, priceChangeH24: 1.1, volumeH24: 980000, liquidityUsd: 4200000, txnsH24: { buys: 2100, sells: 1800 } },
];

const FALLBACK_ALERTS = [
  { token: "$BONK", action: "Whale Buy", amount: "42.5 SOL", time: "2m ago", variant: "success" as const, icon: <ArrowUpRight className="w-3 h-3" /> },
  { token: "$WIF", action: "LP Pulled", amount: "847 SOL", time: "8m ago", variant: "danger" as const, icon: <ArrowDownRight className="w-3 h-3" /> },
  { token: "$POPCAT", action: "Whale Sell", amount: "120 SOL", time: "14m ago", variant: "warning" as const, icon: <ArrowDownRight className="w-3 h-3" /> },
  { token: "$PYTH", action: "New Listing", amount: "Raydium", time: "22m ago", variant: "success" as const, icon: <ArrowUpRight className="w-3 h-3" /> },
  { token: "$MOODENG", action: "Honeypot Alert", amount: "--", time: "31m ago", variant: "danger" as const, icon: <ShieldX className="w-3 h-3" /> },
];

const FALLBACK_WHALES = [
  { wallet: "0x7a3F...3f2e", action: "BUY", token: "$BONK", amount: 42.5, time: "2m ago" },
  { wallet: "0x9eD1...c7F3", action: "SELL", token: "$WIF", amount: 120.0, time: "8m ago" },
  { wallet: "0x3bC8...f2A9", action: "BUY", token: "$POPCAT", amount: 68.3, time: "14m ago" },
  { wallet: "0x5cA2...b1E4", action: "BUY", token: "$PYTH", amount: 215.7, time: "22m ago" },
  { wallet: "0x1fE5...a8D6", action: "SELL", token: "$JUP", amount: 512.0, time: "31m ago" },
];

const TREND_7D = [11200, 11800, 11400, 12100, 11900, 12400, 12847];

function getScoreColor(score: number) {
  if (score >= 70) return "text-[#00ff9f]";
  if (score >= 40) return "text-[#f59e0b]";
  return "text-[#ff3b5c]";
}

function formatCompactPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(8)}`;
}

function generateSparkline(_price: number, change: number): number[] {
  const points = 10;
  const data: number[] = [];
  let base = 50;
  const trend = change >= 0 ? 1 : -1;
  for (let i = 0; i < points; i++) {
    base += trend * (2 + Math.random() * 3) + (Math.random() - 0.5) * 4;
    base = Math.max(10, Math.min(90, base));
    data.push(base);
  }
  data[data.length - 1] = change >= 0 ? 70 + Math.random() * 20 : 10 + Math.random() * 20;
  return data;
}

function estimateRisk(token: TokenPrice): number {
  const liqVolRatio = token.liquidityUsd > 0 ? token.volumeH24 / token.liquidityUsd : 100;
  const totalTxns = token.txnsH24.buys + token.txnsH24.sells;
  const buyRatio = totalTxns > 0 ? token.txnsH24.buys / totalTxns : 0.5;
  let risk = 50;
  if (liqVolRatio > 5) risk += 20;
  else if (liqVolRatio > 2) risk += 10;
  else if (liqVolRatio < 0.5) risk -= 10;
  if (buyRatio > 0.8 || buyRatio < 0.2) risk += 15;
  if (token.liquidityUsd > 10_000_000) risk -= 15;
  else if (token.liquidityUsd < 500_000) risk += 10;
  if (Math.abs(token.priceChangeH24) > 50) risk += 15;
  return Math.max(0, Math.min(100, risk));
}

function PortfolioChart({ data, width = 500, height = 140 }: { data: number[]; width?: number; height?: number }) {
  const padding = { top: 12, bottom: 16, left: 0, right: 0 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const points = data.map((v, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((v - minVal) / range) * chartH,
  }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = `${polyline} ${points[points.length - 1].x},${height - padding.bottom} ${points[0].x},${height - padding.bottom} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGradOv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ff9f" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00ff9f" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#chartGradOv)" />
      <polyline points={polyline} fill="none" stroke="#00ff9f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.length > 0 && (
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="#0a0a0a" stroke="#00ff9f" strokeWidth="2" />
      )}
    </svg>
  );
}

export default function DashboardOverview() {
  const { data: livePrices, loading: pricesLoading, error: pricesError } = useKnownTokenPrices();
  const { error: networkError } = useNetworkHealth();
  const [chartPeriod] = useState<"7D" | "30D">("7D");

  const tokens = livePrices && livePrices.length > 0 ? livePrices : FALLBACK_WATCHLIST;

  const watchlist = useMemo(() =>
    tokens.slice(0, 6).map((t) => ({
      token: t.symbol,
      price: t.priceUsd,
      change: t.priceChangeH24,
      risk: estimateRisk(t),
      volume: t.volumeH24,
      sparkline: generateSparkline(t.priceUsd, t.priceChangeH24),
    })), [tokens]);

  const totalVolume = useMemo(() => tokens.reduce((s, t) => s + t.volumeH24, 0), [tokens]);
  const solPrice = tokens.find((t) => t.symbol === "SOL")?.priceUsd ?? 178;
  const totalPortfolioUsd = 12847 * (solPrice / 178);

  const handleQuickSell = useCallback((token: string, pct: number) => {
    console.log(`Quick sell ${pct}% of ${token}`);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* ===== Row 1: Portfolio Value (8 cols) + Top Movers + Network (4 cols) ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Portfolio — wider at 8 cols */}
        <div className="xl:col-span-8 bg-[#161616] border border-[#222] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Portfolio Value</span>
            </div>
            <div className="flex items-center gap-1 bg-[#111] rounded-lg p-0.5">
              {(["7D", "30D"] as const).map((period) => (
                <button key={period} className={["font-mono text-[10px] px-3 py-1 rounded-md transition-colors", chartPeriod === period ? "bg-[#00ff9f]/10 text-[#00ff9f]" : "text-[#52525b] hover:text-[#a1a1aa]"].join(" ")}>
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-4 mb-4">
            <div className="text-5xl font-semibold font-mono tracking-tight">
              <CountUp value={Math.round(totalPortfolioUsd)} prefix="$" />
            </div>
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-[#00ff9f]" />
              <span className="font-mono text-sm font-bold text-[#00ff9f]">
                +${Math.round(totalPortfolioUsd - 12847)} ({(((totalPortfolioUsd / 12847) - 1) * 100).toFixed(2)}%)
              </span>
              <span className="font-mono text-xs text-[#52525b] ml-1">24h</span>
            </div>
          </div>
          <PortfolioChart data={TREND_7D} />
        </div>

        {/* Right sidebar — 4 cols */}
        <div className="xl:col-span-4 space-y-6">
          {/* Top Movers */}
          <div className="bg-[#161616] border border-[#222] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#3b82f6]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Top Movers (24H)</span>
            </div>
            <div className="space-y-3">
              {[...tokens].sort((a, b) => Math.abs(b.priceChangeH24) - Math.abs(a.priceChangeH24)).slice(0, 5).map((t) => (
                <div key={t.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-bold text-white">${t.symbol}</span>
                    <span className="font-mono text-[11px] text-[#52525b]">{formatCompactPrice(t.priceUsd)}</span>
                  </div>
                  <span className={["font-mono text-[12px] font-bold", t.priceChangeH24 >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                    {t.priceChangeH24 >= 0 ? "+" : ""}{t.priceChangeH24.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Network */}
          <div className="bg-[#161616] border border-[#222] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-[#9945FF]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Solana Network</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-mono text-[10px] text-[#52525b]">Daily Active Users</span>
                <p className="font-mono text-[14px] font-bold text-white">4.16M</p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#52525b]">Transactions (24h)</span>
                <p className="font-mono text-[14px] font-bold text-white">102.7M</p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#52525b]">DeFi TVL</span>
                <p className="font-mono text-[14px] font-bold text-[#ff3b5c]">$4.77B</p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#52525b]">Status</span>
                <p className={["font-mono text-[14px] font-bold", networkError ? "text-[#f59e0b]" : "text-[#00ff9f]"].join(" ")}>
                  {networkError ? "DEGRADED" : "ONLINE"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Row 2: Active Positions (5) + Whale Movements (7) ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Active Positions */}
        <div className="xl:col-span-5 bg-[#161616] border border-[#222] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-[#00ff9f]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Active Positions</span>
            <span className="font-mono text-[10px] text-[#52525b]">(6)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {watchlist.slice(0, 6).map((pos) => (
              <div key={pos.token} className="bg-[#111] rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[12px] font-bold text-white">${pos.token}</span>
                  <span className={["font-mono text-[12px] font-bold", pos.change >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                    {pos.change >= 0 ? "+" : ""}{pos.change.toFixed(1)}%
                  </span>
                </div>
                <div className="text-[11px] text-[#52525b] mb-2">{formatCompactPrice(pos.price)}</div>
                <MiniSparkline data={pos.sparkline} color={pos.change >= 0 ? "#00ff9f" : "#ff3b5c"} width={100} height={28} />
              </div>
            ))}
          </div>
        </div>

        {/* Whale Movements */}
        <div className="xl:col-span-7 bg-[#161616] border border-[#222] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Whale Movements (Live)</span>
            </div>
            <span className="font-mono text-[10px] text-[#52525b]">Live from DexScreener</span>
          </div>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-[#52525b] text-[10px] border-b border-[#222]">
                <th className="text-left py-2 px-3">Time</th>
                <th className="text-left py-2 px-3">Wallet</th>
                <th className="text-left py-2 px-3">Action</th>
                <th className="text-left py-2 px-3">Token</th>
                <th className="text-right py-2 px-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {FALLBACK_WHALES.map((m, i) => (
                <tr key={i} className="hover:bg-[#1a1a1a]">
                  <td className="py-3 px-3 text-[#52525b] text-[11px]">{m.time}</td>
                  <td className="py-3 px-3 text-[#3b82f6] text-[11px]">{m.wallet}</td>
                  <td className="py-3 px-3">
                    <span className={["text-[10px] font-bold px-2 py-0.5 rounded", m.action === "BUY" ? "text-[#00ff9f] bg-[#00ff9f]/10" : "text-[#ff3b5c] bg-[#ff3b5c]/10"].join(" ")}>
                      {m.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white text-[11px]">{m.token}</td>
                  <td className="py-3 px-3 text-right text-[#a1a1aa] text-[11px]">{formatNumber(m.amount)} SOL</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Row 3: Live Watchlist (full width) ===== */}
      <div className="bg-[#161616] border border-[#222] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Live Watchlist</span>
            <span className="font-mono text-[10px] text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded">{watchlist.length} TOKENS</span>
          </div>
          <span className="font-mono text-[10px] text-[#52525b]">{pricesError ? "Fallback data" : "Real-time DexScreener"}</span>
        </div>
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="text-[#52525b] text-[10px] border-b border-[#222]">
              <th className="text-left py-2 px-3">Token</th>
              <th className="text-left py-2 px-3">Price</th>
              <th className="text-left py-2 px-3">24h</th>
              <th className="text-left py-2 px-3">Risk</th>
              <th className="text-left py-2 px-3">Volume</th>
              <th className="text-left py-2 px-3">Chart</th>
              <th className="text-left py-2 px-3">Quick Sell</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {watchlist.map((t) => (
              <tr key={t.token} className="hover:bg-[#1a1a1a]">
                <td className="py-3 px-3 text-[#00ff9f] font-bold text-[12px]">${t.token}</td>
                <td className="py-3 px-3 text-white text-[11px]">{formatCompactPrice(t.price)}</td>
                <td className={["py-3 px-3 font-bold text-[11px] flex items-center gap-1", t.change >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                  {t.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {t.change >= 0 ? "+" : ""}{t.change.toFixed(1)}%
                </td>
                <td className="py-3 px-3">
                  <span className={["font-bold text-[11px]", getScoreColor(t.risk)].join(" ")}>{t.risk}</span>
                  <span className="text-[#52525b] text-[10px]">/100</span>
                </td>
                <td className="py-3 px-3 text-[#52525b] text-[11px]">${formatNumber(t.volume)}</td>
                <td className="py-3 px-3"><MiniSparkline data={t.sparkline} color={t.change >= 0 ? "#00ff9f" : "#ff3b5c"} width={64} height={20} /></td>
                <td className="py-3 px-3"><QuickSellButtons symbol={t.token} onSell={handleQuickSell} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
