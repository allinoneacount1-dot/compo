"use client";

import { useState } from "react";
import { Crosshair, Zap, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const POSITIONS = [
  { token: "BONK", entry: 0.000008, current: 0.000012, qty: "124.5M", pnl: 1248, pct: 12.4, tp: 0.000015, sl: 0.000006, status: "open" },
  { token: "WIF", entry: 3.2, current: 2.84, qty: "8,420", pnl: -3031, pct: -3.2, tp: 4.0, sl: 2.5, status: "open" },
  { token: "POPCAT", entry: 0.35, current: 0.412, qty: "12,800", pnl: 793, pct: 8.7, tp: 0.5, sl: 0.3, status: "open" },
  { token: "JUP", entry: 0.98, current: 0.921, qty: "5,200", pnl: -306, pct: -1.8, tp: 1.2, sl: 0.8, status: "open" },
];

function formatPrice(p: number): string {
  if (p >= 1) return `$${p.toFixed(2)}`;
  if (p >= 0.0001) return `$${p.toFixed(6)}`;
  return `$${p.toFixed(8)}`;
}

export default function SniperPage() {
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [priority, setPriority] = useState("medium");

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Quick Snipe — 5 cols */}
        <div className="xl:col-span-5 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Crosshair className="w-3.5 h-3.5 text-[#00ff9f]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Quick Snipe</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="font-mono text-[9px] text-[#52525b] mb-1 block">Token Address</label>
              <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste token address..." className="w-full h-10 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#00ff9f]/40 font-mono" />
            </div>
            <div>
              <label className="font-mono text-[9px] text-[#52525b] mb-1 block">Amount (SOL)</label>
              <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" className="w-full h-10 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#00ff9f]/40 font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-mono text-[9px] text-[#52525b] mb-1 block">Slippage</label>
                <select value={slippage} onChange={(e) => setSlippage(Number(e.target.value))} className="w-full h-10 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none font-mono">
                  <option value={0.5}>0.5%</option>
                  <option value={1}>1%</option>
                  <option value={2}>2%</option>
                  <option value={5}>5%</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[9px] text-[#52525b] mb-1 block">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full h-10 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none font-mono">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="turbo">Turbo</option>
                </select>
              </div>
            </div>
            <button className="w-full h-10 bg-[#00ff9f] text-black font-semibold rounded-lg hover:bg-[#00e08f] transition-colors font-mono text-sm flex items-center justify-center gap-2 cursor-pointer">
              <Zap className="w-3.5 h-3.5" /> EXECUTE SNIPE
            </button>
          </div>

          {/* Presets */}
          <div className="mt-4 pt-3 border-t border-[#222]">
            <span className="font-mono text-[9px] text-[#52525b]">Quick Amount:</span>
            <div className="flex gap-2 mt-2">
              {["0.1 SOL", "0.5 SOL", "1 SOL", "5 SOL"].map((p) => (
                <button key={p} onClick={() => setAmount(p.split(" ")[0])} className="px-2 py-1 text-[10px] bg-[#222] text-[#52525b] rounded hover:text-white transition-colors cursor-pointer font-mono">{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Positions — 7 cols */}
        <div className="xl:col-span-7 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#00ff9f]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Active Positions</span>
            </div>
            <span className="font-mono text-[10px] text-[#52525b]">{POSITIONS.length} open</span>
          </div>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-[#52525b] text-[9px] border-b border-[#222]">
                <th className="text-left py-1.5 px-2">Token</th>
                <th className="text-right py-1.5 px-2">Entry</th>
                <th className="text-right py-1.5 px-2">Current</th>
                <th className="text-right py-1.5 px-2">Qty</th>
                <th className="text-right py-1.5 px-2">P&L</th>
                <th className="text-center py-1.5 px-2">TP</th>
                <th className="text-center py-1.5 px-2">SL</th>
                <th className="text-center py-1.5 px-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {POSITIONS.map((p) => (
                <tr key={p.token} className="hover:bg-[#1a1a1a]">
                  <td className="py-1.5 px-2 text-[#00ff9f] font-bold text-[11px]">${p.token}</td>
                  <td className="py-1.5 px-2 text-right text-[#52525b] text-[10px]">{formatPrice(p.entry)}</td>
                  <td className="py-1.5 px-2 text-right text-white text-[10px]">{formatPrice(p.current)}</td>
                  <td className="py-1.5 px-2 text-right text-[#a1a1aa] text-[10px]">{p.qty}</td>
                  <td className={["py-1.5 px-2 text-right text-[10px] font-bold", p.pnl >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                    {p.pnl >= 0 ? "+" : ""}${p.pnl.toLocaleString()} ({p.pct >= 0 ? "+" : ""}{p.pct}%)
                  </td>
                  <td className="py-1.5 px-2 text-center text-[#00ff9f] text-[10px]">{formatPrice(p.tp)}</td>
                  <td className="py-1.5 px-2 text-center text-[#ff3b5c] text-[10px]">{formatPrice(p.sl)}</td>
                  <td className="py-1.5 px-2 text-center">
                    <button className="text-[9px] px-2 py-0.5 bg-[#ff3b5c] text-white rounded hover:bg-[#cc2f4a] cursor-pointer">CLOSE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
