"use client";

import { useState, useEffect } from "react";
import { Radio, Eye, TrendingUp, TrendingDown, Filter } from "lucide-react";

const WHALE_TX = [
  { time: "2m ago", wallet: "0x7a3F...3f2e", action: "BUY", token: "BONK", amount: "420 SOL", usd: "$74.8k", impact: "high" },
  { time: "5m ago", wallet: "0x9e0D...c7F3", action: "SELL", token: "WIF", amount: "180 SOL", usd: "$51.1k", impact: "med" },
  { time: "8m ago", wallet: "0x12aB...9f3e", action: "BUY", token: "PYTH", amount: "95 SOL", usd: "$16.9k", impact: "med" },
  { time: "12m ago", wallet: "0x3bC8...f2A9", action: "BUY", token: "JUP", amount: "62 SOL", usd: "$11.0k", impact: "low" },
  { time: "18m ago", wallet: "0x5cA2...b1E4", action: "SELL", token: "BONK", amount: "340 SOL", usd: "$60.5k", impact: "high" },
  { time: "25m ago", wallet: "0x8dF3...a2C7", action: "BUY", token: "SOL", amount: "1,200 SOL", usd: "$213.6k", impact: "high" },
  { time: "32m ago", wallet: "0x2eA7...b3F9", action: "SELL", token: "POPCAT", amount: "45 SOL", usd: "$8.0k", impact: "low" },
  { time: "41m ago", wallet: "0x4fC1...d8E2", action: "BUY", token: "WIF", amount: "210 SOL", usd: "$37.4k", impact: "med" },
];

const TOP_WHALES = [
  { wallet: "0x7a3F...3f2e", label: "@sol_architect", trades: 312, pnl: "+$342.1k", winRate: 87 },
  { wallet: "0x9e0D...c7F3", label: "@whale_watcher", trades: 247, pnl: "+$218.4k", winRate: 82 },
  { wallet: "0x12aB...9f3e", label: "@smart_money", trades: 189, pnl: "+$189.7k", winRate: 79 },
  { wallet: "0x3bC8...f2A9", label: "@alpha_hunter", trades: 156, pnl: "+$156.3k", winRate: 76 },
  { wallet: "0x5cA2...b1E4", label: "@degen_king", trades: 203, pnl: "+$134.2k", winRate: 74 },
];

const FILTERS = ["All", "Buy", "Sell", "High Impact"];

export default function WhalesPage() {
  const [filter, setFilter] = useState("All");
  const [tx, setTx] = useState(WHALE_TX);

  useEffect(() => {
    const interval = setInterval(() => {
      const actions = ["BUY", "SELL"];
      const tokens = ["BONK", "WIF", "JUP", "PYTH", "POPCAT", "SOL"];
      const wallets = ["0x7a3F...3f2e", "0x9e0D...c7F3", "0x12aB...9f3e", "0x3bC8...f2A9", "0x5cA2...b1E4"];
      const impacts = ["high", "med", "low"];
      const newTx = {
        time: "just now",
        wallet: wallets[Math.floor(Math.random() * wallets.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        token: tokens[Math.floor(Math.random() * tokens.length)],
        amount: `${Math.floor(Math.random() * 500 + 10)} SOL`,
        usd: `$${(Math.random() * 100 + 5).toFixed(1)}k`,
        impact: impacts[Math.floor(Math.random() * impacts.length)],
      };
      setTx((prev) => [newTx, ...prev].slice(0, 12));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === "All" ? tx :
    filter === "High Impact" ? tx.filter((t) => t.impact === "high") :
    tx.filter((t) => t.action === filter);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Live Transaction Stream — 8 cols */}
        <div className="xl:col-span-8 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#00ff9f]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Live Transaction Stream</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
            </div>
            <div className="flex gap-1">
              {FILTERS.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={["px-2 py-0.5 text-[9px] rounded transition-colors cursor-pointer", filter === f ? "bg-[#00ff9f]/10 text-[#00ff9f]" : "bg-[#222] text-[#52525b] hover:text-white"].join(" ")}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-[#52525b] text-[9px] border-b border-[#222]">
                <th className="text-left py-1.5 px-2">Time</th>
                <th className="text-left py-1.5 px-2">Wallet</th>
                <th className="text-center py-1.5 px-2">Action</th>
                <th className="text-left py-1.5 px-2">Token</th>
                <th className="text-right py-1.5 px-2">Amount</th>
                <th className="text-right py-1.5 px-2">USD</th>
                <th className="text-center py-1.5 px-2">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filtered.map((t, i) => (
                <tr key={i} className="hover:bg-[#1a1a1a]">
                  <td className="py-1.5 px-2 text-[#52525b] text-[10px]">{t.time}</td>
                  <td className="py-1.5 px-2 text-[#3b82f6] text-[10px]">{t.wallet}</td>
                  <td className="py-1.5 px-2 text-center">
                    <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded", t.action === "BUY" ? "bg-[#00ff9f]/10 text-[#00ff9f]" : "bg-[#ff3b5c]/10 text-[#ff3b5c]"].join(" ")}>{t.action}</span>
                  </td>
                  <td className="py-1.5 px-2 text-white text-[10px] font-bold">${t.token}</td>
                  <td className="py-1.5 px-2 text-right text-white text-[10px]">{t.amount}</td>
                  <td className="py-1.5 px-2 text-right text-[#a1a1aa] text-[10px]">{t.usd}</td>
                  <td className="py-1.5 px-2 text-center">
                    <span className={["text-[9px] font-bold", t.impact === "high" ? "text-[#ff3b5c]" : t.impact === "med" ? "text-[#f59e0b]" : "text-[#52525b]"].join(" ")}>{t.impact.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Whales — 4 cols */}
        <div className="xl:col-span-4 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Top Whales (7D)</span>
          </div>
          <div className="space-y-2">
            {TOP_WHALES.map((w, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#222] last:border-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-white font-bold">#{i + 1}</span>
                    <span className="font-mono text-[10px] text-[#3b82f6]">{w.wallet}</span>
                  </div>
                  <span className="font-mono text-[9px] text-[#52525b]">{w.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] text-[#00ff9f] font-bold">{w.pnl}</div>
                  <div className="font-mono text-[9px] text-[#52525b]">{w.winRate}% win · {w.trades} trades</div>
                </div>
              </div>
            ))}
          </div>

          {/* Whale Stats */}
          <div className="mt-4 pt-3 border-t border-[#222]">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-mono text-[9px] text-[#52525b]">Tracked</div>
                <div className="font-mono text-sm text-white font-bold">1,203</div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-[#52525b]">24h Volume</div>
                <div className="font-mono text-sm text-white font-bold">$742M</div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-[#52525b]">Buys</div>
                <div className="font-mono text-sm text-[#00ff9f] font-bold">67%</div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-[#52525b]">Sells</div>
                <div className="font-mono text-sm text-[#ff3b5c] font-bold">33%</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
