"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, Wallet, Activity, Star,
  ArrowUpRight, ArrowDownRight, Eye, Zap,
} from "lucide-react";
import { QuickWatchlist } from "@/components/ui/QuickWatchlist.tsx";

// ─── Mock Data ───
const TOP_MOVERS = [
  { symbol: "BONK", price: 0.00001245, change: 12.4 },
  { symbol: "WIF", price: 2.84, change: -3.2 },
  { symbol: "POPCAT", price: 0.412, change: 8.7 },
  { symbol: "JUP", price: 0.921, change: -1.8 },
  { symbol: "PYTH", price: 0.384, change: 5.2 },
];

const NETWORK_STATS = [
  { label: "Daily Active", value: "4.16M", change: "+6.2%", up: true },
  { label: "DeFi TVL", value: "$4.77B", change: "-2.15%", up: false },
  { label: "Stablecoins", value: "$15.1B", change: "+5.8%", up: true },
  { label: "Chain Fees", value: "$342K", change: "Stable", up: true },
];

const HOLDINGS = [
  { token: "SOL", amount: "42.5", value: 7565, pnl: 552, pct: 2.1 },
  { token: "BONK", amount: "124.5M", value: 1494, pnl: 1248, pct: 12.4 },
  { token: "WIF", amount: "8,420", value: 23912, pnl: -3031, pct: -3.2 },
  { token: "POPCAT", amount: "12,800", value: 5274, pnl: 793, pct: 8.7 },
  { token: "JUP", amount: "5,200", value: 4789, pnl: -306, pct: -1.8 },
];

const WHALE_MOVES = [
  { time: "2m ago", wallet: "0x7a3F...3f2e", action: "BUY", token: "BONK", amount: "420 SOL", impact: "high" },
  { time: "8m ago", wallet: "0x9e0D...c7F3", action: "SELL", token: "WIF", amount: "180 SOL", impact: "med" },
  { time: "15m ago", wallet: "0x12aB...9f3e", action: "BUY", token: "PYTH", amount: "95 SOL", impact: "med" },
  { time: "22m ago", wallet: "0x3bC8...f2A9", action: "BUY", token: "JUP", amount: "62 SOL", impact: "low" },
  { time: "31m ago", wallet: "0x5cA2...b1E4", action: "SELL", token: "BONK", amount: "340 SOL", impact: "high" },
];

const ACTIVE_POSITIONS = [
  { token: "SOL", entry: 165, current: 178, qty: 42.5, pnl: 552, pct: 2.1 },
  { token: "BONK", entry: 0.000008, current: 0.000012, qty: "124.5M", pnl: 1248, pct: 12.4 },
  { token: "WIF", entry: 3.2, current: 2.84, qty: 8420, pnl: -3031, pct: -3.2 },
  { token: "POPCAT", entry: 0.35, current: 0.412, qty: 12800, pnl: 793, pct: 8.7 },
];

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  if (p >= 0.0001) return `$${p.toFixed(6)}`;
  return `$${p.toFixed(8)}`;
}

