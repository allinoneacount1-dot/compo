"use client";

import { useState, useEffect } from "react";
import { Activity, TrendingUp, Zap, AlertTriangle, Eye, BarChart3 } from "lucide-react";

const NETWORK_METRICS = [
  { label: "Daily Active Users", value: "4.16M", change: "+6.2%", positive: true },
  { label: "Transactions (24h)", value: "102.7M", change: "Stable", positive: true },
  { label: "DeFi TVL", value: "$4.77B", change: "-2.15%", positive: false },
  { label: "Stablecoin Mcap", value: "$15.1B", change: "+5.8%", positive: true },
  { label: "RWA Mcap", value: "$2.81B", change: "+67%", positive: true },
  { label: "Chain Fees (24h)", value: "$342K", change: "Stable", positive: true },
];

const SMART_MONEY = [
  { wallet: "0x7a3F...3f2e", action: "Bought 420 SOL of BONK", time: "2m ago", type: "buy" },
  { wallet: "0x9e0D...c7F3", action: "Sold 180 SOL of WIF", time: "8m ago", type: "sell" },
  { wallet: "0x12aB...9f3e", action: "Accumulating RWA tokens", time: "15m ago", type: "buy" },
  { wallet: "0x3bC8...f2A9", action: "Added 95 SOL to JUP", time: "22m ago", type: "buy" },
];

const ONCHAIN_EVENTS = [
  { time: "just now", event: "Large Smart Money Buy", detail: "0x7a3F...3f2e bought 420 SOL of BONK", impact: "+High", positive: true },
  { time: "3m ago", event: "Whale Distribution", detail: "0x9e0D...c7F3 moved 180 SOL to Binance", impact: "-Medium", positive: false },
  { time: "7m ago", event: "RWA Inflow", detail: "New $2.1M tokenized treasury deposit", impact: "+High", positive: true },
  { time: "12m ago", event: "New Token Launch", detail: "Memecoin with 12k SOL liquidity added", impact: "Watch", positive: true },
  { time: "18m ago", event: "Honeypot Detected", detail: "Rug pattern detected on new token", impact: "-High", positive: false },
  { time: "25m ago", event: "Smart Money Accumulation", detail: "Known alpha wallet buying PYTH", impact: "+Medium", positive: true },
];

const KEY_INSIGHTS = [
  { label: "Whale Accumulation", value: "BONK, JUP, PYTH", trend: "bullish" },
  { label: "Smart Money Flow", value: "+$12.4M (24h)", trend: "bullish" },
  { label: "Rug Pulls Detected", value: "3 today", trend: "warning" },
  { label: "New Token Launches", value: "47 (24h)", trend: "neutral" },
  { label: "Liquidity Added", value: "$8.2M (24h)", trend: "bullish" },
  { label: "Large Sell Walls", value: "WIF @ $3.20", trend: "bearish" },
];

