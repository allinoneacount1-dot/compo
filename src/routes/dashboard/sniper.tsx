"use client";

import { useState } from "react";
import { Zap, TrendingUp, TrendingDown } from "lucide-react";

const POSITIONS = [
  { token: "BONK", entry: 0.000012, current: 0.000019, pnl: 52.4, amount: "124.5M" },
  { token: "WIF", entry: 3.2, current: 2.84, pnl: -11.3, amount: "8,420" },
  { token: "POPCAT", entry: 0.35, current: 0.412, pnl: 17.7, amount: "12,800" },
  { token: "JUP", entry: 0.98, current: 0.921, pnl: -6.0, amount: "5,200" },
];

export default function SniperPage() {
  const [contract, setContract] = useState("");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("1");

  return (
    <div className="p-6 max-w-[1100px]">
      {/* Quick Snipe */}
      <div className="bg-[#161616] border border-[#222] rounded-xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-[#ff3b5c]" />
          <span className="font-mono text-sm font-semibold">Quick Snipe</span>
        </div>
        <div className="space-y-3">
          <input type="text" value={contract} onChange={(e) => setContract(e.target.value)} placeholder="Token contract address..." className="w-full h-12 bg-[#111] border border-[#222] rounded-lg px-4 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#ff3b5c]/40 font-mono" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-mono text-[10px] text-[#52525b] mb-1 block">Amount (SOL)</label>
              <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" className="w-full h-11 bg-[#111] border border-[#222] rounded-lg px-4 text-sm text-white placeholder:text-[#52525b] focus:outline-none font-mono" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#52525b] mb-1 block">Slippage (%)</label>
              <select value={slippage} onChange={(e) => setSlippage(e.target.value)} className="w-full h-11 bg-[#111] border border-[#222] rounded-lg px-4 text-sm text-white focus:outline-none font-mono">
                <option value="0.5">0.5%</option>
                <option value="1">1%</option>
                <option value="2">2%</option>
                <option value="5">5%</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#52525b] mb-1 block">Priority</label>
              <select className="w-full h-11 bg-[#111] border border-[#222] rounded-lg px-4 text-sm text-white focus:outline-none font-mono">
                <option>Normal</option>
                <option>Fast</option>
                <option>Turbo</option>
              </select>
            </div>
          </div>
          <button className="w-full h-14 bg-[#ff3b5c] text-white font-bold rounded-lg hover:bg-[#cc2f4a] transition-colors text-sm">
            ⚡ EXECUTE SNIPE
          </button>
        </div>
      </div>

      {/* Active Positions */}
      <div className="bg-[#161616] border border-[#222] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Active Positions ({POSITIONS.length})</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {POSITIONS.map((p) => (
            <div key={p.token} className="bg-[#111] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-white">${p.token}</span>
                <span className={["font-mono text-sm font-bold flex items-center gap-1", p.pnl >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                  {p.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {p.pnl >= 0 ? "+" : ""}{p.pnl}%
                </span>
              </div>
              <div className="text-[10px] text-[#52525b] space-y-0.5">
                <div>Entry: ${p.entry} → Current: ${p.current}</div>
                <div>Amount: {p.amount}</div>
              </div>
              <div className="flex gap-1 mt-3">
                <button className="flex-1 text-[10px] py-1 bg-[#222] text-[#a1a1aa] rounded hover:bg-[#333]">25%</button>
                <button className="flex-1 text-[10px] py-1 bg-[#222] text-[#a1a1aa] rounded hover:bg-[#333]">50%</button>
                <button className="flex-1 text-[10px] py-1 bg-[#ff3b5c] text-white rounded hover:bg-[#cc2f4a]">All</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
