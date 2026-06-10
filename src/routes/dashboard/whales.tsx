"use client";

import { useState, useEffect } from "react";
import { Activity, ArrowUpRight, ArrowDownRight, ExternalLink, Filter, Download } from "lucide-react";

interface WhaleTx {
  id: number;
  time: string;
  wallet: string;
  action: "BUY" | "SELL";
  token: string;
  amount: string;
}

const TOP_WHALES = [
  { wallet: "0x12aB...9f3e", volume: "+12.4k SOL", change: "+2.1%", isPositive: true },
  { wallet: "0x9e0D...c7F3", volume: "-8.9k SOL", change: "-1.4%", isPositive: false },
  { wallet: "0x7a3F...3f2e", volume: "+6.2k SOL", change: "+0.8%", isPositive: true },
  { wallet: "0x3bC8...f2A9", volume: "-4.1k SOL", change: "-0.5%", isPositive: false },
  { wallet: "0x5cA2...b1E4", volume: "+3.8k SOL", change: "+0.4%", isPositive: true },
];

const NOTABLE = [
  { text: "Smart Money bought 500 SOL of WIF", type: "buy" },
  { text: "Known rugger wallet active — 3 new tokens", type: "danger" },
  { text: "Whale accumulated $2.1M in RWA tokens", type: "buy" },
];

export default function WhaleRadarPage() {
  const [transactions, setTransactions] = useState<WhaleTx[]>([
    { id: 1, time: "just now", wallet: "0x7a3F...3f2e", action: "BUY", token: "BONK", amount: "42.5 SOL" },
    { id: 2, time: "1m ago", wallet: "0x9e0D...c7F3", action: "SELL", token: "WIF", amount: "120 SOL" },
    { id: 3, time: "3m ago", wallet: "0x3bC8...f2A9", action: "BUY", token: "POPCAT", amount: "68.3 SOL" },
    { id: 4, time: "5m ago", wallet: "0x5cA2...b1E4", action: "BUY", token: "PYTH", amount: "215.7 SOL" },
    { id: 5, time: "8m ago", wallet: "0x1fE5...a8D6", action: "SELL", token: "JUP", amount: "512 SOL" },
  ]);
  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all");

  // Real-time simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const tokens = ["BONK", "WIF", "POPCAT", "JUP", "PYTH"];
      const newTx: WhaleTx = {
        id: Date.now(),
        time: "just now",
        wallet: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        action: Math.random() > 0.5 ? "BUY" : "SELL",
        token: tokens[Math.floor(Math.random() * tokens.length)],
        amount: `${(Math.random() * 300 + 20).toFixed(1)} SOL`,
      };
      setTransactions((prev) => [newTx, ...prev].slice(0, 30));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.action.toLowerCase() === filter);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live Transaction Stream — 7 cols */}
        <div className="lg:col-span-7 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#00ff9f]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Live Transaction Stream</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-[#00ff9f] text-black rounded font-bold">LIVE</span>
            </div>
            <div className="flex items-center gap-2">
              {(["all", "buy", "sell"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={["px-2 py-0.5 text-[10px] rounded transition-colors", filter === f ? "bg-[#00ff9f]/10 text-[#00ff9f]" : "bg-[#222] text-[#52525b] hover:text-white"].join(" ")}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-auto max-h-[520px]">
            <table className="w-full text-sm font-mono">
              <thead className="text-[#52525b] text-[10px] sticky top-0 bg-[#161616]">
                <tr>
                  <th className="text-left py-2 px-2">Time</th>
                  <th className="text-left py-2 px-2">Wallet</th>
                  <th className="text-left py-2 px-2">Action</th>
                  <th className="text-left py-2 px-2">Token</th>
                  <th className="text-right py-2 px-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#1a1a1a]">
                    <td className="py-2 px-2 text-[#52525b] text-[11px]">{tx.time}</td>
                    <td className="py-2 px-2 text-[#3b82f6] text-[11px]">{tx.wallet}</td>
                    <td className="py-2 px-2">
                      <span className={["text-[10px] font-bold px-1.5 py-0.5 rounded", tx.action === "BUY" ? "text-[#00ff9f] bg-[#00ff9f]/10" : "text-[#ff3b5c] bg-[#ff3b5c]/10"].join(" ")}>
                        {tx.action}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-white text-[11px]">{tx.token}</td>
                    <td className="py-2 px-2 text-right text-[#a1a1aa] text-[11px]">{tx.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel — 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          {/* Top Whales */}
          <div className="bg-[#161616] border border-[#222] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Top Whales by Volume (24H)</span>
            </div>
            <div className="space-y-2">
              {TOP_WHALES.map((w, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#52525b]">#{i + 1}</span>
                    <span className="font-mono text-[11px] text-[#3b82f6]">{w.wallet}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-white">{w.volume}</span>
                    <span className={["font-mono text-[10px]", w.isPositive ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>{w.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notable Movements */}
          <div className="bg-[#161616] border border-[#222] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Notable Movements</span>
            </div>
            <div className="space-y-2">
              {NOTABLE.map((n, i) => (
                <div key={i} className={["bg-[#111] p-3 rounded-lg text-[11px]", n.type === "danger" ? "border-l-2 border-[#ff3b5c]" : "border-l-2 border-[#00ff9f]"].join(" ")}>
                  {n.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