export default function OnChainIntelPage() {
  const [alphaScore, setAlphaScore] = useState(87);
  const [events, setEvents] = useState(ONCHAIN_EVENTS);

  // Alpha score: stable fluctuation, no overflow
  useEffect(() => {
    const interval = setInterval(() => {
      setAlphaScore((prev) => {
        const delta = (Math.random() - 0.5) * 2;
        const next = Math.round(prev + delta);
        return Math.max(80, Math.min(95, next));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Live events feed
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvents = [
        { event: "Large Smart Money Buy", detail: "0x7a3F...3f2e bought 420 SOL of BONK", impact: "+High", positive: true },
        { event: "Whale Distribution", detail: "0x9e0D...c7F3 moved 180 SOL to Binance", impact: "-Medium", positive: false },
        { event: "RWA Inflow", detail: "New $2.1M tokenized treasury deposit", impact: "+High", positive: true },
        { event: "New Token Launch", detail: "Memecoin with 12k SOL liquidity", impact: "Watch", positive: true },
        { event: "Honeypot Detected", detail: "Rug pattern detected", impact: "-High", positive: false },
      ];
      const randomEvent = newEvents[Math.floor(Math.random() * newEvents.length)];
      setEvents((prev) => [{ time: "just now", ...randomEvent }, ...prev].slice(0, 8));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const alphaLabel = alphaScore >= 90 ? "EXCELLENT" : alphaScore >= 80 ? "STRONG" : alphaScore >= 70 ? "MODERATE" : "WEAK";

  return (
    <div className="p-4">
      {/* Header — compact */}
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-4 h-4 text-[#00ff9f]" />
        <h1 className="text-lg font-semibold">On-Chain Intel</h1>
        <div className="px-2 py-0.5 text-[9px] bg-[#00ff9f] text-black rounded font-bold flex items-center gap-1">
          <span className="w-1 h-1 bg-black rounded-full animate-pulse" />
          LIVE
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Row 1: Network Health (4) + Smart Money (5) + Alpha Score (3) */}
        <div className="xl:col-span-4 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5 text-[#9945FF]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Network Health</span>
          </div>
          <div className="space-y-2">
            {NETWORK_METRICS.map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#52525b]">{m.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] font-bold text-white">{m.value}</span>
                  <span className={["font-mono text-[9px]", m.positive ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>{m.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-5 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Smart Money Flow (24H)</span>
          </div>
          <div className="space-y-2">
            {SMART_MONEY.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-[#222] last:border-0">
                <div className="flex items-center gap-2">
                  <span className={["w-1.5 h-1.5 rounded-full", s.type === "buy" ? "bg-[#00ff9f]" : "bg-[#ff3b5c]"].join(" ")} />
                  <span className="font-mono text-[10px] text-[#3b82f6]">{s.wallet}</span>
                </div>
                <span className="font-mono text-[10px] text-[#52525b] flex-1 text-right px-2 truncate">{s.action}</span>
                <span className="font-mono text-[9px] text-[#52525b]">{s.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alpha Score — fixed, clean, no overflow */}
        <div className="xl:col-span-3 bg-[#161616] border border-[#222] rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="font-mono text-[9px] text-[#52525b] uppercase tracking-wider mb-1">Solana Alpha Score</span>
          <span className="text-5xl font-bold text-[#00ff9f] leading-none">{alphaScore}</span>
          <span className="font-mono text-[10px] text-[#52525b] mt-0.5">/100</span>
          <span className="font-mono text-[9px] text-[#00ff9f] mt-1 font-bold">{alphaLabel}</span>
        </div>

        {/* Row 2: Live Events (8) + Key Insights (4) */}
        <div className="xl:col-span-8 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Live On-Chain Events</span>
            </div>
            <span className="font-mono text-[9px] text-[#00ff9f] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" /> LIVE
            </span>
          </div>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-[#52525b] text-[9px] border-b border-[#222]">
                <th className="text-left py-1.5 px-2">Time</th>
                <th className="text-left py-1.5 px-2">Event</th>
                <th className="text-left py-1.5 px-2">Details</th>
                <th className="text-right py-1.5 px-2">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {events.map((ev, i) => (
                <tr key={i} className="hover:bg-[#1a1a1a]">
                  <td className="py-1.5 px-2 text-[#52525b] text-[10px]">{ev.time}</td>
                  <td className="py-1.5 px-2 text-white text-[10px] font-semibold">{ev.event}</td>
                  <td className="py-1.5 px-2 text-[#a1a1aa] text-[10px]">{ev.detail}</td>
                  <td className={["py-1.5 px-2 text-right text-[10px] font-bold", ev.impact.includes("+") ? "text-[#00ff9f]" : ev.impact.includes("-") ? "text-[#ff3b5c]" : "text-[#f59e0b]"].join(" ")}>{ev.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Insights — fills right side */}
        <div className="xl:col-span-4 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-[#00ff9f]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Key Insights</span>
          </div>
          <div className="space-y-2">
            {KEY_INSIGHTS.map((ins, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#222] last:border-0">
                <span className="font-mono text-[10px] text-[#52525b]">{ins.label}</span>
                <span className={[
                  "font-mono text-[10px] font-bold",
                  ins.trend === "bullish" ? "text-[#00ff9f]" :
                  ins.trend === "bearish" ? "text-[#ff3b5c]" :
                  ins.trend === "warning" ? "text-[#f59e0b]" : "text-[#a1a1aa]",
                ].join(" ")}>{ins.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
