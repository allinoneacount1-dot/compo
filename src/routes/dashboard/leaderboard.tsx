"use client";

import { Trophy, TrendingUp, Search } from "lucide-react";

const LEADERS = [
  { rank: 1, trader: "0x7a3F...3f2e", label: "@sol_architect", alpha: 87, pnl24h: "+$124.8k", pnl7d: "+$342.1k", winRate: 87, trades: 312, verified: true },
  { rank: 2, trader: "0x9e0D...c7F3", label: "@whale_watcher", alpha: 84, pnl24h: "+$87.3k", pnl7d: "+$218.4k", winRate: 82, trades: 247, verified: true },
  { rank: 3, trader: "0x3bC8...f2A9", label: "@mech_degen", alpha: 81, pnl24h: "+$64.2k", pnl7d: "+$189.7k", winRate: 79, trades: 189, verified: true },
  { rank: 4, trader: "0x5cA2...b1E4", label: "@alpha_hunter", alpha: 78, pnl24h: "+$42.1k", pnl7d: "+$156.3k", winRate: 76, trades: 156, verified: false },
  { rank: 5, trader: "0x1fE5...a8D6", label: "@smart_money", alpha: 75, pnl24h: "+$38.9k", pnl7d: "+$134.2k", winRate: 74, trades: 203, verified: true },
  { rank: 6, trader: "0x8dF3...a2C7", label: "@degen_king", alpha: 72, pnl24h: "+$28.4k", pnl7d: "+$98.7k", winRate: 71, trades: 178, verified: false },
  { rank: 7, trader: "0x2eA7...b3F9", label: "@narrative_pro", alpha: 69, pnl24h: "+$21.7k", pnl7d: "+$87.4k", winRate: 68, trades: 145, verified: true },
  { rank: 8, trader: "0x4fC1...d8E2", label: "@early_caller", alpha: 66, pnl24h: "+$18.3k", pnl7d: "+$76.2k", winRate: 65, trades: 132, verified: false },
];

export default function LeaderboardPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-[#00ff9f]" />
          <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Leaderboard</span>
        </div>
        <div className="flex gap-1">
          {["All Time", "This Week", "Verified"].map((t) => (
            <button key={t} className={["px-2 py-0.5 text-[10px] rounded-lg transition-colors cursor-pointer", t === "All Time" ? "bg-[#00ff9f]/10 text-[#00ff9f]" : "bg-[#222] text-[#52525b] hover:text-white"].join(" ")}>{t}</button>
          ))}
        </div>
      </div>
      <div className="bg-[#161616] border border-[#222] rounded-xl overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="bg-[#111] text-[#52525b] text-[9px]">
              <th className="px-3 py-2 text-left">Rank</th>
              <th className="px-3 py-2 text-left">Trader</th>
              <th className="px-3 py-2 text-center">Alpha</th>
              <th className="px-3 py-2 text-right">24h P&L</th>
              <th className="px-3 py-2 text-right">7d P&L</th>
              <th className="px-3 py-2 text-center">Win</th>
              <th className="px-3 py-2 text-center">Trades</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {LEADERS.map((l) => (
              <tr key={l.rank} className={["hover:bg-[#1a1a1a]", l.rank <= 3 ? "border-l-2 border-l-[#00ff9f]" : ""].join(" ")}>
                <td className="px-3 py-2">
                  <span className={["font-bold text-[11px]", l.rank === 1 ? "text-[#00ff9f]" : l.rank === 2 ? "text-[#a1a1aa]" : l.rank === 3 ? "text-[#f59e0b]" : "text-[#52525b]"].join(" ")}>
                    #{l.rank}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-[11px]">{l.trader}</span>
                    {l.verified && <span className="text-[8px] bg-[#00ff9f]/10 text-[#00ff9f] px-1 py-0.5 rounded">✓</span>}
                  </div>
                  <span className="text-[9px] text-[#52525b]">{l.label}</span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="text-[#00ff9f] font-bold text-[11px]">{l.alpha}</span>
                </td>
                <td className="px-3 py-2 text-right text-[#00ff9f] text-[10px]">{l.pnl24h}</td>
                <td className="px-3 py-2 text-right text-[#00ff9f] text-[10px]">{l.pnl7d}</td>
                <td className="px-3 py-2 text-center text-[#a1a1aa] text-[10px]">{l.winRate}%</td>
                <td className="px-3 py-2 text-center text-[#52525b] text-[10px]">{l.trades}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