export default function DashboardOverview() {
  const [totalValue, setTotalValue] = useState(42847);
  const totalPnl = HOLDINGS.reduce((s, h) => s + h.pnl, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalValue((prev) => prev + Math.floor((Math.random() - 0.48) * 50));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* ─── Row 1: Portfolio (7) + Right Column (5) ─── */}
        <div className="xl:col-span-7 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-3.5 h-3.5 text-[#00ff9f]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Portfolio Value</span>
            </div>
            <span className="font-mono text-[10px] text-[#52525b]">{HOLDINGS.length} assets</span>
          </div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-4xl font-semibold tracking-tight">${totalValue.toLocaleString()}</span>
            <span className={["font-mono text-sm font-bold", totalPnl >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()} today
            </span>
          </div>

          {/* Mini holdings table */}
          <table className="w-full text-sm font-mono mt-3">
            <thead>
              <tr className="text-[#52525b] text-[9px] border-b border-[#222]">
                <th className="text-left py-1.5 px-2">Token</th>
                <th className="text-right py-1.5 px-2">Amount</th>
                <th className="text-right py-1.5 px-2">Value</th>
                <th className="text-right py-1.5 px-2">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {HOLDINGS.map((h) => (
                <tr key={h.token} className="hover:bg-[#1a1a1a]">
                  <td className="py-1.5 px-2 text-[#00ff9f] font-bold text-[11px]">${h.token}</td>
                  <td className="py-1.5 px-2 text-right text-white text-[11px]">{h.amount}</td>
                  <td className="py-1.5 px-2 text-right text-white text-[11px]">${h.value.toLocaleString()}</td>
                  <td className={["py-1.5 px-2 text-right text-[11px] font-bold", h.pnl >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                    {h.pnl >= 0 ? "+" : ""}${h.pnl.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Right Column (5) ─── */}
        <div className="xl:col-span-5 space-y-4">
          {/* Top Movers */}
          <div className="bg-[#161616] border border-[#222] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-[#00ff9f]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Top Movers (24H)</span>
            </div>
            <div className="space-y-2">
              {TOP_MOVERS.map((m) => (
                <div key={m.symbol} className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-white font-bold">${m.symbol}</span>
                  <span className="font-mono text-[11px] text-[#52525b]">{formatPrice(m.price)}</span>
                  <span className={["font-mono text-[11px] font-bold", m.change >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                    {m.change >= 0 ? "+" : ""}{m.change}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Solana Network */}
          <div className="bg-[#161616] border border-[#222] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-3.5 h-3.5 text-[#9945FF]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Solana Network</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {NETWORK_STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-mono text-[9px] text-[#52525b]">{s.label}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-[11px] text-white font-bold">{s.value}</span>
                    <span className={["font-mono text-[9px]", s.up ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>{s.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Watchlist */}
          <QuickWatchlist />
        </div>

        {/* ─── Row 2: Active Positions (6) + Whale Movements (6) ─── */}
        <div className="xl:col-span-6 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#00ff9f]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Active Positions</span>
            </div>
            <span className="font-mono text-[10px] text-[#52525b]">{ACTIVE_POSITIONS.length} open</span>
          </div>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-[#52525b] text-[9px] border-b border-[#222]">
                <th className="text-left py-1.5 px-2">Token</th>
                <th className="text-right py-1.5 px-2">Entry</th>
                <th className="text-right py-1.5 px-2">Current</th>
                <th className="text-right py-1.5 px-2">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {ACTIVE_POSITIONS.map((p) => (
                <tr key={p.token} className="hover:bg-[#1a1a1a]">
                  <td className="py-1.5 px-2 text-[#00ff9f] font-bold text-[11px]">${p.token}</td>
                  <td className="py-1.5 px-2 text-right text-[#52525b] text-[11px]">{formatPrice(p.entry)}</td>
                  <td className="py-1.5 px-2 text-right text-white text-[11px]">{formatPrice(p.current)}</td>
                  <td className={["py-1.5 px-2 text-right text-[11px] font-bold", p.pnl >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                    {p.pnl >= 0 ? "+" : ""}${p.pnl.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="xl:col-span-6 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Whale Movements (Live)</span>
            </div>
            <span className="font-mono text-[9px] text-[#00ff9f] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" /> LIVE
            </span>
          </div>
          <div className="space-y-2">
            {WHALE_MOVES.map((w, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-[#222] last:border-0">
                <div className="flex items-center gap-2">
                  <span className={["font-mono text-[10px] font-bold", w.action === "BUY" ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                    {w.action}
                  </span>
                  <span className="font-mono text-[11px] text-[#3b82f6]">{w.wallet}</span>
                </div>
                <span className="font-mono text-[11px] text-white">{w.amount} {w.token}</span>
                <span className="font-mono text-[10px] text-[#52525b]">{w.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
