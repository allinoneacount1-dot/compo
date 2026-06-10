"use client";

import { Wallet, TrendingUp, TrendingDown, Download, Eye } from "lucide-react";

const HOLDINGS = [
  { token: "BONK", amount: "124,500,000", avgBuy: 0.000008, current: 0.000012, pnl: 124800, pct: 42 },
  { token: "WIF", amount: "8,420", avgBuy: 3.2, current: 2.84, pnl: -3031, pct: 18 },
  { token: "POPCAT", amount: "12,800", avgBuy: 0.35, current: 0.412, pnl: 7936, pct: 12 },
  { token: "JUP", amount: "5,200", avgBuy: 0.98, current: 0.921, pnl: -3068, pct: 8 },
  { token: "PYTH", amount: "3,100", avgBuy: 0.42, current: 0.384, pnl: -1116, pct: 5 },
  { token: "SOL", amount: "42.5", avgBuy: 165, current: 178, pnl: 5525, pct: 15 },
];

const totalValue = HOLDINGS.reduce((s, h) => s + h.pnl + (h.avgBuy * parseFloat(h.amount)), 0);
const totalPnl = HOLDINGS.reduce((s, h) => s + h.pnl, 0);

export default function PortfolioPage() {
  return (
    <div className="p-6">
      {/* Total Value */}
      <div className="bg-[#161616] border border-[#222] rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider mb-1">Total Portfolio Value</div>
            <div className="text-5xl font-semibold tracking-tight">${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={["font-mono text-sm font-bold", totalPnl >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()} today
              </span>
              <span className="font-mono text-[10px] text-[#52525b]">({((totalPnl / (totalValue - totalPnl)) * 100).toFixed(2)}%)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider mb-1">Risk Score</div>
            <div className="text-3xl font-bold text-[#00ff9f]">43 <span className="text-xs text-[#52525b]">/100</span></div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-[#161616] border border-[#222] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5 text-[#00ff9f]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Holdings ({HOLDINGS.length})</span>
          </div>
          <button className="flex items-center gap-1 px-2 py-1 text-[10px] bg-[#222] text-[#a1a1aa] rounded hover:bg-[#333] transition-colors">
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>

        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="text-[#52525b] text-[10px] border-b border-[#222]">
              <th className="text-left py-2 px-2">Token</th>
              <th className="text-right py-2 px-2">Amount</th>
              <th className="text-right py-2 px-2">Avg Buy</th>
              <th className="text-right py-2 px-2">Current</th>
              <th className="text-right py-2 px-2">P&L</th>
              <th className="text-right py-2 px-2">% Portfolio</th>
              <th className="text-right py-2 px-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {HOLDINGS.map((h) => (
              <tr key={h.token} className="hover:bg-[#1a1a1a]">
                <td className="py-2 px-2 text-[#00ff9f] font-bold text-[11px]">${h.token}</td>
                <td className="py-2 px-2 text-right text-white text-[11px]">{h.amount}</td>
                <td className="py-2 px-2 text-right text-[#52525b] text-[11px]">${h.avgBuy}</td>
                <td className="py-2 px-2 text-right text-white text-[11px]">${h.current}</td>
                <td className={["py-2 px-2 text-right font-bold text-[11px]", h.pnl >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                  {h.pnl >= 0 ? "+" : ""}${h.pnl.toLocaleString()}
                </td>
                <td className="py-2 px-2 text-right text-[#52525b] text-[11px]">{h.pct}%</td>
                <td className="py-2 px-2 text-right">
                  <button className="text-[10px] px-2 py-0.5 bg-[#ff3b5c] text-white rounded hover:bg-[#cc2f4a]">Sell</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
